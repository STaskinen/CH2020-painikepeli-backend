const Router = require('koa-router');
const router = new Router();
const state = require('../models/Playstate');

let counterScore = 0;

router.get('/api/gamestates', async ctx => {
    await state.find({})
    .then(states => {
        ctx.body = states
    })
    .catch(err => {
        ctx.body = 'error: ' + err
    })
})

module.exports = router;