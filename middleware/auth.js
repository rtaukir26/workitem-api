
const JWT = require("jsonwebtoken");
const { ErrorHandler } = require("../utils/helpers");

const isAuthorized = async (req, res, next) => {
  try {
    // Safely retrieve the token
    const token =
      req.cookies?.token || req.headers.authorization.replace("Bearer ", "");

    // Check if token exists
    if (!token) {
      return ErrorHandler(res, 401, "Access Denied! No token provided.");
    }

    // Verify the token
    const decode = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decode; // Attach decoded user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // if (error.name === "TokenExpiredError") {
    //   return ErrorHandler(res, 401, "Session expired. Please log in again.");
    // }
    return ErrorHandler(res, 403, "Invalid token.");
  }
};

module.exports = isAuthorized;
