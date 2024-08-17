const mongoose = require("mongoose");

const invoice = new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    couseName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    price:{
        type:String
    },
    address:{
        type:String
    },
    pincode:{
        type:String
    },
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
    
})

module.exports = mongoose.model("Invoice", invoice);