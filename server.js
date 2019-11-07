/////**********************************//////////
/////*************Dependencies***********//////////
/////**********************************//////////
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
const session = require('express-session');
require('dotenv').config();
/////*************Port***********//////////

const PORT = process.env.PORT;
console.log(PORT);
///middleware////
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret:'buggyrandomstring',
  resave:false,
  saveUninitialized:false
}));
/////**********************************//////////
/////*************Database***********//////////
/////**********************************//////////
const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);

const blogsController = require('./controllers/blogs.js');
app.use('/blogs', blogsController);


const usersController = require('./controllers/users.js');
app.use('/users', usersController);


const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

///home page route
const Blog = require('./models/blogs.js');
app.get('/' , (req, res) => {
  Blog.find({},(err,allBlogs) => {
      res.render('home.ejs', {
        blogs: allBlogs })
    })
  })
  //res.send('Hello World!');

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);


// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));



////PORT
//app.listen(PORT, () => console.log( 'Listening on port:', PORT));
app.listen(PORT,() => {
  console.log("Listening on Port",PORT);
})
