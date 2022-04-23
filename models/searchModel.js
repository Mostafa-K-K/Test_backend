const { Schema, model } = require('mongoose')

const SearchSchema = new Schema({
    searchText: {
        type: String,
        required: [true, 'Search must have a searchText'],
    },
    artists: {
        type: [String],
        validate: a => Array.isArray(a) && a.length > 0,
    }
}, {
    collection: 'Searches'
})

const Search = model('Search', SearchSchema)
module.exports = Search