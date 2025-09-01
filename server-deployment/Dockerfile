FROM nginx:alpine

# 复制网站文件
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY monitoring.html /usr/share/nginx/html/

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 创建日志目录
RUN mkdir -p /var/log/nginx

# 设置权限
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html

# 暴露端口
EXPOSE 80 443

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]