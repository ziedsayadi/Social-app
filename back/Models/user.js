const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const userSchema = new Schema({
    hundel:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        default:"no-profile-pic"
    },
    bio:{
        type:String,
    },
    website:{
        type:String,
    },
    location:{
        type:String,
    }
    
})

module.exports=mongoose.model('User', userSchema);