const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users.js');
const passport = require('passport');
router.get('/new', (req, res) => {
    res.render('users/login.ejs',{message:"HI!! Please Login!",username:req.session.username});
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
  User.findOne({ username: req.username },(err,user) => {
    if(user===null){
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        User.create(req.body, (error, createdUser) => {
          req.session.username=createdUser.username;
            res.redirect('/blogs');  })
    }else{
      console.log("User exists! Please use Login!");
      res.render("./users/login.ejs",{message:"User exists",username:req.username});
    }
  })//findone end

});

module.exports = router;
