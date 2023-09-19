var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/User')
const resetPasswordConfirm = require("./resetPasswordConfirm")
const {createUser,checkUser,resetPwd , userProfileUpdate,userPasswordReset,checkUserByid} = require("../controller/user");
const emailVerify = require("./sendEmail");
const resetPassword = require("./resetPassword");

router.post('/updatepsd', async (req, res) => {
  const id = decodeURIComponent(req.body['id'])
  const newPassword = decodeURIComponent(req.body['newPassword'])
  const oldPassword = decodeURIComponent(req.body['oldPassword'])
  const user = await checkUserByid(id)
  bcrypt.compare(oldPassword, user[0]['password'], function (err, result) {
      if (err) {
        return res.json(err)
      } else {
          if (result===true){
              userPasswordReset(user[0]['email'],newPassword)
              return res.json({'msg':resetPasswordConfirm(user[0]['email'],newPassword)})
          }else {
             return res.json({'msg':"Incorrect Password"})
          }
      }
    });
});

router.post('/updateInfo', async (req, res) => {
  const id = decodeURIComponent(req.body['id'])
  const firstname = decodeURIComponent(req.body['firstname'])
  const lastname = decodeURIComponent(req.body['lastname'])
  const email = decodeURIComponent(req.body['email'])

  const password = decodeURIComponent(req.body['password'])
  const user = await checkUserByid(id)
  bcrypt.compare(password, user[0]['password'], function (err, result) {
      if (err) {
        return res.json(err)
      } else {
          if (result===true){
            userProfileUpdate(email,firstname,lastname)

            // userProfileUpdate(user[0]['email'],firstname,lastname)
            // User.updateOne({ "email": email,"firstname":firstname,"lastname":lastname })
              return res.json({'msg': "Success"})
          }else {
             return res.json({'msg':"Incorrect Password"})
          }
      }
    });
});

router.post('/update', async function(req, res, next) {
    User.updateOne({ _id: req.params.id }, { $set: req.body }, (err, doc) => {
        if (err) {
            res.send({ code: 602, data: doc, message: err.message })
        } else {
            res.send({ code: 200, data: doc, message: 'success' })
        }
    })
})
router.post('/verifyPsd', async function(req, res, next) {
    const { email, password } = req.body;
    console.log(req.body)
    console.log(email)
    console.log(password)

    const user = await User.findOne({ email });
    // const user = await User.findOne({ _id: id });
    console.log(user)
    if (!user) {
        return res.send({ code: 600, data: [], message: 'No such user' });
      }
      console.log(password)
      console.log(user.password)
    //   const isValidPassword = await bcrypt.compare(password, User[0]['password']);
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        res.send({ code: 200, data: user, message: 'success' });
      } else {
        res.send({ code: 600, data: [], message: 'password incorrect!' });
      }
})
//updatePassword
router.post('/change', async function(req, res, next) {
    const { id,email, oldPassword, newPassword, firstName, lastName } = req.body
    const Use = await User.findOne({ _id: id });
    if (user == "") {
    return res.json([{'result': "user not exist"}])
  }
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (isValidPassword) {
        const token = resetPassword(user.email)//send email
        await resetPwd(user.email,token)//add token to database
        res.send({ code: 200, data: user, message: 'user info has been changed!' });
    } else {
        res.send({ code: 600, data: [], message: 'password incorrect！' });
    }
})
module.exports = router;