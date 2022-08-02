const mongoose = require('mongoose')
const userModel = require('../userExample.js')
const db = require('../../config/mongoose')

const SEED_USER = [{
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
}, {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
}]


db.once('open', () => {
    userModel.create(SEED_USER)
        .then(() => {
            console.log('userSeeder done!')
        })
        .catch(err => console.log(err))
        .finally(() => db.close())
})