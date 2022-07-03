const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')

const restaurantModel = require('./models/restaurantExample')

//在ROBO 3T上新增DB關掉後，會就不見了？ 
const mongoose = require('mongoose')

const hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        selected(data, i) {
            if (data === i) {
                return 'selected'
            }
        },
    },
    defaultLayout: 'main'
});

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error!')
})
db.once('open', () => {
    console.log('mongodb connected!')
})

//==========中介軟體 設定
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
const methodOverride = require('method-override')

//setting template engine
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')


app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    restaurantModel.find()
        .lean()
        .then((restaurants) => { res.render('index', { restaurants }) })
        .catch(error => { console.log('error') })
})

app.get('/restaurants/:_id/detail', (req, res) => {
    const id = req.params._id
    restaurantModel.findById(id)
        .lean()
        .then((restaurant) => { res.render('show', { restaurant: restaurant }) })
        .catch(error => console.log('error'))
})

app.get('/search', (req, res) => {
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

app.get('/restaurants/:id/edit', (req, res) => {
    console.log('有進到edit路由')
    const id = req.params.id
    restaurantModel.findById(id)
        .lean()
        .then((restaurants) => {
            res.render('edit', { restaurants })
        })
        .catch(error => console.log('error', error))
})

app.put('/restaurants/:_id', (req, res) => {
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

app.delete('/restaurants/:_id', (req, res) => {
    const id = req.params._id
    return restaurantModel.findById(id)
        .then(restaurant => { restaurant.remove() })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

app.get('/create', (req, res) => {
    return res.render('create')
})

app.post('/restaurants/create', (req, res) => {
    console.log('有進到create')
    const restaurant = req.body
    console.log(restaurant)
    return restaurantModel.create(restaurant)
        .then(() => { res.redirect('/') })
        .catch(error => console.log(error))
})




app.listen(port, () => {
    console.log(`Express is running on http://localhost:${port}`)
})

// setting static files
app.use(express.static('public'))