# Node.js API Proxy Server

基于 Node.js 实现的安全代理服务，适用于 API 接口转发和跨域请求处理。

## ✨ 功能特性

- 支持 HTTP/HTTPS 请求转发
- 自动过滤敏感请求头
- 流式响应传输（支持大文件）
- 基础安全防护机制
- 自定义欢迎页面
- 支持所有 HTTP 方法

## 🚀 快速开始

### 前置要求
- Node.js 16+
- 服务器开放目标端口（默认 3000）

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/kittors/proxy-api.git
cd proxy-api
```

2. 安装依赖

```bash
# 安装依赖
pnpm i

```

```bash
# 启动项目
pnpm start
```

### 通过docker 去进行部署项目


对应的端口配置请在`.env`中进行修改

``` bash
# 构建然后运行
docker compose up --build -d

# 停止服务
docker compose down

```

### ⚠️警告

- 安全性 - 开放代理 (Open Proxy) 风险
    - 目前的代码允许任何人通过你的代理访问任何 https 网站。这可能会被滥用
- CORS 配置: `access-control-allow-origin`: '*' 允许来自任何源的跨域请求
- 请求体处理 `(bodyToSend)` 
    - 将 req (IncomingMessage 流) 直接作为 body 传递给 node-fetch 在很多情况下可行，但不是最健壮的方式。如果请求体在代理处理之前被其他中间件读取过，或者在某些复杂的流处理场景下，可能会出现问题。


