const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');

const port = process.env.PORT || 8000;

const partialsPath = path.join(__dirname, "../views/partials");

app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req,res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});