
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



