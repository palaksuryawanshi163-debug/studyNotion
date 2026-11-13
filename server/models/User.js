const mongoose = require("mongoose");
const { resetPasswordToken } = require("../controllers/ResetPassword");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
    enum: ["Admin", "Student", "Instructor"],
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  image: {
    type: String,
    required: true,
  },
  courseProgress: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CourseProgress" },
  ],
  token:{
    type:String,
  },
  resetPasswordExpires:{
    type:Date,
  }
});

module.exports = mongoose.model("User", userSchema);
