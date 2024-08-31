const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating = async (req, res) => {
  try {
    const { courseId, rating, review } = req.body;
    if (!rating || !review || !courseId) {
      return req.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return req.status(404).json({
        success: false,
        message: "Student is not enrolled in Course.",
      });
    }
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      courseId: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Student already reviewed the course.",
      });
    }
    const newRating = await RatingAndReview.create(
      {
        user: userId,
        rating: rating,
        review: review,
        course: courseId,
      },
      { new: true }
    );
    const updateCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { ratingAndReview: newRating._id } }
    );
    return req.status(200).json({
      success: true,
      message: "Successful",
      newRating,
    });
  } catch (err) {
    return req.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.body;
    const result = await RatingAndReview.aggregate([
      {
        $match: new mongoose.Types.ObjectId(courseId),
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }
    return req.status(200).json({
      success: true,
      message: "No Rating",
      averageRating: 0,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return req.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const courseRating = await Course.findOne({ _id: courseId })
      .populate({
        path: "ratingAndReview",
        populate: {
          path: "user",
          select: "firstName lastName email image",
        },
      })
      .sort({ rating: "desc" })
      .exec();
    if (!courseRating) {
      return req.status(400).json({
        success: false,
        message: "Course not found.",
      });
    }
    return req.status(200).json({
      success: true,
      message: "Successfull",
    });
  } catch (err) {
    return req.status(400).json({
      success:false,
      message:err.message
    })
  }
};
