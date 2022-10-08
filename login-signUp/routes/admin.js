const express = require("express");
const route = express.Router();
const mongoClient = require('mongodb').MongoClient
const db= require('../config/connection').get
const objectId = require('mongodb').ObjectId


//admin credential
const credential = {
    email: 'justinkj765@gmail.com',
    password:'1234'
}


route.get('/',async(req,res)=>{
    if (req.session.admin){
       let data =await db().collection('user').find().toArray()
       console.log(data);
        res.render('admin-dashboard',{dbUser:data}) 
    } 
    else{
        res.redirect('/admin/login')
    } 
})

route.get('/admin/login',async(req,res)=>{
    if (req.session.admin) {
        let data =await db().collection('user').find().toArray()
        console.log(data);
         res.render('admin-dashboard',{dbUser:data}) 
    } else {
        res.render('admin-login',{
        nameError :'',
        passErr :'',
        nameVal:''
     })
    }       
    
})

route.post('/admin',(req,res)=>{
    if (credential.email === req.body.email && credential.password===req.body.password  ) {
        req.session.LoggedIn = true;
        req.session.admin = req.body;
        res.redirect('/admin/dashboard')
    }else if(credential.email != req.body.email){
        res.render('admin-login',{
            nameError :'Email not found',
            passErr :'',
            nameVal:req.body.email,
         })
    }else if(credential.password != req.body.password){
        res.render('admin-login',{
            nameError :'',
            passErr :'Password incorrect',
            nameVal:req.body.email,
         })
    }
})

route.get('/admin/dashboard',async(req,res)=>{
    if (req.session.admin) {
        let data =await db().collection('user').find().toArray()
        console.log(data);
         res.render('admin-dashboard',{dbUser:data}) 
    }else
    res.render('admin-login',{
        nameError :'',
        passErr :'',
        nameVal:''
        
     })
})

route.get('/admin/delete-user/:id',async(req,res)=>{
    if (req.session.admin) {
        let userId = req.params.id
        await db().collection('user').findOneAndDelete({_id:objectId(userId)})
        console.log(userId);
        let data =await db().collection('user').find().toArray()
        res.render('admin-dashboard',{dbUser:data}) 
    }
})

route.get('/admin/edit-user/:id',async(req,res)=>{
    if (req.session.admin) {
        let userId = req.params.id
        let data =await db().collection('user').findOne({_id:objectId(userId)})
        console.log(data);
        res.render('edit-user',{data,userId})
    }
})

route.post('/admin/edit/:id',async(req,res)=>{
    if (req.session.admin) {
        let userId = req.params.id
        await db().collection('user').updateOne({_id:objectId(userId)},{$set:{name:req.body.name, email:req.body.email,password:req.body.password,}})
        let data =await db().collection('user').find().toArray()
        res.render('admin-dashboard',{dbUser:data}) 
    }
})

route.get('/login-user',(req,res)=>{
    res.render('admin-add',{ emailError:'',nameVal:''})
})

route.post('/login-user',async(req,res)=>{
    let {body} = req
    let credential = await db().collection('user').findOne({email:body.email})
    console.log(credential);
    if (credential) {
        if (credential.email === body.email) {
        res.render('admin-add',{
            emailError:'Email is already in use',
            nameVal:req.body.name
        })
    } 
    }else {
        // req.session.user = req.body.email
        db().collection('user').insertOne(req.body)
        console.log(body);
        res.redirect('/admin/dashboard')
    }  
})


route.get('/login',(req,res)=>{
    req.session.admin=null;
    res.redirect('/admin/login')
})

module.exports = route 