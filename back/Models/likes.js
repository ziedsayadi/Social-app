const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const {ObjectId} = mongoose.Schema.Types;

const likeSchma = new Schema({

    userHundel:{
        type:String
        
    },
    screamId:{
        type:String
        
    }
})

module.exports=mongoose.model('Likes',likeSchma)