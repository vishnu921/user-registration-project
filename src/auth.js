const jwt = require('jsonwebtoken');
const User = require('./models/user');

// middleware to authenticate jwt 
const auth = async (req,res,next) => {
    try {

        const token = req.cookies.jwt;

        // if the jwt token is present in the cookies
        if(token){
            const VerifyUser = jwt.verify(token, "helloworldhowareyoudoingiamfine");
            
            const user = await User.findOne({_id: VerifyUser._id});
            
            if(user){
                res.render("welcome", {name: user.name});
                return;
            }
        }
        // else user has to re-login
        next();

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = auth;