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


router.get('/api/counter', async ctx => {
    ctx.body = {counter: counterscore};
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

router.get('/api/playerinfo/:id', async ctx => {
    await player.findById(ctx.params.id)
    .then(player => {
        ctx.body = player
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

//Reset player to 20 points
router.post('/api/reset',  async ctx => {
    console.log('hellow')
    let rstData = {
        message: 'You have been given additional 20 points. Use them wisely.',
        gameState: true
    };
    if(!ctx.request.body.id) {
        ctx.body = {
            error: 'Missing Data'
        }
    } else {
        await updateScore(20,ctx.request.body.id, true)
        .then(data => {
            rstData.body = data
            rstData.body.player.score = rstData.body.player.score + 20
            ctx.body = rstData;
        })
    }
})

//Server Side Game Logic
router.post('/api/player/', async ctx => {
    let winData = {
        message: '',
        gameState: true
    };
    if(!ctx.request.body.id || !ctx.request.body.score) {
        ctx.body = {
            error: 'Missing Data'
        }
    } else {
    counterscore++;
    if ((counterscore%500) === 0) {
        winData.message = 'Wow! You won 250 points! Congratulations!'
        await updateScore(249,ctx.request.body.id, false)
        .then(data => {
            winData.body = data
            winData.body.player.score = winData.body.player.score + 250
            ctx.body = winData
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    } else if ((counterscore%100) === 0) {
        winData.message = "Congratulations. You won 40 points. Aren't you lucky."
        await updateScore(39,ctx.request.body.id, false)
        .then(data => {
            winData.body = data
            winData.body.player.score = winData.body.player.score + 40
            ctx.body = winData
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    } else if ((counterscore%10) === 0) {
        winData.message = 'Small winnings of 5 points achieved. Hooray.'
        await updateScore(4,ctx.request.body.id, false)
        .then(data => {
            winData.body = data
            winData.body.player.score = winData.body.player.score + 5
            console.log(winData)
            ctx.body = winData
        })
        .catch(err => {
            ctx.body = 'error: ' + err
        })
    } else {
        if (ctx.request.body.score > 1) {
            winData.message = "Sorry, you didn't win this time."
            await updateScore(-1,ctx.request.body.id, false)
            .then(data => {
                winData.body = data
                ctx.body = winData
            })
            .catch(err => {
                ctx.body = 'error: ' + err
            })
        } else {
            winData.message = 'No more points! Plead for forgiveness and points?';
            winData.gameState = false;
            winData.body = {
                player: {
                    score: 0
            }}
            ctx.body = winData
    }
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