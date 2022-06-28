const mongoose = require('mongoose')
const restaurantSeed = require('../restaurant.json')
const restaurantModel = require('../restaurantExample.js')

mongoose.connect(process.env.MONGODB_URL)
const db = mongoose.connection

db.on('error', () => {
    console.log('MONGODB error!')
})
db.once('open', () => {
    let restaurantData = restaurantSeed.results
    restaurantData.forEach((item) => {
        console.log(item)
        restaurantModel.create(item)
    })


})