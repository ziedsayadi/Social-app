const mongoose = require('mongoose');
const Schema  = mongoose.Schema ;

const commentSchema = new Schema({
    userHundel : {
        type:String
    },
    screamId :{
        type:String,
    
    },
    body:{
        type:String
    },
    userImage:{
        type:String,
        default:"no-profile-pic"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Comments',commentSchema)