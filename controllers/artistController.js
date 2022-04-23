const request = require('request')
const Redis = require('ioredis')
const {
    REDIS_HOST,
    REDIS_PORT
} = require('../config/config')

const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
})

exports.getArtists = async (req, res, next) => {
    let { name = '', limit = 10, offset = 0 } = req.body

    let TOKEN = await redis.get('token')

    var FETCH_URL =
        `${process.env.SPOTIFY_URL_API}/search?type=artist&q=name:${name}&limit=${limit}&offset=${offset}`

    var authOptions = {
        url: FETCH_URL,
        headers: { Authorization: `Bearer ${TOKEN}` },
        json: true
    }

    request.get(authOptions, async function (error, response, result) {
        if (error) return next(error)
        if (response.statusCode === 200) {
            res.json({ success: true, result })
        } else {
            next(result)
        }
    })
}