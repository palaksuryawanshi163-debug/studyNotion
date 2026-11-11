const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

//func to send email

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      otp,
    );
    console.log("Email sent Successfully:", mailResponse);
  } catch (error) {
    console.log(error.message);
    console.log("Error While Sending Mail");
    throw error;
  }
}

OTPSchema.pre("save", async function () {
  await sendVerificationEmail(this.email, this.otp);
  ;
});

module.exports = mongoose.model("OTP", OTPSchema);
