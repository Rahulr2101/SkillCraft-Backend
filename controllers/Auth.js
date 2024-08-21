const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
require("dotenv").config();
const mail = require("../utils/mailSender");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validEmail(email)) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }

    const CheckUser = await User.findOne({ email: email });
    if (CheckUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    //check unique otp
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });

      const otpPayLoad = { email, otp };

      const otpbody = await OTP.create(otpPayLoad);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        otp,
      });
    }
  } catch (err) {
    console.log("Failed to send OTP", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

validEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !contactNumber ||
      !otp
    ) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }
    if (!validEmail(email)) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }
    if (password !== confirmPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Password does not match" });
    }
    const checkEmail = await User.findOne({ email: email });

    if (!checkEmail) {
      return res
        .status(401)
        .json({ success: false, message: "Email already exists" });
    }
    const recentOtp = await OTP.find({ email: email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (recentOtp.length === 0) {
      return res.status(401).json({ success: false, message: "OTP not found" });
    } else if (recentOtp.otp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    const userPayload = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails: profileDetails._id,
      imgae: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    };

    const user = await User.create(userPayload);
    return res
      .status(200)
      .json({ success: true, message: "User created", user });
  } catch (err) {
    console.log("Failed to signup", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }
    if (!validEmail(email)) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.accountType,
      };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        message: "User signed in",
        user,
        token,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    if (!checkPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User signed in", user });
  } catch (err) {
    console.log("Failed to signin", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required" });
    }
    if (!validEmail(email)) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Passwords do not match" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    mail(
      email,
      "Password Change",
      "Your password has been changed successfully"
    );
    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.log("Failed to change password", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
