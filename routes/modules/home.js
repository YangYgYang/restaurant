const express = require('express')
const router = express.Router()
const restaurantModel = require('../../models/restaurantExample')


router.get('/', (req, res) => {
    restaurantModel.find()
        .lean()
        .then((restaurants) => { res.render('index', { restaurants }) })
        .catch(error => { console.log('error') })
})

module.exports = router