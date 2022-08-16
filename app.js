//==========setting server
const express = require('express')
const app = express()


//==========judge if is production mode
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

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

//==========connect-flash 設定
const session = require('express-session')
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}))

const flash = require('connect-flash')
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//==========passport
const usePassport = require('./config/passport')
usePassport(app)


//==========setting template engine
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

//靜態資源必須在所有router前面，不然會被authenticate擋下，無法驗證
//==========setting static files
app.use(express.static('public'))

//==========res.locals是express開的一條路徑，放在res.locals的資料，所有views都可以拿到，且每一個request-respones cycle都是獨立的，it will not be shared between requests 
//疑問?為什麼templates直接用user，和isAuthenticated就可以拿到資料，isAuthenticated應該是從上面已引入passports拿到的，但user怎知道叫做user??
//為什麼為印很多次？
app.use((req, res, next) => {
    console.log('印好多次', req.user)
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user
    next()
})



//==========setting router
const routes = require('./routes')
app.use(methodOverride('_method'))
app.use(routes)


app.listen(process.env.PORT, () => {
    console.log(`Express is running on http://localhost:${process.env.PORT}`)
})