const express=require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')
const jwt = require('jsonwebtoken');
const Likes=require('../Models/likes')
const {reduceDetails} = require('../validators/userDetails')
const registrationVaid = require('../validators/registeration');
const loginVaid = require('../validators/login');
const dotenv=require('dotenv');
const User = require('../Models/user');

// setup config 
dotenv.config();


// register rout


router.post('/register' , (req,res)=>{
 const {isValid,errors} = registrationVaid(req.body)
 const {email,password,confirmPassword,hundel} = req.body;
 if(!isValid){
     return res.status(400).json(errors)
 }
 User.findOne({hundel:hundel}).then(user=>{
     if(user){
         return res.status(404).json(errors.hundel='This hundel is already in use')
     }
 })
 .catch(err=>console.log(err))

 User.findOne({email:email}).then(user=>{
     if(user){
          return res.status(404).json(errors.email='This email is already taken')
     }
 bcrypt.genSalt(10,(err,salt)=>{
       bcrypt.hash((password,confirmPassword) ,salt , (err,hash)=>{
         const newUser = new User({
             hundel:hundel,
             email:email,
             password:hash,
             confirmPassword:hash
           })
        newUser.save()
        .then(user=>res.status(201).json({message:`user with ${user._id} id added successfully`}))
        .catch(err=>console.log(err))   
       })
       
   })
     
 })
 .catch(err=>{
    console.log(err);
    return res.status(500).json({error:err.code})}
    )
 

   
  
})

// login rout

router.post('/login' , (req,res)=>{
    const {password,email} = req.body
    const {isValid,errors} = loginVaid(req.body)
    if(!isValid){
        return res.status(404).json(errors)
    }
     
    User.findOne({email:email})
    .then(user=>{
        if(user){
            bcrypt.compare(password,user.password).then((isMatch)=>{
                if(isMatch){
                    const token = jwt.sign({id:user._id},process.env.SECRET_KEY);
                    res.send({success:true , token:token})
                }else {
                    res.status(404).json(errors.password="password dose not match!")
                }
            })
        }else {
            res.status(404).json(errors.email='email dose not match')
        }
    })
    .catch(err=>{console.log(err);
    return res.status(500).json({error:err.code})
})
})

// Add user Details
router.post("/user" ,passport.authenticate('jwt',{session:false}),(req,res)=>{
    let userDetails = reduceDetails(req.body);
    User.findOneAndUpdate({hundel:req.user.hundel},userDetails)
    .then(()=>{
        res.json({message:'details added successfully'})
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({error:err.code})
    })
} )

// get userCredentials

router.get('/user',passport.authenticate('jwt',{session:false}),(req,res)=>{
    let userData ={}
    User.findOne({hundel:req.user.hundel})
    .then(user=>{
        if(user){
            userData.credentials = user 
        }

     const likes = new Likes({
     userHundel:req.user.hundel
     })
     // console.log(likes)
      return likes
    })
    .then(data=>{
         userData.likes =[];
        userData.likes.push(data)
        console.log(data)
        res.json(userData)
    })
    .catch(err=>console.log(err))


})

module.exports=router