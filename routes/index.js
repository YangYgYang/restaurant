const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const restaurants = require('../routes/modules/restaurants')
const users = require('../routes/modules/users')
const auth = require('../routes/modules/auth')
    // const publicJs = require('/public')

//auth.js 會export一個authenticator物件
const { authenticator } = require('../middleware/auth')

router.use('/users', users)
router.use('/restaurants', authenticator, restaurants)
router.use('/auth', auth)
router.use('/', authenticator, home) // 加入驗證程序

module.exports = router