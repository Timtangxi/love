# 🚀 服务器部署配置

这个目录包含了将表白网站部署到服务器所需的所有配置文件和脚本。

## 📁 文件说明

### 核心配置文件
- **`nginx.conf`** - Nginx生产环境配置文件
- **`deploy.sh`** - 自动化部署脚本
- **`ssl-setup.sh`** - SSL证书配置脚本
- **`backup.sh`** - 自动备份脚本

### 监控和统计
- **`monitoring.html`** - 网站监控面板
- **`package.json`** - Node.js构建配置

### 容器化部署
- **`Dockerfile`** - Docker镜像构建文件
- **`docker-compose.yml`** - Docker Compose配置

### 文档
- **`DEPLOYMENT.md`** - 详细的服务器部署指南

## 🛠️ 快速开始

### 1. 环境准备
```bash
# 确保服务器已安装以下软件
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 2. 配置域名
```bash
# 编辑SSL配置脚本
nano ssl-setup.sh
# 将 your-domain.com 替换为你的实际域名
# 将 your-email@example.com 替换为你的邮箱
```

### 3. 部署网站
```bash
# 运行部署脚本
sudo ./deploy.sh
```

### 4. 配置SSL证书
```bash
# 运行SSL配置脚本
sudo ./ssl-setup.sh
```

## 🔧 详细配置

### Nginx配置
`nginx.conf` 包含了以下优化配置：
- HTTPS强制重定向
- Gzip压缩
- 静态资源缓存
- 安全头设置
- 访问日志记录

### 部署脚本
`deploy.sh` 自动完成：
- 创建目录结构
- 备份现有文件
- 复制网站文件
- 配置Nginx
- 设置文件权限

### SSL证书
`ssl-setup.sh` 使用Let's Encrypt：
- 自动获取免费SSL证书
- 配置自动续期
- 支持多域名

### 备份系统
`backup.sh` 提供：
- 自动备份网站文件
- 备份Nginx配置
- 备份SSL证书
- 压缩和清理旧备份

## 📊 监控功能

### 访问监控面板
部署完成后，访问 `https://your-domain.com/monitoring.html` 查看：
- 实时访问统计
- 访问趋势图表
- 设备来源分析
- 网站状态监控

### 集成统计服务
在 `monitoring.html` 中配置：
- Google Analytics
- 百度统计
- 其他统计服务

## 🐳 Docker部署

### 使用Docker Compose
```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 使用Dockerfile
```bash
# 构建镜像
docker build -t love-website .

# 运行容器
docker run -d -p 80:80 -p 443:443 love-website
```

## 🔒 安全配置

### 防火墙设置
```bash
# 安装UFW防火墙
sudo apt install -y ufw

# 配置防火墙规则
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 定期更新
```bash
# 设置自动安全更新
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 📈 性能优化

### 构建优化版本
```bash
# 安装Node.js
sudo apt install -y nodejs npm

# 安装依赖
npm install

# 构建优化版本
npm run build
```

### CDN配置
- 使用阿里云CDN、腾讯云CDN或Cloudflare
- 配置静态资源缓存策略
- 设置缓存过期时间

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

## 🔄 维护任务

### 定期维护
- 每周检查服务器资源使用情况
- 每月更新系统和软件包
- 每季度检查SSL证书状态
- 定期清理日志文件

### 更新流程
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

## 📞 技术支持

如果在部署过程中遇到问题：

1. 查看 `DEPLOYMENT.md` 中的详细指南
2. 检查Nginx和系统日志
3. 确认域名DNS解析是否正确
4. 验证SSL证书配置

## 🎯 部署检查清单

- [ ] 服务器环境准备完成
- [ ] 域名DNS解析配置正确
- [ ] Nginx配置文件修改完成
- [ ] 网站文件上传完成
- [ ] SSL证书配置完成
- [ ] 防火墙规则配置完成
- [ ] 备份脚本设置完成
- [ ] 监控面板访问正常
- [ ] 网站功能测试通过

部署完成后，您的表白网站将具备企业级的安全性和性能！💕