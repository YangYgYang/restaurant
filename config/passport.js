// const { application } = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const userExample = require('../models/userExample')
const bcrypt = require('bcryptjs')

module.exports = app => {
    //初始化local模組
    app.use(passport.initialize())
    app.use(passport.session())

    // 設定本地登入策略
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            userExample.findOne({ email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered!' })
                    }
                    return bcrypt.compare(password, user.password)
                        .then((isMatch) => {
                            if (!isMatch) {
                                return done(null, false, { message: 'Email or Password incorrect.' })
                            }
                            return done(null, user)
                        })
                })
                .catch(err => done(err, false))
        }))
        //序列化和反序列化
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
        userExample.findById(id)
            .lean()
            .then(user => { done(null, user) })
            .catch(err => done(err, null))
    })


}