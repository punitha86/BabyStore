const express = require('express');

const Blog = require('../models/blogs.js');
const router = express.Router();
//new route/// for adding a new blog
router.get('/new', (req, res) => {
    res.render('blogs/new.ejs')
});
///create route post route for the new blog to be created
router.post('/',(req,res) => {
  res.send("ready to create")
})



module.exports = router;
