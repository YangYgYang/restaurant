//==========setting server
const express = require('express')
const app = express()
const port = 3000


//==========setting handlebars config
const exphbs = require('express-handlebars')
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

//==========引入mongoose
require('./config/mongoose')


//==========中介軟體 設定
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
const methodOverride = require('method-override')

//==========setting template engine
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

//==========setting router
const routes = require('./routes')
app.use(methodOverride('_method'))
app.use(routes)


app.listen(port, () => {
    console.log(`Express is running on http://localhost:${port}`)
})

//==========setting static files
app.use(express.static('public'))