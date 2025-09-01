# 🚀 表白网站服务器部署指南

## 📋 部署前准备

### 1. 服务器要求
- **操作系统**: Ubuntu 20.04+ 或 CentOS 7+
- **内存**: 最少 1GB RAM
- **存储**: 最少 10GB 硬盘空间
- **网络**: 公网IP地址
- **域名**: 已购买的域名（可选）

### 2. 软件依赖
- Nginx 1.18+
- Certbot (Let's Encrypt)
- Node.js 16+ (用于构建优化)

## 🛠️ 部署步骤

### 第一步：服务器环境准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要软件
sudo apt install -y nginx certbot python3-certbot-nginx curl wget git

# 启动并启用Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查Nginx状态
sudo systemctl status nginx
```

### 第二步：上传网站文件

```bash
# 创建网站目录
sudo mkdir -p /var/www/love-website

# 上传文件到服务器（使用scp或rsync）
scp -r ./* user@your-server:/var/www/love-website/

# 或者使用git克隆
cd /var/www/love-website
git clone https://github.com/your-username/love-website.git .
```

### 第三步：配置Nginx

```bash
# 复制Nginx配置文件
sudo cp nginx.conf /etc/nginx/sites-available/love-website

# 创建软链接启用站点
sudo ln -s /etc/nginx/sites-available/love-website /etc/nginx/sites-enabled/

# 删除默认站点（可选）
sudo rm /etc/nginx/sites-enabled/default

# 测试Nginx配置
sudo nginx -t

# 重载Nginx
sudo systemctl reload nginx
```

### 第四步：配置SSL证书

```bash
# 修改域名配置
sudo nano ssl-setup.sh
# 将 your-domain.com 替换为你的实际域名
# 将 your-email@example.com 替换为你的邮箱

# 运行SSL配置脚本
sudo ./ssl-setup.sh
```

### 第五步：设置自动备份

```bash
# 创建备份目录
sudo mkdir -p /var/backups/love-website

# 设置定时备份（每天凌晨2点）
sudo crontab -e
# 添加以下行：
# 0 2 * * * /path/to/your/backup.sh

# 测试备份脚本
sudo ./backup.sh
```

## 🔧 性能优化

### 1. 启用Gzip压缩
Nginx配置已包含Gzip压缩设置，无需额外配置。

### 2. 静态资源优化
```bash
# 安装Node.js构建工具
sudo apt install -y nodejs npm

# 安装依赖
npm install

# 构建优化版本
npm run build
```

### 3. 配置CDN（可选）
- 使用阿里云CDN、腾讯云CDN或Cloudflare
- 配置静态资源缓存策略
- 设置缓存过期时间

## 📊 监控和统计

### 1. 访问统计
- 在 `index.html` 中添加Google Analytics代码
- 或使用百度统计、友盟等国内统计服务

### 2. 服务器监控
```bash
# 安装htop监控系统资源
sudo apt install -y htop

# 监控Nginx访问日志
sudo tail -f /var/log/nginx/love-website.access.log

# 监控错误日志
sudo tail -f /var/log/nginx/love-website.error.log
```

### 3. 使用监控面板
访问 `https://your-domain.com/monitoring.html` 查看网站统计信息。

## 🔒 安全配置

### 1. 防火墙设置
```bash
# 安装UFW防火墙
sudo apt install -y ufw

# 配置防火墙规则
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# 启用防火墙
sudo ufw enable
```

### 2. 定期安全更新
```bash
# 设置自动安全更新
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 🚨 故障排除

### 常见问题

1. **网站无法访问**
   ```bash
   # 检查Nginx状态
   sudo systemctl status nginx
   
   # 检查端口占用
   sudo netstat -tlnp | grep :80
   sudo netstat -tlnp | grep :443
   ```

2. **SSL证书问题**
   ```bash
   # 检查证书状态
   sudo certbot certificates
   
   # 手动续期证书
   sudo certbot renew
   ```

3. **权限问题**
   ```bash
   # 设置正确的文件权限
   sudo chown -R www-data:www-data /var/www/love-website
   sudo chmod -R 755 /var/www/love-website
   ```

### 日志查看
```bash
# Nginx访问日志
sudo tail -f /var/log/nginx/love-website.access.log

# Nginx错误日志
sudo tail -f /var/log/nginx/love-website.error.log

# 系统日志
sudo journalctl -u nginx -f
```

## 📈 性能监控

### 1. 网站性能测试
- 使用Google PageSpeed Insights
- 使用GTmetrix进行性能分析
- 使用Pingdom进行全球访问测试

### 2. 服务器性能监控
```bash
# 实时监控系统资源
htop

# 监控磁盘使用
df -h

# 监控内存使用
free -h
```

## 🔄 更新和维护

### 1. 网站更新流程
```bash
# 1. 备份当前版本
sudo ./backup.sh

# 2. 更新网站文件
git pull origin main

# 3. 重新构建（如果需要）
npm run build

# 4. 重载Nginx
sudo systemctl reload nginx
```

### 2. 定期维护任务
- 每周检查服务器资源使用情况
- 每月更新系统和软件包
- 每季度检查SSL证书状态
- 定期清理日志文件

## 📞 技术支持

如果在部署过程中遇到问题：

1. 检查本文档的故障排除部分
2. 查看Nginx和系统日志
3. 确认域名DNS解析是否正确
4. 验证SSL证书配置

## 🎉 部署完成

恭喜！您的表白网站已经成功部署到服务器。

- **网站地址**: https://your-domain.com
- **监控面板**: https://your-domain.com/monitoring.html
- **备份目录**: /var/backups/love-website

祝您表白成功！💕