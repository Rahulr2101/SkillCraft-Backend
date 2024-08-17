const mongoose = require("mongoose");
const sendEmail = require("../utils/mailSender");

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

async function sendVerificationEmail(email,otp){
  try{
    const mailResponse = await sendEmail(email,"OTP for verification",`<h1>Your OTP is ${otp}</h1>`);
    console.log("mail sent successfully:",mailResponse);

  }catch(err){
    console.log("error occured while sending mails:",err);
  }
}

OTP.pre("save",async function(next){
  await sendVerificationEmail(this.email,this.otp);
  next();
})

module.exports = mongoose.model("OTP", OTP);
