const e = require('express');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    firstName: {    
        type:String,
        required: true,
        trim:true,
    },
    lastName: {
        type:String,
        required: true,
        trim:true,
    },
    email: {
        type:String,
        required: true,
        trim:true,
    },
    password: {
        type:String,
        required: true,
    },

    accountType:{
        type:String,
        enum: ['admin', 'user','Instructor'],
        required: true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        rel:"Profile"
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        rel:"Course"
    }],

    imgae:{
        type:String,
        required:true,
    },

    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        rel:"CourseProgress"
    }]
});

module.exports = mongoose.model('User', userSchema);
