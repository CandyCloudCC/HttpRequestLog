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

## 2. 部署代码

```bash
# 1. 配置目标运行目录
DESTINATION=~/www/http.request.log

# 2. 拷贝文件
cp -R ./dist/* $DESTINATION/

# 3. 安装运行时依赖
yarn install --production
```

## 3. 运行

```bash
# 1. node 直接运行
node ./src/main.js

# 2. docker 运行
WORKDIR=~/www/http.request.log
LOGDIR=~/log/http.request.log

docker run -d -p 21065:21065 \
  --restart=always \
  --name http_request_log_1 \
  --volume $WORKDIR:/www/server \
  --volume $LOGDIR:/www/log \
  --env NODE_ENV=production \
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
