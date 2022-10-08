
const express = require("express");
const route = require('./routes/router')
const path = require('path')
const session = require('express-session')
const db= require('./config/connection')
const admin = require('./routes/admin')

//app setting
const app = express();
//post
const port = process.env.PORT || 3008;

app.set("view engine",'ejs')

//parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static',express.static(path.join(__dirname,'public')) )

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// caching disabled for every route
app.use((req, res, next)=> {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

// middleware
db.connect((err)=>{
  if(err) console.log('connection not done');
  console.log('connected');
});
app.use('/',route)
app.use('/',admin)

app.listen(port,console.log("http://localhost:3008"))

// index.js

/*  PASSPORT SETUP  */
const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) =>{
  console.log(userProfile);
  res.send(userProfile)
} );
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// index.js

/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '225477678393-rbc9qhsd171ljc7p9infql54fnpm63os.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3008/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

