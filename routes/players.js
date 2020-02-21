const Router = require('koa-router');
const router = new Router();
const player = require('../models/Player');

let counterscore = 0;

const updateScore = async (scoreInput, id) => {
    let dataFetch;
    await Player.findByIdAndUpdate(
        id,
        {
            $inc: {
                score: scoreInput
            }
        }
    )
    .then((data) => {
        dataFetch = data;
    })
    .catch(err => {
        dataFetch = 'error: ' + err;
    })
    return dataFetch;
}

router.get('/counter', async ctx => {
    ctx.body = counterscore;
})

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
    counterscore++;
    if ((counterscore%500) === 0) {
        await updateScore(250,ctx.params.id)
        .then(data => {
            ctx.body = data
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    } else if ((counterscore%100) === 0) {
        await updateScore(40,ctx.params.id)
        .then(data => {
            ctx.body = data
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    } else if ((counterscore%10) === 0) {
        await updateScore(5,ctx.params.id)
        .then(data => {
            ctx.body = data
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    } else {
        await updateScore(-1,ctx.params.id)
        .then(data => {
            ctx.body = data
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    } 
        
})

module.exports = router;