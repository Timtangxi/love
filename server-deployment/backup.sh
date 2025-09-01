#!/bin/bash

# 表白网站备份脚本
# 自动备份网站文件和配置

set -e

# 配置变量
PROJECT_NAME="love-website"
WEB_ROOT="/var/www/love-website"
BACKUP_DIR="/var/backups/love-website"
NGINX_CONFIG="/etc/nginx/sites-available/love-website"
RETENTION_DAYS=30

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}💾 开始备份表白网站...${NC}"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 生成备份文件名
BACKUP_NAME="love-website-backup-$(date +%Y%m%d-%H%M%S)"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

# 创建备份目录
mkdir -p $BACKUP_PATH

# 备份网站文件
echo -e "${YELLOW}📁 备份网站文件...${NC}"
cp -r $WEB_ROOT $BACKUP_PATH/

# 备份Nginx配置
echo -e "${YELLOW}⚙️ 备份Nginx配置...${NC}"
cp $NGINX_CONFIG $BACKUP_PATH/nginx.conf

# 备份SSL证书（如果存在）
if [ -d "/etc/letsencrypt/live" ]; then
    echo -e "${YELLOW}🔒 备份SSL证书...${NC}"
    cp -r /etc/letsencrypt $BACKUP_PATH/
fi

# 创建备份信息文件
echo -e "${YELLOW}📝 创建备份信息...${NC}"
cat > $BACKUP_PATH/backup-info.txt << EOF
备份时间: $(date)
网站目录: $WEB_ROOT
Nginx配置: $NGINX_CONFIG
备份大小: $(du -sh $BACKUP_PATH | cut -f1)
EOF

# 压缩备份
echo -e "${YELLOW}🗜️ 压缩备份文件...${NC}"
cd $BACKUP_DIR
tar -czf "$BACKUP_NAME.tar.gz" $BACKUP_NAME
rm -rf $BACKUP_NAME

# 清理旧备份
echo -e "${YELLOW}🧹 清理旧备份...${NC}"
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo -e "${GREEN}✅ 备份完成！${NC}"
echo -e "${GREEN}📦 备份文件: $BACKUP_DIR/$BACKUP_NAME.tar.gz${NC}"
echo -e "${GREEN}📊 备份大小: $(du -sh $BACKUP_DIR/$BACKUP_NAME.tar.gz | cut -f1)${NC}"

# 显示备份统计
BACKUP_COUNT=$(ls -1 $BACKUP_DIR/*.tar.gz 2>/dev/null | wc -l)
echo -e "${GREEN}📈 当前备份数量: $BACKUP_COUNT${NC}"