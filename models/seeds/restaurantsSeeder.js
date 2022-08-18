const mongoose = require('mongoose')
const restaurantSeed = require('../restaurant.json')
const userSeed = require('../user.json')
const restaurantModel = require('../restaurantExample.js')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const userModel = require('../../models/userExample')

//==========judge if is production mode
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
//==========model
//userSeeder result => password加密 修改原本的userseeder
//create userseeder


db.once('open', () => {
    let restaurantDatas = restaurantSeed.results
    let SEED_USERS = userSeed.results
    SEED_USERS.map((SEED_USER) => {
        //bcrypt同步寫法=> hash = bcrypt.hashSync(要加密的password, 加密係數)
        hash = bcrypt.hashSync(SEED_USER.password, 10)
        SEED_USER.password = hash
    })
    console.log(SEED_USERS)

    //以下非同步寫法拿不到加密後的值
    // Promise.all(
    // bcryptSeed = 
    // let bcryptSeed = SEED_USERS.map(async(SEED_USER) => {
    //         console.log('測異步', SEED_USER)
    //             // let pwd = SEED_USER.password
    //         await bcrypt.genSalt(10)
    //             .then(salt => bcrypt.hash(SEED_USER.password, salt))
    //             .then(hash => {
    //                 SEED_USER.password = hash
    //                 console.log('SEED_USER.password', SEED_USER.password)
    //                 console.log('SEED_USERS', SEED_USERS)
    //             })
    //             .catch(error => console.log(error))
    //         console.log('外面的SEED_USER.password', SEED_USER.password)
    //     })
    // )

    userModel.create(SEED_USERS)
        .then(async(user) => {
            console.log('userSeeder is done!')

            await userModel.findOne({ name: 'user1' })
                .then(async(user1) => {
                    console.log('有變成同步了啦')
                    let user1RestaurantDatas = []
                    restaurantDatas[0].userId = user1._id
                    restaurantDatas[1].userId = user1._id
                    restaurantDatas[2].userId = user1._id
                    await restaurantModel.create(restaurantDatas[0], restaurantDatas[1], restaurantDatas[2])
                        .then(() => { console.log('User1 is done!') })
                        .catch(err => console.log(err))

                })
                .catch(err => console.log(err))

            await userModel.findOne({ name: 'user2' })
                .then(async(user2) => {
                    restaurantDatas[3].userId = user2._id
                    restaurantDatas[4].userId = user2._id
                    restaurantDatas[5].userId = user2._id
                    await restaurantModel.create(restaurantDatas[3], restaurantDatas[4], restaurantDatas[5])
                        .then(() => { console.log('User2 is done!') })
                        .catch(err => console.log(err))

                })
                .catch(err => console.log(err))
        })

    .catch(err => console.log(err))
        .finally(() => db.close())

})