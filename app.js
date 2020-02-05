const Koa = require('koa');
const Router = require('koa-router');
const jsoned = require('koa-json');
const bodyParser = require('koa-body');
const mongoose = require('mongoose');

const players = require('../routes/players');

const app = new Koa();
const router = new Router();

router.get('/', async ctx => {
  ctx.body = 'Hello World';
})

router.get('/pasila', async ctx => {
  ctx.body = {message: "Hello Pasila"};
})

app.use(bodyParser());
app.use(players.routes());
app.use(jsoned());

mongoose.connect(
  
)

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log('Server Started...'));