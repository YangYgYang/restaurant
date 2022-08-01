const express = require('express')
const router = express.Router()
    // const restaurantModel = require('../../models/restaurantExample')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    // 比對資料庫內的資料
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

module.exports = router