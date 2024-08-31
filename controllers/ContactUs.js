const User = require("../models/User");
const emailSender = require("../utils/mailSender");

exports.contactUsController = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, phoneNumber, message } = req.body;
  if (!firstName || !lastName || !emailAddress || !phoneNumber || !message) {
    return req.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  await emailSender(
    emailAddress,
    "We received your request",
    `We received your request for ${message}`
  );
  return req.status(200).json({
    success: true,
    message: "Succcessfull",
  });
  } catch (err) {
    return req.status(400).json({
        success:false,
        message:err.message
    })
  }
  
};
