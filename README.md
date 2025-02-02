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
git clone https://github.com/kittors/proxy-api
cd proxy-api
```

2. 安装依赖

```bash
复制
pnpm i
启动服务
```

```bash
复制
pnpm start
```