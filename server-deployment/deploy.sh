#!/bin/bash

# 表白网站部署脚本
# 使用方法: ./deploy.sh

set -e

# 配置变量
PROJECT_NAME="love-website"
WEB_ROOT="/var/www/love-website"
BACKUP_DIR="/var/backups/love-website"
NGINX_CONFIG="/etc/nginx/sites-available/love-website"
NGINX_ENABLED="/etc/nginx/sites-enabled/love-website"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 开始部署表白网站...${NC}"

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ 请使用root权限运行此脚本${NC}"
    exit 1
fi

# 创建必要的目录
echo -e "${YELLOW}📁 创建目录结构...${NC}"
mkdir -p $WEB_ROOT
mkdir -p $BACKUP_DIR
mkdir -p /var/log/nginx

# 备份现有文件
if [ -d "$WEB_ROOT" ] && [ "$(ls -A $WEB_ROOT)" ]; then
    echo -e "${YELLOW}💾 备份现有文件...${NC}"
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    cp -r $WEB_ROOT $BACKUP_DIR/$BACKUP_NAME
    echo -e "${GREEN}✅ 备份完成: $BACKUP_DIR/$BACKUP_NAME${NC}"
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