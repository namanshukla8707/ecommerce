//All the imports
const errorasync = require("../middleware/asyncerror");
const ErrorHandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../Models/usermodel");

// this function is to check that user is authenticated or not.
exports.isAuthenticatedUser = errorasync(async (request, response, next) => {
  const { token } = request.cookies; // we extract token which is stored in cookie.

  // check if token obtained or not
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  // verifying the token and JWT_SECRET
  const decodeddata = jwt.verify(token, process.env.JWT_SECRET);

  // Extracting user info from decodeddata.id and accessing user data from request anytime if user is logged-in.
  request.user = await User.findById(decodeddata.id);

  next();
});
exports.authorizeRoles = (...roles) => {
  return (request, response, next) => {
    // checking if there is request.user.role is present in roles array which is "admin"
    if (!roles.includes(request.user.role)) {
      // check if admin role given as parameter and user role from request.user.role is not
      return next(new ErrorHandler(
        `Role: ${request.user.role} is not allowed to access this resource`,
        403
      ));
    }
    next();
  };
};
