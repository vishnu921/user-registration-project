const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');
require('./db/conn');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const registerRouter = require('./routers/register');

const port = process.env.PORT || 8000;

const partialsPath = path.join(__dirname, "../views/partials");
const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.use(registerRouter);

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});