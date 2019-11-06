const express = require('express');

const Blog = require('../models/blogs.js');
const router = express.Router();
//new route/// for adding a new blog
router.get('/', (req, res) => {
  Blog.find({},(err,allBlogs) => {
    res.render('blogs/new.ejs', {
      blogs: allBlogs
    })
  })

});
///create route post route for the new blog to be created
router.post('/', (req, res) => {
  //res.send("ready to create");
  Blog.create(req.body, (error, createdNewBlog) => {
    res.redirect('blogs/new.ejs');
    console.log(createdNewBlog);
  });
})
///after clicking edit it should show all the correct details
router.get('/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (error, editBlog) => {
        res.render(
            'blogs/edit.ejs',
            {
                blog:editBlog
            }
        );
    });
});


module.exports = router;
