const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const notificationSchema = new Schema({
    screamId:{
        type:String
    },
    read:{
        type:Boolean,
        default:false
    },
    reciver:{
        type:String
    },
    sender:{
        type:String
    },
    type:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports= mongoose.model('Notification',notificationSchema)