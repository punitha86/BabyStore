const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/users.js');

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

      //console.log(req.user);
    //console.log("inside find");

    console.log(req.session);
      //'googleProfile.ejs',{
      //user:gotuser
    //}
    User.findById(req.user.id,(err,user) => {
      res.render('googleProfile.ejs',{username : user.username,imgsrc : user.googleImg});
    })

    });


  //res.send(req.user);


  //res.redirect('/');
  //res.redirect('/profile/');
//})

module.exports = router;
