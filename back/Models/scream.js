const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const screemSchema = new Schema ({
    user : {
        type:String
    },
    content :{
        type:String,
        required:true
    },
    createdAt :{
        type:Date,
        default:Date.now
    },
    comment:{
        type:Array
    },
    likeCount:{
        type:Number,
        default:0
    },
    commentCount:{
        type:Number,
        default:0
    }
})

module.exports=mongoose.model('Scream',screemSchema)