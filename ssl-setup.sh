#!/bin/bash

# SSL证书配置脚本
# 使用Let's Encrypt免费SSL证书

set -e

# 配置变量
DOMAIN="your-domain.com"
EMAIL="your-email@example.com"
WEB_ROOT="/var/www/love-website"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔒 开始配置SSL证书...${NC}"

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ 请使用root权限运行此脚本${NC}"
    exit 1
fi

# 安装certbot
echo -e "${YELLOW}📦 安装certbot...${NC}"
apt update
apt install -y certbot python3-certbot-nginx

# 获取SSL证书
echo -e "${YELLOW}🔐 获取SSL证书...${NC}"
certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# 设置自动续期
echo -e "${YELLOW}🔄 设置自动续期...${NC}"
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# 测试证书
echo -e "${YELLOW}🧪 测试SSL证书...${NC}"
certbot certificates

echo -e "${GREEN}✅ SSL证书配置完成！${NC}"
echo -e "${GREEN}🌐 网站现在可以通过HTTPS访问${NC}"
echo -e "${YELLOW}📅 证书将自动续期${NC}"