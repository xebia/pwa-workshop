const Koa = require('koa');
const koaStatic = require('koa-static');
const koaProxies = require('koa-proxies');

const app = new Koa();

const port = 8080;

app.use(koaStatic('.'));

app.use(koaProxies('/', {
  target: 'https://api.hackerwebapp.com/',
  changeOrigin: true
}));


koaProxies.proxy.on('proxyRes', function (proxyRes, req, res) {
  proxyRes.headers['cache-control'] = 'no-cache';

});

app.listen(port);


console.log(`Running server on http://localhost:${port}`);