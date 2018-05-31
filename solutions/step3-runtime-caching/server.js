const Koa = require('koa');
const koaStatic = require('koa-static');
const koaProxies = require('koa-proxies');

const randomNews = process.argv.length > 2 && process.argv[2] === '--random-news';

const app = new Koa();

const port = 8080;

app.use(koaStatic('.'));

let i = 0;
const titles = ['Some news title', 'Another news title', 'Random news event'];
app.use(async (ctx, next) => {
  if (ctx.path === '/news' && randomNews) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    ctx.body = [{
      title: titles[i],
      time_ago: (new Date()).toLocaleString()
    }];
    i = (i + 1) % titles.length;

    ctx.response.lastModified = new Date();
  } else {
    return next();
  }
});

app.use(koaProxies('/', {
  target: 'https://api.hackerwebapp.com/',
  changeOrigin: true
}));


koaProxies.proxy.on('proxyRes', function (proxyRes, req, res) {
  proxyRes.headers['cache-control'] = 'no-cache';

});

app.listen(port);


console.log(`Running server on http://localhost:${port}`);
