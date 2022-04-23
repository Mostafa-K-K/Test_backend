const express = require('express')
const artistController = require('../controllers/artistController')
const router = express.Router()

const { getArtists } = artistController

router.post('/artists/searches', getArtists)

module.exports = router