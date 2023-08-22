// All the imports
const User = require("../Models/usermodel");
const ErrorHandler = require("../utils/errorhandler");
const errorasync = require("../middleware/asyncerror");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendemail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a user function
exports.registerUser = errorasync(async (request, response, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(request.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = request.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  sendToken(user, 201, response);
});

// Login user function
exports.loginUser = errorasync(async (request, response, next) => {
  const { email, password } = request.body;

  // checking if user has given password & email both.
  if (!email) {
    return next(new ErrorHandler("Please enter email", 400));
  } else if (!password) {
    return next(new ErrorHandler("Please enter password", 400));
  }
  // Find the user with email and password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const ispasswordmatched = await user.comparepassword(password);

  if (!ispasswordmatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, response);
});

// Logout a user function
exports.logoutUser = errorasync(async (request, response, next) => {
  response.cookie("token", null, {
    maxAge: 0,
    httpOnly: true,
  });
  response
    .status(200)
    .json({ success: true, message: "Logged Out Successfully" });
});

// Forgot password function
exports.forgotPassword = errorasync(async (request, response, next) => {
  // finding the user through email
  const user = await User.findOne({ email: request.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getresetpasswordtoken();

  // saving the resetpasswordtoken when this function is called.
  await user.save({ validateBeforeSave: false });

  // Generating the reset link.
  const resetPasswordUrl = `${request.protocol}://${request.get(
    "host"
  )}/password/reset/${resetToken}`;

  // Message in the mail
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce password recovery`,
      message,
    });
    response.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetpasswordexpire = undefined;
    user.resetpasswordtoken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password
exports.resetPassword = errorasync(async (request, response, next) => {
  // extracting token from request.params.token and then converting it into hash
  const resetpasswordtoken = crypto
    .createHash("sha256")
    .update(request.params.token)
    .digest("hex");

  // Now we will find above hash token in our database as we have stored it in hash.
  const user = await User.findOne({
    resetpasswordtoken,
    resetpasswordexpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400
      )
    );
  }

  if (request.body.password !== request.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 400));
  }

  user.password = request.body.password;
  user.resetpasswordexpire = undefined;
  user.resetpasswordtoken = undefined;
  await user.save();
  sendToken(user, 200, response);
});

// Get user detail -- Login required
exports.getUserDetails = errorasync(async (request, response, next) => {
  const user = await User.findById(request.user.id);
  response.status(200).json({ succes: true, user });
});

// Update user password -- Login required
exports.updatePassword = errorasync(async (request, response, next) => {
  const user = await User.findById(request.user.id).select("+password"); // adding password also to user info.

  const ispasswordmatched = await user.comparepassword(
    request.body.oldPassword
  );
  if (!ispasswordmatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (request.body.newPassword !== request.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = request.body.newPassword;

  await user.save();

  sendToken(user, 200, response);
});

// Update user profile
exports.updateProfile = errorasync(async (request, response, next) => {
  const newuserdata = {
    name: request.body.name,
    email: request.body.email,
  };
  if (request.body.avatar !== "") {
    const user = await User.findById(request.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(request.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    newuserdata.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  if (!newuserdata.email) {
    return next(new ErrorHandler("Please enter your email", 401));
  }
  if (!newuserdata.name) {
    return next(new ErrorHandler("Please enter your name", 401));
  }
  const user = await User.findByIdAndUpdate(request.user.id, newuserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  response.status(200).json({ success: true });
});

// Get all user -- admin
exports.getAllUsers = errorasync(async (request, response, next) => {
  const users = await User.find();
  response.status(200).json({ succes: true, users });
});

// Get single user -- admin
exports.getSingleUser = errorasync(async (request, response, next) => {
  const user = await User.findById(request.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exists with Id: ${request.param.id}`)
    );
  }
  response.status(200).json({ succes: true, user });
});

// Update user role -- Admin
exports.updateUserRole = errorasync(async (request, response, next) => {
  const newuserdata = {
    name: request.body.name,
    email: request.body.email,
    role: request.body.role,
  };
  if (!newuserdata.email) {
    return next(new ErrorHandler("Please enter your email", 401));
  }
  if (!newuserdata.role) {
    return next(new ErrorHandler("Please enter user role", 401));
  }
  if (!newuserdata.name) {
    return next(new ErrorHandler("Please enter your name", 401));
  }
  const user = await User.findByIdAndUpdate(request.params.id, newuserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if (!user) {
    return next(
      new ErrorHandler(
        `User does not exists with Id: ${request.params.id}`,
        404
      )
    );
  }
  response.status(200).json({
    success: true,
    message: `Role updated successfully as ${request.body.role}`,
  });
});

// Delete a User -- Admin
exports.deleteUser = errorasync(async (request, response, next) => {
  const user = await User.findById(request.params.id);

  if (!user) {
    return next(
      new ErrorHandler(
        `User does not exists with Id: ${request.params.id}`,
        404
      )
    );
  }

  // removing user avatar from cloudinary
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  await user.deleteOne();
  response
    .status(200)
    .json({ success: true, message: "User deleted Successfully" });
});
