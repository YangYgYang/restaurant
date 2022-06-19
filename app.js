const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const restaurantData = require('./restaurant.json')

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