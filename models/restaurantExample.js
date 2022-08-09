// const { model } = require('mongoose')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurantSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
    },
    name_en: {
        type: String
    },
    category: {
        type: String
    },
    image: {
        type: String
    },
    location: {
        type: String
    },
    phone: {
        type: String
    },
    google_map: {
        type: String
    },
    rating: {
        type: Number
    },
    description: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        index: true, //可加快 database搜尋速度(用index搜尋的意思)
        required: true
    }
})

module.exports = mongoose.model('restaurants', restaurantSchema)