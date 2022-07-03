const mongoose = require('mongoose')
const restaurantSeed = require('../restaurant.json')
const restaurantModel = require('../restaurantExample.js')
const db = require('../../config/mongoose')

db.once('open', () => {
    let restaurantData = restaurantSeed.results
    restaurantModel.create(restaurantData)
        .then(() => {
            console.log('restaurantSeeder done!')
        })
        .catch(err => console.log(err))
        .finally(() => db.close())

})