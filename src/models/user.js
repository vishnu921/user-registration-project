const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: Number,
        require: true,
        unique: true
    },
    gender: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    confirmpassword: {
        type: String,
        require: true
    },
    tokens: [
        {
           token: {
               type: String,
               required: true
           } 
        }
    ]
});

userSchema.methods.generateToken = async function(){
    try {
        const token = jwt.sign({_id: this._id.toString()}, "helloworldhowareyoudoingiamfine");
        
        this.tokens = this.tokens.concat({token});
        
        return token;

    } catch (err) {
        console.log(err);
    }
}

userSchema.pre("save", async function(next) {
    this.password  = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;