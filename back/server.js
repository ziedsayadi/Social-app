const express = require('express') ;
const scream = require('./routes/scream');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const user = require('./routes/user');
const cors = require('cors');
const notification = require('./routes/notification')
const passport = require("passport");


// Config Setupp
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors())

// setup Passport
app.use(passport.initialize());
require("./config/passport")(passport);

// DB connection
mongoose.connect(process.env.MONGODB_URL,{
  useCreateIndex:true,
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useFindAndModify:false
})
.then(()=>console.log("db connected"))
.catch(err=>console.log(err))

// Screem milddlewear
app.use("/api", scream)

// user middlewaer 
app.use('/api' , user )

// notification
app.use('/api/notifications' , notification )




// Listner
const PORT = process.env.PORT || 5000
app.listen(PORT ,(err)=>{
     err ?console.log(err): 
     console.log(`server runing at port ${PORT}`) 
     }
)