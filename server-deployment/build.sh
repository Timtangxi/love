#!/bin/bash

# 表白网站构建优化脚本
# 使用方法: ./build.sh

set -e

# 配置变量
BUILD_DIR="dist"
SRC_DIR=".."
MINIFY_CSS=true
MINIFY_JS=true
OPTIMIZE_IMAGES=true
GENERATE_SW=true

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🔨 开始构建表白网站...${NC}"

# 创建构建目录
echo -e "${YELLOW}📁 创建构建目录...${NC}"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# 复制基础文件
echo -e "${YELLOW}📋 复制基础文件...${NC}"
cp $SRC_DIR/index.html $BUILD_DIR/
cp $SRC_DIR/style.css $BUILD_DIR/
cp $SRC_DIR/script.js $BUILD_DIR/

# CSS优化
if [ "$MINIFY_CSS" = true ]; then
    echo -e "${YELLOW}🎨 优化CSS文件...${NC}"
    if command -v cleancss &> /dev/null; then
        cleancss -o $BUILD_DIR/style.min.css $BUILD_DIR/style.css
        mv $BUILD_DIR/style.min.css $BUILD_DIR/style.css
        echo -e "${GREEN}✅ CSS压缩完成${NC}"
    else
        echo -e "${YELLOW}⚠️ cleancss未安装，跳过CSS压缩${NC}"
    fi
fi

# JavaScript优化
if [ "$MINIFY_JS" = true ]; then
    echo -e "${YELLOW}⚡ 优化JavaScript文件...${NC}"
    if command -v uglifyjs &> /dev/null; then
        uglifyjs $BUILD_DIR/script.js -o $BUILD_DIR/script.min.js -c -m
        mv $BUILD_DIR/script.min.js $BUILD_DIR/script.js
        echo -e "${GREEN}✅ JavaScript压缩完成${NC}"
    else
        echo -e "${YELLOW}⚠️ uglifyjs未安装，跳过JavaScript压缩${NC}"
    fi
fi

# 生成Service Worker
if [ "$GENERATE_SW" = true ]; then
    echo -e "${YELLOW}🔧 生成Service Worker...${NC}"
    cat > $BUILD_DIR/sw.js << 'EOF'
const CACHE_NAME = 'love-website-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});
EOF
    echo -e "${GREEN}✅ Service Worker生成完成${NC}"
fi

# 生成manifest.json
echo -e "${YELLOW}📱 生成Web App Manifest...${NC}"
cat > $BUILD_DIR/manifest.json << 'EOF'
{
    "name": "表白网站",
    "short_name": "Love",
    "description": "一个浪漫的表白网站",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#667eea",
    "theme_color": "#ff6b6b",
    "icons": [
        {
            "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💕</text></svg>",
            "sizes": "192x192",
            "type": "image/svg+xml"
        }
    ]
}
EOF

# 更新HTML文件
echo -e "${YELLOW}📝 更新HTML文件...${NC}"
sed -i 's/href="style.css"/href="style.css" onload="this.onload=null;this.rel=\x27stylesheet\x27"/' $BUILD_DIR/index.html
sed -i 's/src="script.js"/src="script.js" defer/' $BUILD_DIR/index.html

# 添加Service Worker注册
cat >> $BUILD_DIR/index.html << 'EOF'

<script>
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
</script>
EOF

# 生成构建报告
echo -e "${YELLOW}📊 生成构建报告...${NC}"
cat > $BUILD_DIR/build-report.txt << EOF
构建时间: $(date)
构建版本: v1.0.0
文件统计:
$(find $BUILD_DIR -type f -exec ls -lh {} \; | awk '{print $5, $9}' | sort -hr)

优化项目:
- CSS压缩: $MINIFY_CSS
- JavaScript压缩: $MINIFY_JS
- 图片优化: $OPTIMIZE_IMAGES
- Service Worker: $GENERATE_SW

性能建议:
1. 启用Gzip压缩
2. 配置CDN加速
3. 使用HTTP/2
4. 启用Brotli压缩
EOF

echo -e "${GREEN}🎉 构建完成！${NC}"
echo -e "${BLUE}📁 构建目录: $BUILD_DIR${NC}"
echo -e "${BLUE}📊 构建报告: $BUILD_DIR/build-report.txt${NC}"

# 显示文件大小
echo -e "\n${YELLOW}📏 文件大小统计:${NC}"
ls -lh $BUILD_DIR/*.{html,css,js} 2>/dev/null | awk '{print $5, $9}'

echo -e "\n${GREEN}✨ 优化建议:${NC}"
echo -e "1. 将构建文件部署到CDN"
echo -e "2. 配置服务器启用Gzip/Brotli压缩"
echo -e "3. 设置适当的缓存策略"
echo -e "4. 监控网站性能指标"