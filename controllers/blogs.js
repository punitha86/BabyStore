const express = require('express');
const Blog = require('../models/blogs.js');
const router = express.Router();
//new route/// for adding a new blog
router.get('/', (req, res) => {
  console.log(req.session);
  Blog.find({createdBy:req.session.username}, (err, allBlogs) => {
    res.render('blogs/new.ejs', {
      blogs: allBlogs,
      username:req.session.username
    })
  }).sort({createdAt:-1})
});
///create route post route for the new blog to be created
router.post('/', (req, res) => {
  //res.send("ready to create");
  req.body.createdBy=req.session.username;
  console.log(req.body.createdBy, req.session.username);
  Blog.create(req.body, (error, createdNewBlog) => {
    res.redirect('blogs/');
    console.log(createdNewBlog,req.body);
  });
})

///after clicking edit it should show all the correct details
router.get('/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (error, editBlog) => {
    res.render(
      'blogs/edit.ejs', {
        blog: editBlog
      }
    );
  });
});

///by clicking submit to the changes we get to this method
router.put('/:id', (req, res) => {
  Blog.findByIdAndUpdate(
    req.params.id,
    req.body, {
      new: true
    },
    (error, updatedBlog) => {
      res.redirect('/blogs');
      console.log(updatedBlog, req.body);
    }
  )
});

///after clicking edit it should show all the correct details
router.get('/:id', (req, res) => {
  Blog.findById(req.params.id, (error, showBlog) => {
    res.render(
      'blogs/show.ejs', {
        blog: showBlog
      }
    );
  });
});

////the user can delete the blog he created
router.delete('/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
    res.redirect('/blogs');
  })
});

module.exports = router;
