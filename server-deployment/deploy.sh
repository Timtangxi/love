#!/bin/bash

# 表白网站高级部署脚本
# 使用方法: ./deploy.sh [选项]
# 选项:
#   --domain=域名    设置域名
#   --email=邮箱     设置邮箱
#   --ssl           自动配置SSL
#   --monitoring    启用监控
#   --backup        部署前备份

set -e

# 配置变量
PROJECT_NAME="love-website"
WEB_ROOT="/var/www/love-website"
BACKUP_DIR="/var/backups/love-website"
NGINX_CONFIG="/etc/nginx/sites-available/love-website"
NGINX_ENABLED="/etc/nginx/sites-enabled/love-website"
LOG_DIR="/var/log/love-website"
DOMAIN=""
EMAIL=""
AUTO_SSL=false
ENABLE_MONITORING=false
ENABLE_BACKUP=true

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --domain=*)
            DOMAIN="${1#*=}"
            shift
            ;;
        --email=*)
            EMAIL="${1#*=}"
            shift
            ;;
        --ssl)
            AUTO_SSL=true
            shift
            ;;
        --monitoring)
            ENABLE_MONITORING=true
            shift
            ;;
        --backup)
            ENABLE_BACKUP=true
            shift
            ;;
        --help)
            echo "表白网站部署脚本"
            echo "使用方法: $0 [选项]"
            echo "选项:"
            echo "  --domain=域名    设置域名"
            echo "  --email=邮箱     设置邮箱"
            echo "  --ssl           自动配置SSL"
            echo "  --monitoring    启用监控"
            echo "  --backup        部署前备份"
            echo "  --help          显示帮助"
            exit 0
            ;;
        *)
            echo "未知选项: $1"
            echo "使用 --help 查看帮助"
            exit 1
            ;;
    esac
done

# 显示启动信息
echo -e "${GREEN}🚀 开始部署表白网站...${NC}"
echo -e "${BLUE}📋 部署配置:${NC}"
echo -e "  项目名称: $PROJECT_NAME"
echo -e "  网站目录: $WEB_ROOT"
echo -e "  备份目录: $BACKUP_DIR"
echo -e "  域名: ${DOMAIN:-"未设置"}"
echo -e "  邮箱: ${EMAIL:-"未设置"}"
echo -e "  自动SSL: $AUTO_SSL"
echo -e "  启用监控: $ENABLE_MONITORING"
echo -e "  启用备份: $ENABLE_BACKUP"
echo ""

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ 请使用root权限运行此脚本${NC}"
    exit 1
fi

# 系统检查
echo -e "${YELLOW}🔍 检查系统环境...${NC}"
check_system() {
    # 检查操作系统
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo -e "  操作系统: $PRETTY_NAME"
    fi
    
    # 检查内存
    MEMORY=$(free -h | awk '/^Mem:/ {print $2}')
    echo -e "  内存: $MEMORY"
    
    # 检查磁盘空间
    DISK=$(df -h / | awk 'NR==2 {print $4}')
    echo -e "  可用磁盘: $DISK"
    
    # 检查Nginx
    if command -v nginx &> /dev/null; then
        NGINX_VERSION=$(nginx -v 2>&1 | cut -d' ' -f3)
        echo -e "  Nginx版本: $NGINX_VERSION"
    else
        echo -e "${RED}  ❌ Nginx未安装${NC}"
        exit 1
    fi
}
check_system

# 创建必要的目录
echo -e "${YELLOW}📁 创建目录结构...${NC}"
mkdir -p $WEB_ROOT
mkdir -p $BACKUP_DIR
mkdir -p $LOG_DIR
mkdir -p /var/log/nginx

# 备份现有文件
if [ "$ENABLE_BACKUP" = true ] && [ -d "$WEB_ROOT" ] && [ "$(ls -A $WEB_ROOT)" ]; then
    echo -e "${YELLOW}💾 备份现有文件...${NC}"
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    cp -r $WEB_ROOT $BACKUP_DIR/$BACKUP_NAME
    
    # 压缩备份
    cd $BACKUP_DIR
    tar -czf "$BACKUP_NAME.tar.gz" $BACKUP_NAME
    rm -rf $BACKUP_NAME
    
    echo -e "${GREEN}✅ 备份完成: $BACKUP_DIR/$BACKUP_NAME.tar.gz${NC}"
    
    # 清理旧备份（保留最近10个）
    OLD_BACKUPS=$(ls -t $BACKUP_DIR/*.tar.gz 2>/dev/null | tail -n +11)
    if [ -n "$OLD_BACKUPS" ]; then
        echo -e "${YELLOW}🧹 清理旧备份...${NC}"
        echo "$OLD_BACKUPS" | xargs rm -f
        echo -e "${GREEN}✅ 旧备份清理完成${NC}"
    fi
fi

# 复制网站文件
echo -e "${YELLOW}📋 复制网站文件...${NC}"
cp index.html $WEB_ROOT/
cp style.css $WEB_ROOT/
cp script.js $WEB_ROOT/

# 设置文件权限
echo -e "${YELLOW}🔐 设置文件权限...${NC}"
chown -R www-data:www-data $WEB_ROOT
chmod -R 755 $WEB_ROOT

# 配置Nginx
echo -e "${YELLOW}⚙️ 配置Nginx...${NC}"
if [ -f "$NGINX_CONFIG" ]; then
    rm $NGINX_CONFIG
fi

cp nginx.conf $NGINX_CONFIG

# 创建软链接
if [ -L "$NGINX_ENABLED" ]; then
    rm $NGINX_ENABLED
fi
ln -s $NGINX_CONFIG $NGINX_ENABLED

# 测试Nginx配置
echo -e "${YELLOW}🧪 测试Nginx配置...${NC}"
nginx -t

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx配置测试通过${NC}"
    
    # 重载Nginx
    echo -e "${YELLOW}🔄 重载Nginx...${NC}"
    systemctl reload nginx
    
    echo -e "${GREEN}🎉 部署完成！${NC}"
    echo -e "${GREEN}📱 网站已部署到: $WEB_ROOT${NC}"
    echo -e "${YELLOW}⚠️ 请记得配置SSL证书和域名解析${NC}"
else
    echo -e "${RED}❌ Nginx配置测试失败，请检查配置文件${NC}"
    exit 1
fi

# 显示部署信息
echo -e "\n${GREEN}📊 部署信息:${NC}"
echo -e "网站目录: $WEB_ROOT"
echo -e "Nginx配置: $NGINX_CONFIG"
echo -e "备份目录: $BACKUP_DIR"
echo -e "日志目录: /var/log/nginx/"

echo -e "\n${YELLOW}🔧 后续步骤:${NC}"
echo -e "1. 配置SSL证书"
echo -e "2. 设置域名解析"
echo -e "3. 测试网站访问"
echo -e "4. 配置监控和统计"