const User = require('../models/User')
const bcrypt = require("bcrypt");
const { ObjectId } = require('mongodb');

const checkUser = (email) => {
    return User.find({'email':email});
}
const checkUserByid = (id) => {
    return User.find({'_id':id});
}

const checkToken = (token) => {
    return User.find({'resetToken':token});
}
const emailVerify = async (token) => {
    const filter = {'token': token};
    const resultUser = await User.find({'token':token})
    const update = {$set: {"verify": true,"token": null}};
    await User.updateOne(filter, update);
    return resultUser
}
const userPasswordReset = async (email,password) => {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            console.log(err)
        } else {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) {
                    console.log(err)
                } else {
                    const filter = {'email': email};
                    const update = {$set: {'resetToken': null,'password':hash}};
                    await User.updateOne(filter, update);
                    return User.find({'email': email});
                }
            });
        }
    });

}

const userProfileUpdate = async (email,firstname,lastname) => {
    const filter = {'email': email};
    const update = {$set: { "email": email,"firstname":firstname,"lastname":lastname }};
    await User.updateOne(filter, update);
    return User.find({'email': email});
}

const createUser = async (user) => {
    const saltRounds = 10;
    const password = user.password;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            console.log(err)
        } else {
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    console.log(err)
                } else {
                    User.create({'email':user.email,'lastname':user.lastname,
                        'firstname':user.firstname,'password':hash,'verify':false,'token':user.token});
                    return "Success"
                }
            });
        }
    });
}
const resetPwd = async (email,token) => {
    const user = await User.findOne({ email: email });
    user.resetToken = token;
    await user.save();
}

const getUserInfo = async (id) => {
    const userID = new ObjectId(id)
    const res = await User.find({ _id: userID});
    return res;
}

module.exports = {
    checkUser,createUser,emailVerify,resetPwd,checkToken,userProfileUpdate,userPasswordReset, getUserInfo,checkUserByid
}