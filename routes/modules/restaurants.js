const express = require('express')
const router = express.Router()
const restaurantModel = require('../../models/restaurantExample')


router.get('/:_id/detail', (req, res) => {
    const _id = req.params._id
    const userId = req.user._id
        //findOne({找出_id一樣的restaurant,確定他的userId是當前登入的user})
    restaurantModel.findOne({ _id, userId })
        .lean()
        .then((restaurant) => { res.render('show', { restaurant: restaurant }) })
        .catch(error => console.log('error'))
})

router.get('/search', (req, res) => {
    const userId = req.user._id
    const keyword = req.query.keyword
    restaurantModel.find({ userId })
        .lean()
        .then((restaurantData) => {
            const restaurants = restaurantData.filter((item) => {
                return (
                    item.name.toLowerCase().includes(keyword.toLowerCase()) ||
                    item.category.toLowerCase().includes(keyword.toLowerCase()) ||
                    item.description.toLowerCase().includes(keyword.toLowerCase())
                )
            })
            res.render('index', { restaurants: restaurants, keyword: keyword })
        })
        .catch(error => 'error')
})

router.get('/:id/edit', (req, res) => {
    console.log('有進到edit路由')
    const _id = req.params.id
    const userId = req.user._id
    restaurantModel.findOne({ _id, userId })
        .lean()
        .then((restaurants) => {
            res.render('edit', { restaurants })
        })
        .catch(error => console.log('error', error))
})

router.put('/:_id', (req, res) => {
    const _id = req.params._id
    const userId = req.user._id
    const data = req.body
    return restaurantModel.findOne({ _id, userId })
        .then((restaurants) => {
            for (let changeKey in data) {
                restaurants[changeKey] = data[changeKey]
            }
            return restaurants.save()
        })
        .then(() => res.redirect(`/restaurants/${_id}/detail`))
        .catch(error => console.log('error', error))
})

router.delete('/:_id', (req, res) => {
    const userId = req.user._id
    const _id = req.params._id
    console.log('params是什麼', _id)
        //有點疑問這邊為什麼一定要是該使用者？如果說前台已經確認他登入了，渲染有哪些餐廳的時候，不是也已經確定他只能操作這些資料嗎？
        //為什麼delete還要只限制只能刪這個使用者的資料？
    return restaurantModel.findOne({ _id, userId })
        .then(restaurant => { restaurant.remove() })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

router.get('/create', (req, res) => {
    return res.render('create')
})

router.post('/create', (req, res) => {
    console.log('有進到create')
    const userId = req.user._id
    const restaurant = req.body
    console.log('看哪裡有錯', userId, restaurant)
        //要把userid也加入到restaurant的key-value中
    restaurant.userId = userId
    return restaurantModel.create(restaurant)
        .then(() => { res.redirect('/') })
        .catch(error => console.log(error))
})

module.exports = router