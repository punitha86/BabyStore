const express= require('express');
const router = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

router.get('/new', (req, res) => {
    res.render('users/login.ejs',{message:"Enter correct Password/ Please register first"});
});

router.post('/', (req, res) => {
  console.log(req.body.username);
    User.findOne({username:req.body.username}, (error,foundUser) => {
        if(foundUser === null){
            res.redirect('/sessions/new');
        } else {
          console.log('else',foundUser);
            const doesPasswordMatch = bcrypt.compareSync(req.body.password, foundUser.password);
            if(doesPasswordMatch){
              req.session.username= foundUser.username;
                res.redirect('/blogs');
            } else {
                res.redirect('/sessions/new');
            }
        }
    })
})

module.exports = router;
