const express = require('express')
const router = express.Router()
const restaurantModel = require('../../models/restaurantExample')


router.get('/', (req, res) => {
    const userId = req.user._id
    console.log(userId)
    console.log('回應', req.user)
        //find是不是連找不到key都不算error?就是算空陣列？
    restaurantModel.find({ userId })
        .lean()
        .then((restaurants) => {
            console.log(restaurants)
            res.render('index', { restaurants })
        })
        .catch(error => { console.log('error') })
})

module.exports = router