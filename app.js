const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const ssExpress = require('sse-express')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/connect',ssExpress(),(req,res)=>{

    // res.sse({
    //     event: 'connected',
    //     data: {
    //         welcomeMsg: 'Hello world'

    //     }
    // })
    app.on('hello world', data => {
        res.sse({
            event: 'hello world',
            data: data
        })
    })
})

app.post('/message', (req, res, next) => {
    const message = req.body.message;
    res.send({msg: 'ok'})

    app.emit('hello world', {
        title: 'hello world',
        message,
        timestamp: new Date()
    })
})