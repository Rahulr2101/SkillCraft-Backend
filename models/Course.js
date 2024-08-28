const mongoose = require("mongoose");
const Category = require("./Category");

const course = new mongoose.Schema({
  courseName: {
    type: String,
  },
  courseDescription: {
    type: String,
  },
  Instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  WhatYouWillLearn: {
    type: String,
  },
  CourseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReview: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  Tag: {
    type: [String],
    required:true,
  },
  Category:{
    type:mongoose.Schema.ObjectId,
    ref:"Category",
  }
  ,
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  instructor:{
    type:[String],
  },
  status:{
    type:String,
    enum:["Draft","Published"]
  }
});

module.exports = mongoose.model("Course", course);
