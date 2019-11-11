const express = require('express');
const Blog = require('../models/blogs.js');
const router = express.Router();
const passport = require('passport');
///////////////////ensuring if the user is autenticated to use those pages
const isAuthenticated = (req,res,next) => {
  if(req.session.username){
    next();
  }else {
    res.redirect('/users/new');
  }
}

//new route/// for adding a new blog
router.get('/',isAuthenticated, (req, res) => {
  //console.log(req.session,'req.session in blog');
  //console.log(req);

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

// router.post('/', (req, res) => {
//   //res.send("ready to create");
//   console.log("inside post");
//   ///getting the user name from cookie
//   User.findById(req.session.passport.user,(err,passuser) => {
//     req.body.createdBy = passuser.username;
//   });
//   req.body.authorID = req.session.passport.user;
//   console.log("created by",req.body.createdBy, "req.user.username:",req.user.username,"req.passport.session",req.passport.session);
//   Blog.create(req.body, (error, createdNewBlog) => {
//     res.redirect('blogs/');
//     console.log("created new db blog entry",createdNewBlog, "req body in post",req.body);
//   });
// })

///after clicking edit it should show all the correct details
router.get('/:id/edit',isAuthenticated,(req, res) => {
  Blog.findById(req.params.id, (error, editBlog) => {
    res.render(
      'blogs/edit.ejs', {
        blog: editBlog,
        username:req.session.username
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
  console.log("get req", req);
  Blog.findById(req.params.id, (error, showBlog) => {
    res.render(
      'blogs/show.ejs', {
        blog: showBlog,
        username:req.session.username
      }
    );
  });
});
//patch route for like button
router.patch('/:id/:num', (req, res) => {
  Blog.findByIdAndUpdate(
    req.params.id, {
      $inc: {
        likes: req.params.num
      }
    }, {
      new: true
    },
    (err, updated) => {
      res.redirect('/blogs/' + req.params.id)
    }
  )
})
//comment
router.post('/comments/:id', (req, res) => {
  console.log(req.body);
  Blog.findByIdAndUpdate(
    req.params.id, {
      $push: {
        "comments": req.body.comments
      }
    }, {
      safe: true,
      upsert: true,
      new: true
    },
    (err, updated) => {
      res.redirect('/blogs/' + req.params.id)
    }
  );
});
//patch for comments
router.patch('/comments/:num/:id',isAuthenticated, (req, res) => {
  console.log(req.body);
  Blog.findByIdAndUpdate(
    req.params.id, {
      $pull: {
        "comments": req.body.comments[req.params.num]
      }
    }, {
      safe: true,
      upsert: true,
      new: true
    },
    (err, updated) => {
      console.log(updated, 'updated');
      res.redirect('/blogs/' + req.params.id + '/edit/')
    });
});
////post route for search
router.post('/search', (req, res) => {
  //res.render("blogs/search.ejs");
  Blog.find({
    $text: {
       //$regex: req.body.search , $options: 'i'
      $search: req.body.search
    }
  }, (err, result) => {
    console.log(result);
    res.render('blogs/search.ejs', {
      result: result,
      username:req.session.username
    });

  });
})

////the user can delete the blog he created
router.delete('/:id', isAuthenticated, (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
    res.redirect('/blogs/');
  })
});

module.exports = router;
