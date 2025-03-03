import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { URL } from 'url';

const PORT = 3000;
const app = express();

app.use(
  cors({
    credentials: true,
  }),
);

app.use(
  createProxyMiddleware({
    router: req => new URL(req.path.substring(1)),
    pathRewrite: (path, req) => new URL(req.path.substring(1)).pathname,
    changeOrigin: true,
    // eslint-disable-next-line no-undef
    logger: console,
  }),
);

app.listen(PORT, () => {
  // eslint-disable-next-line no-undef
  console.info(`Proxy server is running on port ${PORT}`);
});
