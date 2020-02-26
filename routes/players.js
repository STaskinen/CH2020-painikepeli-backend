const Router = require('koa-router');
const router = new Router();
const player = require('../models/Player');

let counterscore = 0;

const updateScore = async (scoreInput, id, reset) => {
    let dataFetch = {counter : counterscore}
    if(reset){
        await Player.findByIdAndUpdate(
            id,
            {score: scoreInput}
        )
        .then((data) => {
            dataFetch.player = data;
        })
        .catch(err => {
            dataFetch = 'error: ' + err;
        })
        return dataFetch;
    } else {
    await Player.findByIdAndUpdate(
        id,
        {
            $inc: {
                score: scoreInput
            }
        }
    )
    .then((data) => {
        dataFetch.player = data;
    })
    .catch(err => {
        dataFetch = 'error: ' + err;
    })
    return dataFetch;
}
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

//Create Player/User/Account

router.post('/api/players', async ctx => {
    if(!ctx.request.body.username){
        ctx.body = {
            error: 'Missing Data: Username'
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

//Server Side Game Logic

router.post('/api/player/', async ctx => {
    console.log(ctx.request.body.score)
    if(!ctx.request.body.id || !ctx.request.body.score) {
        ctx.body = {
            error: 'Missing Data'
        }
    } else if (ctx.request.body.score <= 0) {
        await updateScore(20,ctx.request.body.id,true)
        .then(data => {
            ctx.body = data
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    } else {
    counterscore++;
    if ((counterscore%500) === 0) {
        await updateScore(250,ctx.request.body.id, false)
        .then(data => {
            ctx.body = data
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    } else if ((counterscore%100) === 0) {
        await updateScore(40,ctx.request.body.id, false)
        .then(data => {
            ctx.body = data
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    } else if ((counterscore%10) === 0) {
        await updateScore(5,ctx.request.body.id, false)
        .then(data => {
            ctx.body = data
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    } else {
        await updateScore(-1,ctx.request.body.id, false)
        .then(data => {
            ctx.body = data
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    }
} 
        
})

//Delete Account/User/Player

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


module.exports = router;