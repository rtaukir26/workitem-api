const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { ErrorHandler } = require("../utils/helpers");

exports.register = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    if (!email) {
      return ErrorHandler(res, 404, "email is required!");
      //   return res.status(404).json({
      //     success: false,
      //     message: "email is required",
      //   });
    }
    if (!password) {
      return ErrorHandler(res, 400, "password is required!");
    }
    if (!confirm_password) {
      return ErrorHandler(res, 400, "confirm_password is required!");
    }
    const existUser = await User.findOne({ email });
    if (existUser) return ErrorHandler(res, 400, "user already exist!");

    const hasPwd = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hasPwd,
      confirm_password: hasPwd,
    });

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 1 * 1000,
    });
    console.log("token", token);

    // const { password,confirm_password, ...rest } = user;//"password and confirm_password will not show. for now getting error, dont use this"
    res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: { email: user.email, token },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
