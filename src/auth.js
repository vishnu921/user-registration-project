const jwt = require('jsonwebtoken');
const User = require('./models/user');

const auth = async (req,res,next) => {
    try {

        const token = req.cookies.jwt;

        if(token){
            const VerifyUser = jwt.verify(token, "helloworldhowareyoudoingiamfine");
            
            const user = await User.findOne({_id: VerifyUser._id});
            
            if(user){
                res.render("welcome", {name: user.name});
                return;
            }
        }
        next();

    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = auth;