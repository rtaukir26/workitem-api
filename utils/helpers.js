
exports.ErrorHandler = async (res, statusCode, msg) => {
  return res.status(statusCode).json({
    success: false,
    message: msg,
  });
};
