const Koa = require('koa');
const Router = require('koa-router');
const jsoned = require('koa-json');
const bodyParser = require('koa-body');
const mongoose = require('mongoose');

const players = require('./routes/players');

const app = new Koa();

app.use(bodyParser());
app.use(players.routes());
app.use(jsoned());

mongoose.connect(
  'mongodb://localhost/buttongame',
  { useNewUrlParser: true }
)

app.listen(5000, () => console.log('Server Started...'));