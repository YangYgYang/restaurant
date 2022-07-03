const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantModel = require('./models/restaurantExample')
const routes = require('./routes')

//在ROBO 3T上新增DB關掉後，會就不見了？ 


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

// const mongoose = require('mongoose')
// mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

// const db = mongoose.connection

// db.on('error', () => {
//     console.log('mongodb error!')
// })
// db.once('open', () => {
//     console.log('mongodb connected!')
// })
//==========引入mongoose
require('./config/mongoose')



//==========中介軟體 設定
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
const methodOverride = require('method-override')

//setting template engine
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')


app.use(methodOverride('_method'))
app.use(routes)



app.listen(port, () => {
    console.log(`Express is running on http://localhost:${port}`)
})

// setting static files
app.use(express.static('public'))