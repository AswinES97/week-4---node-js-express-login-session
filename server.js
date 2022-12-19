const express = require('express')
// const { loginRouter } = require("./router/login.router")
const path = require('path')
const bodyParser = require('body-parser');
const app = express()
const data = require("./models/data.model")
const session = require('express-session')
const nocache = require('nocache')
app.use(nocache())
const PORT = 3000

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"))

app.use(session({
    secret: "hello@#1321",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.get('/',(req,res)=>{
    if (req.session.name) {
        res.redirect('/home')
    }
    else {
        res.render('index',{
            login:req.session.val
        })
        req.session.val = false
    }
})

app.get('/home', (req, res) => {
    if (req.session.name) {
        res.render('homepage',{
            data,
        })
    }
    else {
        res.redirect('/')
    }
})

app.post('/login', (req, res) => {

    if (req.body.email === data[0].mail && req.body.password === data[0].password) {
        req.session.name = req.body.email
        req.session.val = false
        res.redirect("/home")
    } else {
        req.session.val =true
        res.redirect('/')
    }

})

app.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}...`);
})