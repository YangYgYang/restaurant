const express = require('express')
const router = express.Router()
    // const restaurantModel = require('../../models/restaurantExample')

router.get('/login', (req, res) => {
    res.render('login')
})

module.exports = router