const express = require('express')
const router = express.Router()
const restaurantModel = require('../../models/restaurantExample')


router.get('/:_id/detail', (req, res) => {
    const id = req.params._id
    restaurantModel.findById(id)
        .lean()
        .then((restaurant) => { res.render('show', { restaurant: restaurant }) })
        .catch(error => console.log('error'))
})

router.get('/search', (req, res) => {
    const keyword = req.query.keyword
    restaurantModel.find()
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
    const id = req.params.id
    restaurantModel.findById(id)
        .lean()
        .then((restaurants) => {
            res.render('edit', { restaurants })
        })
        .catch(error => console.log('error', error))
})

router.put('/:_id', (req, res) => {
    const id = req.params._id
    const data = req.body
    return restaurantModel.findById(id)
        .then((restaurants) => {
            for (let changeKey in data) {
                restaurants[changeKey] = data[changeKey]
            }
            return restaurants.save()
        })
        .then(() => res.redirect(`/restaurants/${id}/detail`))
        .catch(error => console.log('error', error))
})

router.delete('/:_id', (req, res) => {
    const id = req.params._id
    return restaurantModel.findById(id)
        .then(restaurant => { restaurant.remove() })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

router.get('/create', (req, res) => {
    return res.render('create')
})

router.post('/create', (req, res) => {
    console.log('有進到create')
    const restaurant = req.body
    console.log(restaurant)
    return restaurantModel.create(restaurant)
        .then(() => { res.redirect('/') })
        .catch(error => console.log(error))
})

module.exports = router