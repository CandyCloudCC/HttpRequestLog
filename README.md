# 用途

只用于协助记录 http 请求日志

# 部署

## 1. 编译源代码

```bash
# 安装依赖包
yarn install

# 编译
yarn run build
```

## 2. 运行

```bash
# 1. node 直接运行
node ./dist/src/main.js

# 2. docker 运行
WORKDIR=~/Documents/github/HttpRequestLog
docker run -d -p 21066:21066 \
  --restart=always \
  --name http_request_log_1 \
  --volume $WORKDIR/dist:/www/server \
  --volume $WORKDIR/node_modules:/www/server/node_modules \
  --workdir /www/server \
  node:lts node src/main.js
```

# 可能用到的命令

```bash
docker container ls -a | grep http_request_log
docker container logs http_request_log_1
docker container stop http_request_log_1
docker container rm http_request_log_1
```
