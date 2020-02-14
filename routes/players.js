const Router = require('koa-router');
const router = new Router();
const player = require('../models/Player');


router.get('/api/players', async ctx => {
    await player.find()
    .then(players => {
        ctx.body = players
    })
    .catch(err => {
        ctx.body = 'error: ' + err
    })
})

router.post('/api/players', async ctx => {
    if(!ctx.request.body.username){
        ctx.body = {
            error: 'Missing Data'
        } 
    } else {
            let player = new Player();
            player.username = ctx.request.body.username
            player.score = 20;
            await player.save()
            .then(data => {
                ctx.body = data
            })
            .catch(err => {
                ctx.body = 'error: ' + err
            })
    }
})

router.delete('/api/player/:id', async ctx => {
    await Player.deleteOne({
        _id: ctx.params.id
    })
    .then(() => {
        ctx.body = {status: 'Player Removed!'}
    })
    .catch(err => {
        ctx.body = 'error: ' + err
    })
})

router.put('/api/player/:id', async ctx => {
    if (!ctx.request.body.score) {
        ctx.body = {
            error: 'Bad Data'
        }
    } else {
        await Player.findOneAndUpdate(
            { _id:ctx.params.id },
            { score: ctx.request.body.score }
        )
        .then(() => {
            ctx.body = {status:'Score Updated'}
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    }
})

/*
db.players.insert({username:USERNAME, score:20})
db.players.update({_id:ID},{$inc:{score:n}});
*/

module.exports = router;