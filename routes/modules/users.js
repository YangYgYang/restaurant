const express = require('express')
const router = express.Router()
const userModel = require('../../models/userExample')
const passport = require('passport')
const bcrypt = require('bcryptjs')

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
    const errors = []
    console.log('userInfo', userInfo)
    if (userInfo.name.length === 0 || userInfo.email.length === 0 || userInfo.password.length === 0 || userInfo.confirmPassword.length === 0) {
        errors.push({ message: '所有欄位都是必填。' })
        console.log(errors)
    }
    if (userInfo.password !== userInfo.confirmPassword) {
        errors.push({ message: '密碼與確認密碼不相符！' })

    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name: userInfo.name,
            email: userInfo.email
        })

    }

    userModel.findOne({ email: userInfo.email })
        .then((user) => {
            // console.log('這邊印的嗎', user)
            if (user !== null) {
                console.log('使用者', user)
                errors.push({ message: '此email已註冊過。' })
                    //注意errors的資料型態
                res.render('login', { errors })
            } else {
                bcrypt.genSalt(10)

                .then((salt) => {
                        return bcrypt.hash(userInfo.password, salt)
                    })
                    .then((hash) => {
                        userInfo.password = hash
                        console.log('哈希值', hash)
                        console.log('哈希之後的使用者', userInfo)
                    })
                    .then(() => {
                        console.log('有近這邊嗎', userInfo)
                        userModel.create(userInfo)
                        res.redirect('/users/login')
                    })
            }
        })
        .catch((error) => console.log('error', error))
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', '你已經成功登出。')
        //這邊會使用/user/login是因為是"/"後面接的是絕對路徑
    res.redirect('/users/login')
})


module.exports = router