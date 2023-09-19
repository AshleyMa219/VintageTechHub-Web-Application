const mongoose = require('../database/mongo')

const userSchema = new mongoose.Schema({
    email: String,
    lastname:String,
    firstname:String,
    password:String,
    token:String,
    resetToken:String,
    verify:Boolean
}, {
    versionKey: false
});

const User = mongoose.model('UserList', userSchema, 'UserList')
module.exports = User