const mongoose = require("mongoose");
const Course = require("./Course");

const RatingAndReview = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  course:{
    type: mongoose.Schema.Types.ObjectId,
    require:true,
    ref:"Course",
    index:true
  }
});

module.exports = mongoose.model("RatingAndReview", RatingAndReview);
