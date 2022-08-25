const express = require('express')
const router = express.Router()
const userModel = require('../../models/userExample')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        //若將failureFlash屬性的值定為true，即可在message中找到error message
        failureFlash: true
    }))


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
                    })
                    .then(() => {
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
        //使用/user/login是因為是"/"後面接的是絕對路徑
    res.redirect('/users/login')
})


module.exports = router