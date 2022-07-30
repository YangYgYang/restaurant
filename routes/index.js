const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const restaurants = require('../routes/modules/restaurants')
const users = require('../routes/modules/users')



router.use('/restaurants', restaurants)
router.use('/users', users)
router.use('/', home)

module.exports = router