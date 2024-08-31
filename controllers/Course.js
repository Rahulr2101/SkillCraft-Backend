const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const UploadImageToCloudinary = require("../utils/imageUploader");

//create Course

exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, tag, whatYouWillLearn } = req.body;
    const thumbnail = req.files.thumbnail;

    if (
      !tag ||
      !thumbnail ||
      !title ||
      !description ||
      !price ||
      !whatYouWillLearn
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userId = req.user._id;
    const instructorDetails = await User.findById(userId);
    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor not found" });
    }
    //Given tag valid
    const vaildTag = await Category.findOne({ name: tag });
    if (!vaildTag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }
    var thumbnail = await UploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName: title,
      courseDescription: description,
      Instructor: instructorDetails._id,
      WhatYouWillLearn: whatYouWillLearn,
      price: price,
      thumbnail: thumbnail.secure_url,
      Tag: vaildTag._id,
    });
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );
    await Category.findByIdAndUpdate(
      { _id: vaildTag._id },
      { $push: { course: newCourse._id } }
    );
    return res
      .status(201)
      .json({ success: true, message: "Course created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while creating Course",
    });
  }
};

//fetch all courses
exports.getCourseDetail = async (req, res) => {
  try {
    const courseId = req.body;
    if (!courseId) {
      return req.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "Instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate({
        path: "CourseContent",
        populate: {
          path: "SubSection",
        },
      })
      .populate("ratingAndReview")
      .populate("studentsEnrolled")
      .exec();
    if (!courseDetails) {
      return req.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
  
    return req.status(200).json({
      success: true,
      message: "successful",
      courseDetails,
    });
  } catch (err) {
    return req.status(400).json({
      success:false,
      message:err.message
    })
  }

  
};

exports.allCourse = async (req, res) => {
  try {
    const allCourses = await Course.find({});
    return req.status(200).json({
      success: true,
      message: "Successfully Fetched Courses",
      data: allCourses,
    });
  } catch (err) {
    console.log("Error occured while fetching Courses");
    req.status(401).json({
      success: false,
      message: "Somthing went wrong while fetching Courses",
    });
  }
};
