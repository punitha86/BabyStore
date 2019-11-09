const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users.js');

router.get('/new', (req, res) => {
    res.render('users/login.ejs',{message:"HI!! Please Login!"});
})

router.get('/logout', (req, res, next) => {
  req.session.destroy((err)=>{
		if(err){
			res.redirect('/new')
		} else {
      res.redirect('/')
		}
	});
});

router.post('/', (req, res) => {
  //console.log('reqbody',req.body);
  console.log(req.body);
  if(User.findOne({ username: req.username }))
  {
    console.log("user exists");
    //res.flash('fail','User exists please use login');
    res.render("./users/login.ejs",{message:"User exists"});
  }
    else {
      if(err){
          console.log(err);
      } else{
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        User.create(req.body, (error, createdUser) => {
          req.session.username=createdUser.username;

          //console.log(req.body);
            res.redirect('/blogs');  })
      }

    }

});

module.exports = router;
