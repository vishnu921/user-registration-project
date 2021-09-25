const express = require('express');
const User = require('../models/user');
const auth = require("../auth");
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', auth, (req,res) => {
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

// login using email and password
router.post('/login', async (req, res) => {
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

// Add a user
router.post('/signup', async (req,res) => {
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

            const token = await newUser.generateToken();           // create a token

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            });

            const addResult = await newUser.save();
            res.render('welcome', {name: addResult.name});
        }
        
    } catch (err) {
        res.status(400).send(err);
    }
});

// logout and remove jwt token from client side
router.get('/logout', (req, res) => {
    try {
        res.clearCookie("jwt");
        res.render("index");
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;