const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const emailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");

exports.capturePayment = async (req, res) => {
  const { CourseId } = req.body;

  const UserId = req.user.id;

  if (!CourseId) {
    return req.status(401).json({
      success: false,
      message: "All parameters required",
    });
  }

  try {
    const CourseExist = await Course.findById(CourseId);
    if (!Course) {
      return req.status(401).json({
        success: false,
        message: "Course doesnot exist.",
      });
    }
    const uid = new mongoose.Types.ObjectId(UserId);
    if (CourseExist.studentsEnrolled.includes(uid)) {
      return req.status(401).json({
        success: false,
        message: "Already enrolled for course",
      });
    }
    const amount = CourseExist.price;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: CourseId,
        UserId,
      },
    };

    try {
      const payementResponse = await instance.orders.create(options);
      console.log(payementResponse);
      return req.status(200).json({
        success: true,
        CourseName: CourseExist.courseName,
        courseDescription: CourseExist.courseDescription,
        thumbnail: CourseExist.thumbnail,
        orderID: payementResponse.id,
        currency: payementResponse.currency,
        amount: payementResponse.amount,
      });
    } catch (err) {
      return req.status(401).json({
        success: false,
        message: "Something went wrong while payement",
      });
    }
  } catch (err) {
    return req.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const webhookSecret = "12345678";
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  if (signature === digest) {
    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        {
          $push: {
            studentsEnrolled: userId,
          },
        },
        { new: true }
      );
      if (!enrolledCourse) {
        return req.status(500).json({
          success: false,
          message: "Course not found",
        });
      }
      const enrolledUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            courses: courseId,
          },
        }
      );
      const emailRespone = await emailSender(
        enrolledUser.email,
        "Congratulations, you are onboarded into new Course. ",
        "<p>Login to your dashboard.<p>"
      );
      return req.status(200).json({
        success: true,
        message: "Sinature Verified and Course Added",
      });
    } catch (err) {
      return req.status(500).json({
        success: false,
        message: err.message,
      });
    }
  } else {
    return req.status(500).status({
      success: false,
      message: "Invalid request",
    });
  }
};
