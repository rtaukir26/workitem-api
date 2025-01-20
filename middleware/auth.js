const JWT = require("jsonwebtoken");
const { ErrorHandler } = require("../utils/helpers");

const isAuthorized = async (req, res, next) => {
  try {
    // Safely retrieve the token
    const token =
      req.cookies?.token || req.headers.authorization.replace("Bearer ", "");
    // const token = req.cookies?.token;

    // console.log("token", token);
    // Check if token exists
    if (!token) {
      return ErrorHandler(res, 401, "Access Denied! No token provided.");
    }

    // Verify the token
    const decode = JWT.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("token decode", decode);

    // Check if the token is expired
    // const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    // console.log("token currentTime", currentTime);

    // if (decode.exp && decode.exp < currentTime) {
    //   return ErrorHandler(res, 401, "Session expired. Please log in again.");
    // }

    req.user = decode; // Attach decoded user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return ErrorHandler(res, 401, "Session expired. Please log in again.");
    }
    return ErrorHandler(res, 403, "Invalid token.");
  }
};

module.exports = isAuthorized;
