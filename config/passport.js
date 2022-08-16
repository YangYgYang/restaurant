// const { application } = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const userExample = require('../models/userExample')
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy

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


    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK,
            profileFields: ['email', 'displayName']
        }, (accessToken, refreshToken, profile, done) => {
            const profileInfo = profile._json
            console.log(profileInfo)
            userExample.findOne({ email: profileInfo.email })
                .then((user) => {
                    if (user !== null) {
                        return done(null, user)
                    } else {
                        const randomPassword = Math.random().toString(36).slice(-8)
                        bcrypt.genSalt(10)
                            .then(salt => bcrypt.hash(randomPassword, salt))
                            .then(hash => {
                                profileInfo.password = hash
                                userExample.create(profileInfo)
                            })
                            .then(user => done(null, user))
                            .catch(error => done(err, false))
                    }
                })
                .catch(error => console.log(error))

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