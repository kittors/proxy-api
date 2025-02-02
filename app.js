import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

// 处理所有请求
app.all('*', async (req, res) => {
  try {
    const pathname = req.path;

    // 处理根路径请求
    if (pathname === '/' || pathname === '/index.html') {
      return res
        .type('html')
        .send('Proxy is Running！Details：https://github.com/kittors/proxy-api');
    }

    // 构建目标 URL
    const targetUrl = `https://${pathname.slice(1)}`; // 移除路径开头的斜杠

    // 过滤请求头
    const headers = {};
    const allowedHeaders = ['accept', 'content-type', 'authorization'];
    for (const [key, value] of Object.entries(req.headers)) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers[key] = value;
      }
    }

    // 转发请求
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method === 'GET' ? undefined : req
    });

    // 设置响应头
    res.set({
      ...Object.fromEntries(response.headers.entries()),
      'referrer-policy': 'no-referrer'
    });

    // 转发响应状态码和内容
    res.status(response.status);
    response.body.pipe(res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});