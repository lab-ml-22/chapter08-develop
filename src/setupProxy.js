const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://chapter08-develop.vercel.app',
      changeOrigin: true,
    })
  );
};