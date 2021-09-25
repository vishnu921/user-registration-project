const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');
require('./db/conn');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const auth = require("./auth");

const port = process.env.PORT || 8000;

const partialsPath = path.join(__dirname, "../views/partials");
const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', auth, (req,res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const loginUser = await User.findOne({ email: email});
        
        if(!loginUser){
            res.status(400).send("<h1> Invalid Email </h1>")
            return;
        }

        const checkPassword = await bcrypt.compare(password, loginUser.password);

        
        const token = await loginUser.generateToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 500000),
            httpOnly: true
        });

        if(checkPassword == true){
            res.render("welcome", {name: loginUser.name});
        } else{
            res.status(400).send("<h1> Invalid Password </h1>")
        }

    } catch (err) {
        res.status(400).send(err);
    }
});

app.post('/signup', async (req,res) => {
    try {
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(password === confirmpassword){
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                password: req.body.password
            });

            const token = await newUser.generateToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            });

            const addResult = await newUser.save();
            res.send(addResult);

        }
        
    } catch (err) {
        res.status(400).send(err);
    }
})

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});