const express = require('express');
const router = express.Router();
const passport = require('passport')



//auth Login
router.get('/login',(req,res) => {
  res.render('login.ejs');
});

///auth with google
router.get('/google',passport.authenticate('google',{
  //what we want from user information
  scope:['profile']
}));
// (req,res) => {
//   //handle wit passport
//   //res.send('logging in with google');
// });
///call back route for google to redirect
router.get('/google/redirect',passport.authenticate('google'),(req,res) => {
  res.send(req.user);
  //res.redirect('/');
  //res.redirect('/profile/');
})

module.exports = router;
