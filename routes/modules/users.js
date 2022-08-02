const express = require('express')
const router = express.Router()
const userModel = require('../../models/userExample')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    const userInfo = req.body
    console.log(userInfo)
        // 比對資料庫內的資料
    userModel.find({ email: userInfo.email })
        .then((findUser) => {
            res.render('')
        })
        .catch()
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const userInfo = req.body
    userModel.find({ email: userInfo.email })
        .then((user) => {
            console.log(user)
            if (user) {
                //這邊應該要改成此email已經有人用過之類的(用.flash connect-flash之類的)
                res.render('index', user)
            } else {
                userModel.create(userInfo)
            }
        })
        .catch((error) => console.log('error', error))
})



module.exports = router