const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    (req, res, next) => {
      console.log('프록시 요청:', req.url);
      console.log('프록시 타겟:', 'http://localhost:3002');
      next();
    },
    createProxyMiddleware({
      target: 'http://localhost:3002',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('프록시 요청 전송:', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('프록시 응답 상태:', proxyRes.statusCode);
      },
      onError: (err, req, res) => {
        console.error('프록시 오류:', err);
      }
    })
  );
};