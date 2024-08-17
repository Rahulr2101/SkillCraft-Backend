const mongoose = require("mongoose");

const OTP = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 600,
  },
});

module.exports = mongoose.model("OTP", OTP);
