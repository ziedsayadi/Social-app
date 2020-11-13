const express = require('express');
const router = express.Router();
const passport=require('passport')
const Scream = require('../Models/scream');
const Comment = require('../Models/comments');
const Likes = require('../Models/likes');

// get all screams
router.get('/screams',(req,res)=>{
    Scream.find()
    .sort({createdAt:-1})
    .then(data=>res.json(data))
    .catch(err=>{
        console.log(err)
        return res.status(500).json({error:"somthing went wrong"})
    })
})

// get a specefic scream

router.get('/scream/:screamId' , (req,res)=>{
    let screamData = {}
    Scream.findOne({_id:req.params.screamId})
    .then(scream =>{
        if(!scream){
            return res.status(404).json({error:"scream dose not exist"})
        }
        screamData.screamId=scream._id
        screamData = scream;
        Comment.find({screamId:req.params.screamId})
        .sort({createdAt:-1})
        .then(comment=>{
            return comment
        })
        .then(data=>{
        // console.log(data)
         screamData.comment= [];
         screamData.comment.push(data);
         
         return res.json(screamData)

    })
    })  
    .catch(err=>{
        console.log(err)
        return res.status(500).json({error:"somthing went wrong"})
    })
})

// delet scream (easiest action eveeeer)

router.delete("/scream/:screamId" , passport.authenticate('jwt',{session:false}),(req,res)=>{
    Scream.findOneAndDelete({_id:req.params.screamId})
    .then(()=>{
        res.status(200).json({message:"scream deleted successfully"})
    })
    .then(()=>{
        Scream.findOne({_id:req.params.screamId})
        .then(scream=>{
            if(!scream){
           Likes.findOneAndDelete({_id:req.scream.id})
           .then(()=>{
                res.status(200).json({message:"like gone along with the delted scream"})
            })
            .catch(err=>{
                console.log(err)
                res.status(500).json({error:"somthing went wrong"})
        })
            }
            Comment.findOneAndDelete({screamId:req.scream.id})
            .then(()=>{
                 res.status(200).json({message:"comment gone along with the delted scream"})
            })  
            .catch(err=>{
                console.log(err)
                res.status(500).json({error:"somthing went wrong"})
        })       
        })
        .catch(err=>{
                console.log(err)
                res.status(500).json({error:"somthing went wrong"})
        })
         
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error:"failed to delete for some reason!"})
    })
})

// post a scream
router.post("/scream",passport.authenticate('jwt',{session:false}) ,(req,res)=>{
    const newScream = new Scream ({
        user:req.user.hundel,
        content:req.body.content,
        likeCount:req.body.likeCount,
        commentCount:req.body.commentCount,
        createdAt:new Date().toISOString()
    })
    newScream
    .save()
    .then(data=>res.status(201).json(data))
    .catch(err=>{
        console.log(err)
        return res.status(500).json({error:"somthing went wrong"})
    })
})

// post a comment 

router.post("/scream/:screamId/comment",passport.authenticate('jwt',{session:false}) ,(req,res)=>{
    if(req.body.body.trim()==="") return res.status(400).json({error:"Must not be empty"})
 const newComment = new Comment({
    userHundel:req.user.hundel,
    screamId:req.params.screamId,
    body:req.body.body,
    userImage:req.user.profileImage,
    createdAt:new Date().toISOString()
})
 Scream.findOne({_id:req.params.screamId})
 .then(scream=>{
    if(!scream) {
        return res.status(404).json({error:"scream not found"})
    } 
 newComment.save()
 .then(data=>{
     scream.commentCount++
 Scream.findOneAndUpdate({_id:req.params.screamId},{commentCount:scream.commentCount})
 .then(updatedCommentCount=>{return updatedCommentCount})   
     res.status(200).json(data)
    })
 .catch(err=>{
     console.log(err)
     res.status(500).json({error:error.code})
    })
})
.catch(err=>{
    console.log(err)
    res.status(404).json({error:'somthing went wrong'})
})
})

// like screams 
router.get("/scream/:screamId/like",passport.authenticate("jwt",{session:false}),(req,res)=>{
    let screamData
    Scream.findOne({_id:req.params.screamId})
    .then(scream=>{
        if(scream){
            screamData=scream;
            screamData.screamId=scream.id;
            Likes.findOne().then(like=>{
            if(!like){
                const likes = new Likes({
                userHundel:req.user.hundel,
                screamId:scream.id
            })
            likes.save()
            .then(()=>{
                    screamData.likeCount++
                    Scream.findOneAndUpdate({likeCount:screamData.likeCount})
                    .then(screamUpdated=> res.status(200).json(screamUpdated))   
            }).catch(err=>{console.log(err);res.status(500).json({error:err.code})})
                } else res.status(400).json({error:'you already liked this scream'})
            })
        }
        else return res.status(404).json({error:'Scream not found'})
        
    }).catch(err=>{console.log(err);res.status(500).json({error:err.code})})
  
})

// unlike rout
router.get("/scream/:screamId/unlike",passport.authenticate("jwt",{session:false}),(req,res)=>{
    let screamData
    Scream.findOne({_id:req.params.screamId})
    .then(scream=>{
        if(scream){
            screamData=scream;
            screamData.screamId=scream.id;
            Likes.findOne().then(like=>{
            if(!like){
                return res.status(404).json({error:'this scream is not liked'})
            }   
            else{
                if(screamData.likeCount > 0){
                    screamData.likeCount--}
                else screamData.likeCount=0
                Scream.findOneAndUpdate({likeCount:screamData.likeCount})
                .then(screamUpdated=>{
                    Likes.findOneAndDelete({userHundel:req.user.hundel,screamId:req.params.screamId})
                    .then(()=>{
                        res.status(200).json(screamUpdated)
                    }).catch(err=>{console.log(err);res.status(500).json({error:err.code})})
                }).catch(err=>{console.log(err);res.status(500).json({error:err.code})})
            }
        }).catch(err=>{console.log(err);res.status(500).json({error:err.code})})
    } else res.status(404).json({error:"scream dose not exist"})
    }).catch(err=>{console.log(err);res.status(500).json({error:'somthing went wrong'})})
  
})


module.exports=router