const express = require("express");
const route = express.Router();
const mongoClient = require('mongodb').MongoClient
const db= require('../config/connection').get




//route for admin and login
route.get('/',(req,res)=>{
    if (req.session.user) {
        res.redirect('/login/dashboard');
    } else {
        res.render('index' ,{
            emailError:' ',
            nameVal:''
        })
    }
})


//route for login
route.get('/login',(req,res)=>{
    if (req.session.user) {
        res.redirect('/login/dashboard')
    }
    else {
         res.render('base',{
            emailErr:'',
            passwordErr:'',
            emailGiv:''
         });
    }
})

//route for dash
route.get('/login/dashboard',(req,res)=>{
    if (req.session.user) {
        res.render('dashboard')
    }
})

//session middleware
route.post('/login',async(req,res)=>{
    let {body} = req
    let credential = await db().collection('user').findOne({email:body.email})
    console.log(body);
    console.log(credential);
    if (credential) {
        if (req.body.email === credential.email && req.body.password === credential.password) {
        req.session.LoggedIn = true;
        req.session.user = req.body.email;
        res.redirect('/login')
        }else if(credential.password!=body.password){
            res.render('base',{
                emailErr:'',
                passwordErr:'Invalid Password',
                emailGiv:req.body.email
            })
        }
    }else{
       res.render('base',{
        emailErr:'Email not found',
        passwordErr:'',
        emailGiv:req.body.email
       })
    }  
    
        
    
})

route.post('/signup',async(req,res)=>{
    let {body} = req
    let credential = await db().collection('user').findOne({email:body.email})
    console.log(credential);
    if (credential) {
        if (credential.email === body.email) {
        res.render('index',{
            emailError:'Email is already in use',
            nameVal:req.body.name
        })
    } 
    }else {
        req.session.user = req.body.email
        db().collection('user').insertOne(req.body)
        console.log(body);
        res.redirect('/login/dashboard')
    }  
})


route.get("/logout", (req, res) => {
    req.session.user = null;
        res.redirect("/")
        console.log(req.session);
      })



module.exports = route