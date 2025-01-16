const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { ErrorHandler } = require("../utils/helpers");

//Register - POST
exports.register = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;
    console.log("body", req.body);

    if (!email) {
      return ErrorHandler(res, 404, "email is required!");
      //   return res.status(404).json({
      //     success: false,
      //     message: "email is required",
      //   });
    }
    if (!password) return ErrorHandler(res, 404, "password is required!"); //Note:- Write "return" to avoid server crush

    if (!confirm_password)
      return ErrorHandler(res, 404, "confirm_password is required!");

    const existUser = await User.findOne({ email });
    if (existUser) return ErrorHandler(res, 400, "user already exist!");

    const hasPwd = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hasPwd,
      confirm_password: hasPwd,
    });

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      // expiresIn: 5 * 60 * 1000,
      expiresIn: "1h",
    });
    // const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

    // const { password,confirm_password, ...rest } = user;//"password and confirm_password" will not show. for now getting error, dont use this"
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true, //can access only backend not front end
        // expires: new Date(Date.now() + 1 * 1000),
        maxAge: 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "user registered successfully",
        user: { email: user.email, token },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//user login - POST
exports.userLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return ErrorHandler(res, 404, "Invalid email or password.");
    let isPwdMatch = await bcrypt.compare(password, user.password);

    if (!isPwdMatch)
      return ErrorHandler(res, 404, "Invalid email or password.");

    let token = JWT.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true, //can access only backend not front end
        // expires: new Date(Date.now() + 60 * 1000),
        maxAge: 60 * 60 * 1000, //15mins
        // secure: true, // Uncomment when using HTTPS
        // sameSite: 'strict', // Adjust as needed
      })
      .json({
        success: true,
        message: "user logged-in successfully",
        user: { email: user.email, token },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//user details - GET
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    // .select(
    //   "-password-confirm_password"
    // );
    if (!user) return ErrorHandler(res, 404, "User not found.");

    res.status(200).json({
      success: true,
      message: "user info retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//user logout - GET
exports.userLogout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token", {
        httpOnly: true, // Ensure it's only accessible by the web server
        secure: process.env.NODE_ENV === "production" ? true : false, // Send only over HTTPS in production
        sameSite: "strict", // Adjust as needed
      })
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
