const mongoose = require('mongoose');

const courseProgress = new mongoose.Schema({
    coursID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    completedVideos:[{
        type:mongoose.Schema.Types,
        ref:"SubSection"
    }],
    
})