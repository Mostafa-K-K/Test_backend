const request = require('request')

const authorize = async (redis) => {
    var client_id = process.env.CLIENT_ID
    var client_secret = process.env.CLIENT_SECRET
    var FETCH_URL = `${process.env.SPOTIFY_URL_ACCOUNT}`
    let Authorization = `Basic ${new Buffer.from(client_id + ':' + client_secret).toString('base64')}`

    var authOptions = {
        url: FETCH_URL,
        headers: { Authorization },
        form: { grant_type: 'client_credentials' },
        json: true
    }

    request.post(authOptions, async function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let token = body.access_token
            let expires = body.expires_in
            await redis.SETEX('token', expires, token)
        }
    })
}

module.exports = authorize
