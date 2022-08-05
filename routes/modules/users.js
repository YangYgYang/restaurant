const express = require('express')
const router = express.Router()
const userModel = require('../../models/userExample')
const passport = require('passport')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))

//原本寫法
// router.post('/login', (req, res) => {
//     const userInfo = req.body
//     console.log(userInfo)
//         // 比對資料庫內的資料
//     userModel.find({ email: userInfo.email })
//         .then((findUser) => {
//             if (findUser.length !== 0) {
//                 if (findUser[0].password === userInfo.password) {
//                     res.render('index', findUser)
//                 }
//             } else {
//                 res.render('register')
//             }
//         })
//         .catch()
// })

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const userInfo = req.body
    userModel.find({ email: userInfo.email })
        .then((user) => {
            console.log('這邊印的嗎', user)
            if (user.length !== 0) {
                //這邊應該要改成此email已經有人用過之類的(用.flash connect-flash之類的)
                res.render('index', user)
            } else {
                console.log('有近這邊嗎')
                userModel.create(userInfo)
                res.redirect('login')
            }
        })
        .catch((error) => console.log('error', error))
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/users/login')
})


module.exports = router