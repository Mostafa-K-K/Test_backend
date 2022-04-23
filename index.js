const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const createError = require('http-errors')

const {
    MONGO_IP,
    MONGO_PORT,
    MONGO_USER,
    MONGO_PASSWORD,

    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET,
} = require('./config/config')

const { createClient } = require('redis')
const session = require('express-session')
let RedisStore = require('connect-redis')(session)

let redisClient = createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
    legacyMode: true
})

const app = express()

const searchRouter = require('./routes/searchRoutes')

const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
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
connectWithRetry()

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 30000
        },
        resave: false,
        saveUninitialized: false
    })
)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('<h1>Hey Techlab !</h1>')
})

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