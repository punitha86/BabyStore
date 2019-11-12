const passport = require('passport');
const LocalStratergy = require('passport-local');
const GoogleStratergy = require('passport-google-oauth20');
const keys = require('./keys.js');
const User=require('../models/users.js');
///serializing the cookie
passport.serializeUser((user,done)=>{
  done(null, user.id);
});

//desrialize the cookie
passport.deserializeUser((id,done)=>{
  User.findById(id).then((user) => {
    done(null,user);
  })
  //done(null, user);
});


////google strategy
passport.use(new GoogleStratergy({
    //options for google strategy
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (accessToken, refreshToken, profile/*value brought back from gogle*/, done) => {
    ///passport call back function
    console.log("passport call back function");
    console.log(profile);
    ///check if we have that user already in our // // Db
User.findOne({googleId:profile.id}).then((currentUser) => {
  if(currentUser){
    //we have a user
    console.log(currentUser,"currentuser");
    done(null,currentUser);
  }else{
    new User({
      username:profile.displayName,
      googleId:profile.id,
      googleImg:profile._json.picture
    }).save().then((newUser) => {
      console.log('newuser created'+newUser);
      done(null,newUser);
    })
  }
})

})



)
