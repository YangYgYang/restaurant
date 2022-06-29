const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const restaurantData = require('./models/restaurant.json')

//在ROBO 3T上新增DB關掉後，會就不見了？ 
const mongoose = require('mongoose')

// mongoose.connect('mongodb+srv://admin:1234@cluster0.0n5bj.mongodb.net/restaurant?retryWrites=true&w=majority')
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error!')
})
db.once('open', () => {
    console.log('mongodb connected!')
})

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    res.render('index', { restaurant: restaurantData.results })
})

app.get('/restaurants/:id', (req, res) => {
    const restaurant = restaurantData.results.find(restaurant => restaurant.id.toString() === req.params.id)
    res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
    const keyword = req.query.keyword
    const restaurants = restaurantData.results.filter((item) => {
        return (
            item.name.toLowerCase().includes(keyword.toLowerCase()) ||
            item.category.toLowerCase().includes(keyword.toLowerCase())
        )
    })
    res.render('index', { restaurant: restaurants, keyword: keyword })
})


app.listen(port, () => {
    console.log(`Express is running on http://localhost:${port}`)
})

// setting static files
app.use(express.static('public'))