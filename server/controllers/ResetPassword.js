const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email
    const email = req.body.email;

    //check user /validation for eamil
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "Your Email is not registered with us ",
      });
    }

    //generate  token
    const token = crypto.randomUUID();

    //update user by adding token and expiring time
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true },
    );

    //create URL
    const url = `http://localhost:3000/update-password/${token}`;

    //send mail
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset link : ${url}`,
    );

    //return response
    return res.json({
      success: true,
      message: "Email sent successfully,pleasecheck email and change password ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reset password",
    });
  }
};

//resetPassword

exports.resetPassword = async (req, res) => {
  try {
    // fetch data
    const { password, confirmPassword, token } = req.body;

    //validation
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password not matching",
      });
    }

    //get user details
    const userDetails = await User.findOne({ token: token });

    //if no entry (invalid token)
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Invalid token ",
      });
    }

    //token expire
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Token is expired",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //update password
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true },
    );

    //return res
    return res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
