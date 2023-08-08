const ErrorHandler = require("../utils/errorhandler");
module.exports = (error, request, response, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal Server Error";

  // CastError
  if (error.name === "CastError") {
    const message = `Resource not found. Invalid: ${error.path}`;
    error = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }

  // Wrong JWT
  if (error.name === `JsonWebTokenError`) {
    const message = `Json web token is invalid, try again`;
    error = new ErrorHandler(message, 400);
  }

  // JWT Expire error
  if (error.name === `TokenExpiredError`) {
    const message = `Json web token is Expired, try again`;
    error = new ErrorHandler(message, 400);
  }

  response.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};
