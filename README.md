# 💕 表白网站 💕

一个浪漫的表白网站，使用纯HTML、CSS和JavaScript制作，支持GitHub Pages和服务器部署。

## 📁 项目结构

```
love-website/
├── index.html             # 唯一入口（引用 src/style.css 与 src/script.js）
├── src/                   # 源码目录（CSS/JS及资产）
│   ├── style.css          # 样式文件
│   └── script.js          # 交互脚本
└── README.md              # 项目说明
```

## 🌟 功能特点

- 💖 浪漫的心形动画效果
- 🎨 渐变背景和现代化设计
- 💫 飘动的心形装饰
- 🎯 交互式按钮和惊喜效果
- 📱 响应式设计，支持移动端
- ✨ 点击波纹和爆炸效果
- 📸 画廊模态框（`showPhotoGallery()`）
- ⏰ 重要时刻倒计时（`showCountdown()`，默认目标为当前时间+1年）
- 🎵 简单音频提示（Web Audio API）
- 🔔 顶部右侧提示通知（`showNotification(message)`）
- 🖱️ 自定义爱心光标与跟随效果
- 🚥 页面可见性优化与基础性能监控

## 🚀 部署方式

### 方式一：GitHub Pages（推荐新手）

适合快速部署和分享，免费且简单。

### 1. 创建GitHub仓库

1. 登录GitHub，点击右上角的"+"号，选择"New repository"
2. 仓库名称建议使用：`love-website` 或 `confession-site`
3. 选择"Public"（公开仓库才能使用免费的GitHub Pages）
4. 勾选"Add a README file"
5. 点击"Create repository"

### 2. 上传源码文件

#### 方法一：使用Git命令行
```bash
# 克隆仓库到本地
git clone https://github.com/你的用户名/仓库名.git
cd 仓库名

# 将src目录下的文件复制到仓库根目录
cp src/* .

# 然后提交
git add .
git commit -m "添加表白网站源码"
git push origin main
```

#### 方法二：直接在GitHub网页上传
1. 在仓库页面点击"uploading an existing file"
2. 拖拽或选择src目录下的文件（index.html, style.css, script.js）
3. 填写提交信息，点击"Commit changes"

### 3. 启用GitHub Pages

1. 进入仓库的"Settings"页面
2. 在左侧菜单找到"Pages"
3. 在"Source"下选择"Deploy from a branch"
4. 选择"main"分支和"/ (root)"文件夹
5. 点击"Save"

### 4. 访问你的网站

几分钟后，你的网站就可以通过以下地址访问：
- `https://你的用户名.github.io/仓库名`

### 方式二：服务器部署（可选）

将本仓库作为静态站点部署到任意静态服务器（如Nginx/Apache）或对象存储（如阿里云OSS/腾讯云COS）。部署时确保 `index.html` 与 `src/` 保持原有相对路径结构即可。

## 🌐 自定义域名设置

### GitHub Pages自定义域名

#### 1. 购买域名
推荐域名注册商：
- 阿里云万网
- 腾讯云
- GoDaddy
- Namecheap

#### 2. 配置DNS
在你的域名管理面板中添加以下记录：

**CNAME记录（推荐）：**
```
类型: CNAME
名称: www
值: 你的用户名.github.io
TTL: 600
```

**A记录：**
```
类型: A
名称: @
值: 185.199.108.153
TTL: 600
```

#### 3. 在GitHub Pages中设置域名
1. 在仓库的"Settings" > "Pages"页面
2. 在"Custom domain"输入框中输入你的域名
3. 勾选"Enforce HTTPS"
4. 点击"Save"

#### 4. 创建CNAME文件（可选）
在仓库根目录创建 `CNAME` 文件，内容为你的域名：
```
yourdomain.com
```

### 服务器部署自定义域名
参照你的服务器/托管商文档配置自定义域名与HTTPS。

## 🔧 自定义网站内容

### 修改表白内容

编辑`src/index.html`文件中的以下部分：
```html
<p class="message">在这个特别的日子里，我想告诉你...</p>
<p class="love-text">你是我生命中最美好的遇见</p>
<p class="love-text">愿我们的故事永远继续下去</p>
```

### 修改颜色主题

编辑`src/style.css`文件中的颜色值：
```css
/* 背景渐变 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 心形颜色 */
background: #ff6b6b;

/* 按钮颜色 */
background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
```

### 添加更多功能

你可以在`src/script.js`中添加更多交互功能，比如：
- 音乐播放（可替换为自定义音频）
- 更多动画效果
- 照片展示（替换画廊占位为真实图片）
- 倒计时功能（自定义目标日期）

### 可配置项

- 倒计时目标：在 `showCountdown()` 中将 `targetDate` 修改为你的纪念日：
```js
const targetDate = new Date('2026-05-20T00:00:00');
```
- 画廊内容：在 `showPhotoGallery()` 里将占位符替换为 `<img src="...">` 或从数组动态生成。
- 提示信息：使用 `showNotification('你的提示')` 自定义消息。

## 📱 移动端优化

网站已经包含响应式设计，在手机上也能完美显示。如果需要进一步优化，可以调整`src/style.css`中的媒体查询部分。

## 🎨 设计建议

1. **颜色搭配**：使用温暖的色调，如粉色、红色、紫色
2. **字体选择**：选择优雅的字体，如思源黑体、微软雅黑
3. **动画效果**：适度使用动画，不要过于花哨
4. **内容长度**：保持内容简洁，重点突出

## 📁 目录说明

- **`src/`** - 网站源码目录，包含CSS、JS以及静态资产
- **`README.md`** - 项目总体说明文档

## 🚀 部署选择

### GitHub Pages部署
- ✅ 免费托管
- ✅ 自动HTTPS
- ✅ 简单易用
- ❌ 功能有限
- ❌ 无法自定义服务器配置

### 服务器部署
- ✅ 完全控制
- ✅ 自定义域名
- ✅ 高级功能
- ✅ 性能优化
- ❌ 需要服务器成本
- ❌ 配置复杂

## 📞 技术支持

### GitHub Pages问题
1. 查看GitHub Pages的官方文档
2. 检查域名DNS配置是否正确
3. 确认仓库设置为公开
4. 等待DNS传播（通常需要几分钟到几小时）

### 服务器部署问题
请参考 [`server-deployment/DEPLOYMENT.md`](server-deployment/DEPLOYMENT.md) 中的故障排除部分。

祝你表白成功！💕