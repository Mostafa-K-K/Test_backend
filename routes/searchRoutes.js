const express = require('express')
const searchController = require('../controllers/searchController')
const router = express.Router()

const {
    createArtistSearch,
    getArtistSearch
} = searchController

router.post('/artists', createArtistSearch)
router.post('/artists/uniquesearches', getArtistSearch)

module.exports = router