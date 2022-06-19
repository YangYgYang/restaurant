const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log(`Express is running on http://localhost:${port}`)
})

// setting static files
app.use(express.static('public'))