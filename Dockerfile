# 运行的环境 -> Linux 文件系统创建出来的 /usr /sys /dev /proc
FROM node:16

# 工作目录及代码
WORKDIR /app

# 构建命令
COPY . .

# 安装项目依赖 npm install && npm run build
RUN npm install

# 暴露的目录与端口
VOLUME ["/app/logs"]
EXPOSE 13000

# 运行程序的脚本或者命令
CMD ["npm", "run", "start:prod"]
