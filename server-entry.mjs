import server from "./dist/server/server.js";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const port = process.env.PORT || 3000;
const staticDir = "./dist/client";

const mimeTypes = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const filePath = join(staticDir, decodeURIComponent(url.pathname));

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    const ext = extname(filePath);
    const mime = mimeTypes[ext] || "application/octet-stream";
    const content = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mime });
    res.end(content);
    return;
  }

  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
  });

  const response = await server.fetch(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(await response.text());
}).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
