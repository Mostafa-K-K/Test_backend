const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

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
    res.send('<h1>Hey Techlab</h1>')
})

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`listening on port ${port}`))