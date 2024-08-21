const User = require("../models/User");
const mail = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    const token = crypto.randomUUID();
    user.token = token;
    user.resetPasswordToken = Date.now() + 3600000;

    const updateDetails = await User.findOneAndReplace(
      { email: email },
      { token: token, resetPasswordToken: this.resetPasswordToken },
      { new: true }
    );
    const url = `http://localhost:3000/resetPassword/${token}`;

    await mail(
      email,
      "Password reset",
      `<h1>Click <a href="${url}">here</a> to reset your password</h1>`
    );
    return res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    console.log("Failed to reset Password", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

//resetPassword

exports.resetPassword = async (req, res) => {
  try {
    const { password, token, confirmPassword } = req.body.email;

    if (!password !== confirmPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Passwords do not match" });
    }
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(401).json({ success: false, message: "Token invalid" });
    }
    if (user.resetPasswordToken < Date.now()) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    const newPassword = req.body.newPassword;
    const hashedPassword = bcrypt.hash(newPassword);
    user.password = hashedPassword;
    await User.findOneAndReplace(
      { token: token },
      { password: hashedPassword }
    );
    return res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.log("Failed to reset Password", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
