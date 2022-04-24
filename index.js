const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const createError = require('http-errors')
const { createClient } = require('redis')

const {
    MONGO_HOST,
    MONGO_PORT,
    MONGO_USER,
    MONGO_PASSWORD,

    REDIS_HOST,
    REDIS_PORT
} = require('./config/config')

const app = express()
const authorize = require('./middleware/auth')
const artistRouter = require('./routes/artistRoutes')
const searchRouter = require('./routes/searchRoutes')

const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`

const connectWithRetryMongoose = () => {
    mongoose
        .connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('Succesfully connected to DB'))
        .catch((e) => {
            console.log('ERROR MONGO CONNECTION: ', e)
            setTimeout(connectWithRetry, 5000)
        })
}
connectWithRetryMongoose()

const connectWithRedis = async () => {
    const client = createClient({
        url: `redis://${REDIS_HOST}:${REDIS_PORT}`
    })

    client.on('error', (e) =>
        console.log('REDIS CLIENT ERROR: ', e)
    )

    client.connect().then(() => {
        console.log('Connected to redis successfully')
    })

    let token = await client.get('token')
    if (!token) await authorize(client)
}
connectWithRedis()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('<h1>Hey Techlab !</h1>')
})

app.use(artistRouter)
app.use(searchRouter)

app.use(function (req, res, next) {
    next(createError(404))
})

app.use(function (err, req, res, next) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    res.json({ success: false, error: err })
})

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`listening on port ${port}`))