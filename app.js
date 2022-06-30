const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
    // const restaurantData = require('./models/restaurant.json')

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
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    restaurantModel.find()
        .lean()
        .then((restaurants) => { res.render('index', { restaurants }) })
        .catch(error => { console.log('error') })
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

app.get('/restaurants/:id/edit', (req, res) => {
        // Handlebars.registerHelper('selected', function(option, value) {
        //     console.log(option, value)
        //     if (option === value) {
        //         return ' selected';
        //     } else {
        //         return ''
        //     }
        // });
        console.log('有進到edit路由')
        const id = req.params.id
            // console.log(restaurantModel.findById(id))
        restaurantModel.findById(id)
            .lean()
            .then((restaurants) => {
                res.render('edit', { restaurants })
            })
            .catch(error => console.log('error', error))
    })
    //res.render('edit', { restaurant }




app.listen(port, () => {
    console.log(`Express is running on http://localhost:${port}`)
})

// setting static files
app.use(express.static('public'))