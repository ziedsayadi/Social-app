const express = require('express');
const router = express.Router();
const passport=require('passport');
const Scream = require('../Models/scream');
const Notification = require('../Models/notification');

router.post('/like/:screamId',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Scream.findOne({_id:req.params.screamId})
    .then(scream=>{
        if(scream){
            const newLikeNotification = new Notification({
                screamId:req.scream.id,
                reciver:req.user.hundel,
                type:'comment',
                read:false,
                createdAt:new Date().toISOString,
                sender:req.body.sender
            })

            newLikeNotification.save()
            .then((notification)=>{
                return res.status.json(notification)
            })
            .catch(err=>{
                console.log(err);
                return res.status(500).json({error:"faild sending notification"})
            })
        } else return res.status(404).json({error:'no scream found'})
    }).catch(err=>{
        console.log(err)
        return
    }) 
})
router.delete('/unlike/:screamId',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Scream.findOne({_id:req.params.screamId})
    .then(scream=>{
        if(scream){
        Notification.findOneAndDelete({screamId:req.scream.id})
        .then(()=>{
            res.json({error:'screan unliked'})
        }).catch(err=>{
            console.log(err);
            return
        })
    } else return 
    }).catch(err=>{
            console.log(err);
            return
     })
})
router.post('/comment/:screamId',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Scream.findOne({_id:req.params.screamId})
    .then(scream=>{
        if(scream){
            const newLikeNotification = new Notification({
                screamId:req.scream.id,
                reciver:req.user.hundel,
                type:'comment',
                read:false,
                createdAt:new Date().toISOString,
                sender:req.body.sender
            })
            newLikeNotification.save()
            .then((notification)=>{
                return res.status.json(notification)
            })
            .catch(err=>{
                console.log(err);
                return res.status(500).json({error:"faild sending notification"})
            })
        } else return res.status(404).json({error:'no scream found'})
    }).catch(err=>{
        console.log(err)
        return
    }) 
})

module.exports=router