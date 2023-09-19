var express = require('express');
var router = express.Router();
const {emailVerify,checkToken,userPasswordReset} = require("../controller/user");

router.get('/verify-email/:token', async function(req, res, next) {
  const token = req.params.token;
  const User = await emailVerify(token)
  try {
    return res.render('active-success', {username: User[0].lastname + " " + User[0].firstname});
  }catch (err){
    return res.render('active-fail')
  }
});
router.get('/passwordReset/:token', async function(req, res, next) {
  const token = req.params.token;
  const User = await checkToken(token)
  try {
    return res.render('reset-page', {username: User[0].lastname + " " + User[0].firstname,email: User[0].email});
  }catch (err){
    return res.render('resetpw-token-fail')
  }});
router.post('/reset-success', async function(req, res, next) {
  const email = req.body.password1;
  const password = req.body.password2;
  await userPasswordReset(email,password)
  return res.render('reset-success')
})
module.exports = router;
