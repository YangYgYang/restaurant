const mongoose = require('mongoose')
const restaurantSeed = require('../restaurant.json')
const restaurantModel = require('../restaurantExample.js')
const db = require('../../config/mongoose')

db.once('open', () => {
    let restaurantData = restaurantSeed.results
    restaurantData.forEach((item) => {
        console.log(item)
        restaurantModel.create(item)
    })

})