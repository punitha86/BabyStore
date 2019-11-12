/////**********************************//////////
/////*************Dependencies***********//////////
/////**********************************//////////
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
//assosciate tehs tarategy
const passportSetup=require('./config/passport-setup.js')
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();
const keys=require('./config/keys.js');
//const cookieSession=require('cookie-session');
/////*************Port***********//////////

const PORT = process.env.PORT;
console.log(PORT);
///middleware////
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret:keys.sessionexp.sessionkey,
  resave:false,
  saveUninitialized:false,
  store: new MongoStore({
  mongooseConnection: db
})
}));
/////**********************************//////////
/////*************Database***********//////////
/////**********************************//////////
const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);

//////////////////////////////
// const isAuthenticated = (req,res,next) => {
//   if(req.session.username){
//     next();
//   }else {
//     res.redirect('/');
//   }
// }
///to access files in public folder
app.use(express.static('public'))
///controllers///////

app.use(passport.initialize());
app.use(passport.session());

const blogsController = require('./controllers/blogs.js');
app.use('/blogs', blogsController);


const usersController = require('./controllers/users.js');
app.use('/users', usersController);


const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

////for google authentication
const authController = require('./controllers/auth.js');
app.use('/auth', authController);


///home page route
const Blog = require('./models/blogs.js');

app.get('/' ,(req, res) => {

  Blog.find({},(err,allBlogs) => {
      res.render('home.ejs', {
        blogs: allBlogs })
    }).sort({_id:-1})
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

////PORT
//app.listen(PORT, () => console.log( 'Listening on port:', PORT));
app.listen(PORT,() => {
  console.log("Listening on Port",PORT);
})
