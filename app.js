import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.APP_PORT || 3000;

// 处理所有请求
app.all("*", async (req, res) => {
  try {
    const originalPath = req.originalUrl;

    // 处理根路径请求
    if (originalPath === "/" || originalPath === "/index.html") {
      return res
        .type("html")
        .send(
          "Proxy is Running！Details：https://github.com/kittors/proxy-api"
        );
    }

    // 移除所有开头的 '/' 来获取实际的目标路径
    let targetPath = originalPath;
    while (targetPath.startsWith("/")) {
      targetPath = targetPath.substring(1);
    }

    if (!targetPath) {
      // 可以选择返回根路径的默认信息，或者返回错误
      return res
        .type("html")
        .status(400) // Bad Request 更合适
        .send("Bad Request: Invalid target URL specified after proxy host.");
    }

    const targetUrl = `https://${targetPath}`;
    console.log(`Proxying request to: ${targetUrl}`);

    // 过滤请求头
    const headers = {};
    const allowedHeaders = [
      "accept",
      "content-type",
      "authorization",
      "user-agent",
    ]; // 考虑添加 User-Agent
    for (const [key, value] of Object.entries(req.headers)) {
      // 过滤掉 host 和 connection 头，避免冲突
      const lowerKey = key.toLowerCase();
      if (
        allowedHeaders.includes(lowerKey) &&
        lowerKey !== "host" &&
        lowerKey !== "connection"
      ) {
        headers[key] = value;
      }
    }
    // 确保有 User-Agent，有些服务器会拒绝没有 User-Agent 的请求
    if (!headers["user-agent"] && req.headers["user-agent"]) {
      headers["user-agent"] = req.headers["user-agent"];
    } else if (!headers["user-agent"]) {
      headers["user-agent"] = "NodeFetchProxy/1.0"; // 提供一个默认值
    }

    // 转发请求
    const bodyToSend =
      req.method === "GET" || req.method === "HEAD" ? undefined : req;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: bodyToSend,
      // redirect: 'manual' // 可选：阻止 fetch 自动处理重定向，由客户端处理
    });

    // 设置响应头
    const responseHeaders = {};
    // 过滤掉一些不应直接转发的头，如 'content-encoding'（fetch 会自动解压）,'transfer-encoding','connection'
    const ignoredHeaders = [
      "content-encoding",
      "transfer-encoding",
      "connection",
      "strict-transport-security",
      "content-security-policy",
    ];
    response.headers.forEach((value, key) => {
      if (!ignoredHeaders.includes(key.toLowerCase())) {
        responseHeaders[key] = value;
      }
    });
    responseHeaders["referrer-policy"] = "no-referrer"; // 保留你的设置
    // 可选：添加 CORS 头允许跨域访问你的代理
    responseHeaders["access-control-allow-origin"] = "*";
    responseHeaders["access-control-allow-methods"] = "*";
    responseHeaders["access-control-allow-headers"] = "*";

    res.set(responseHeaders);

    // 转发响应状态码和内容
    res.status(response.status);

    // 使用流式传输响应体
    response.body.pipe(res);
  } catch (error) {
    console.error("Proxy Error:", error.message); // 打印更具体的信息
    // 检查是否是 DNS 解析错误等特定 fetch 错误
    if (error.code === "ENOTFOUND" || error.cause?.code === "ENOTFOUND") {
      res.status(404).send(`Target host not found: ${error.message}`);
    } else if (error.message.includes("Invalid URL")) {
      res
        .status(400)
        .send(`Bad Request: Invalid target URL format. ${error.message}`);
    } else {
      res.status(502).send("Bad Gateway: Proxy encountered an error."); // 502 更符合代理错误场景
    }
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
