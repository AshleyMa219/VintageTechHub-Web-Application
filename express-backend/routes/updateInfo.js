var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const resetPasswordConfirm = require("./resetPasswordConfirm")
const {createUser,checkUser,resetPwd , userProfileUpdate,userPasswordReset,checkUserByid} = require("../controller/user");


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
              return res.json({'msg': "Success"})
          }else {
             return res.json({'msg':"Incorrect Password"})
          }
      }
    });
});
module.exports = router;