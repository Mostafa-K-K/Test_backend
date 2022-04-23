const Search = require('../models/searchModel')

class SearchController {

    createArtistSearch = async (req, res, next) => {
        let search = new Search(req.body)
        search.save((err, result) => {
            if (err) return next(err)
            res.json({ success: true, result })
        })
    }

    getArtistSearch = async (req, res, next) => {
        let { name } = req.body;
        Search
            .find({ searchText: { $regex: new RegExp(name) } })
            .exec((err, result) => {
                if (err) return next(err)
                res.json({ success: true, result: { count: result.length, result } })
            })
    }
}

const searchController = new SearchController()
module.exports = searchController
