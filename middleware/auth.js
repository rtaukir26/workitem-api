const JWT = require("jsonwebtoken");
const { ErrorHandler } = require("../utils/helpers");
const isAuthorized = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    if (!token) return ErrorHandler(res, 404, "Invalid Token");
    const decode = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = isAuthorized;
