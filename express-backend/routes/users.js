var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const {createUser,checkUser,resetPwd , getUserInfo} = require("../controller/user");
const emailVerify = require("./sendEmail");
const resetPassword = require("./resetPassword");

/* GET users listing. */
router.get('/user', async function(req, res, next) {
  const User = await checkUser(decodeURIComponent(req.query['email']))
  try {
    if (User[0]['verify']===false){
      return res.json([{'result': "Please Login to Your Email to Verify!"}])
    }else {
      bcrypt.compare(req.query['password'], User[0]['password'], function (err, result) {
        if (err) {
          return res.json(err)
        } else {
          let result1 = User
          result1[0].result = result
          result1.unshift({'result': result})
          return res.json(result1)
        }
      });
    }
  } catch (err) {
    return res.json([{'result': "user not exist"}])
  }
});

router.get('/createUser', async function(req, res, next) {
  const result = await checkUser(decodeURIComponent(req.query['email']))
  if (result == "") {
    const token = emailVerify(decodeURIComponent(req.query['email']))
    const user = {
      email: decodeURIComponent(req.query['email']),
      lastname:decodeURIComponent(req.query['lastname']),
      firstname:decodeURIComponent(req.query['firstname']),
      password:decodeURIComponent(req.query['password']),
      token:token
    }
    await createUser(user)
    return res.json([{'result': "Success"}])
  } else {
    return res.json([{'result': "user already exist"}])
  }
})

router.get('/resetPassword', async function(req, res, next) {
  const result = await checkUser(decodeURIComponent(req.query['email']))
  console.log(result)
  if (result == "") {
    return res.json([{'result': "user not exist"}])
  }
  else {
    const token =resetPassword(decodeURIComponent(req.query['email']))//send email
    await resetPwd(decodeURIComponent(req.query['email']),token)//add token to database
    return res.json([{'result': "Success"}])
  }
})

router.get('/userInfo', async function(req, res, next) {
  const _id = req.query.id
  const result = await getUserInfo(_id)
  res.json(result)
});


module.exports = router;
