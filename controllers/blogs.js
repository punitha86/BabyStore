const express = require('express');
const Blog = require('../models/blogs.js');
const router = express.Router();
///////////////////ensuring if the user is autenticated to use those pages
const isAuthenticated = (req,res,next) => {
  if(req.session.username){
    next();
  }else {
    res.redirect('/users/new');
  }
}

//new route/// for adding a new blog
router.get('/',isAuthenticated,(req, res) => {
  console.log(req.session);
  // Blog.find({createdBy:req.session.username}, (err, allBlogs) => {
  //   res.render('blogs/new.ejs', {
  //     blogs: allBlogs,
  //     username:req.session.username
  //   })
  // }).sort({_id:-1})
  Blog.find({createdBy:req.session.username})
  .sort({_id:-1})
  .then(allBlogs => {
    res.render('blogs/new.ejs', {
      blogs: allBlogs,
      username:req.session.username
    })
  })
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
router.get('/:id/edit',isAuthenticated,(req, res) => {
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
  console.log("inside blog put");
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
//patch route for like button
router.patch('/:id', (req, res) => {
  Blog.findByIdAndUpdate(
    req.params.id,
    {$inc: {likes: 1}},
    {new:true},
    (err, updated) => {
      res.redirect('/blogs/'+req.params.id)
    }
  )
})
//comment
router.post('/comments/:id',(req, res) =>{
console.log(req.body);
  Blog.findByIdAndUpdate(
    req.params.id,
    {$push:{"comments":req.body.comments}},
    {safe: true, upsert: true, new : true},
    (err, updated) => {
      res.redirect('/blogs/'+req.params.id)
    }
  );
});
//patch for comments
router.patch('/comments/:num/:id',isAuthenticated, (req, res) => {
  console.log(req.body);
  Blog.findByIdAndUpdate(
    req.params.id,
    {$pull:{"comments":req.body.comments[req.params.num]}},
    {safe: true, upsert: true, new : true},
    (err, updated) => {
      console.log(updated,'updated');
      res.redirect('/blogs/'+req.params.id+'/edit/')
    });
});

////the user can delete the blog he created
router.delete('/:id',isAuthenticated, (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
    res.redirect('/blogs');
  })
});

module.exports = router;
