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
            .aggregate([
                { $match: { searchText: { $regex: new RegExp(name) } } },
                {
                    $group: {
                        _id: null,
                        searches: { $push: '$searchText' },
                        artists: { $push: '$artists' },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        searches: { $setUnion: ['$searches'] },
                        artists: {
                            $reduce: {
                                input: '$artists',
                                initialValue: [],
                                in: { $setUnion: ['$$value', '$$this'] }
                            }
                        }
                    }
                }
            ])
            .exec((err, result) => {
                if (err) return next(err)
                res.json({ success: true, result: result[0] })
            })
    }
}

const searchController = new SearchController()
module.exports = searchController
