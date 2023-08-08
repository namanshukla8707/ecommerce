// All the imports
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Making user model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name cannot be of 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: [true, "This email is in use"],
    validator: [validator.isEmail, "Please enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should be of atleast 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetpasswordtoken: String,
  resetpasswordexpire: Date,
});

// bcryptjs package is required for this function.
// In this function we are hashing the user password so that a hash password is stored in our database not the original one.
userSchema.pre("save", async function (next) {
  // now this is event pre here means before save.
  // we can't use arrow function because in arrow function we can't use "this." property that's why we used async function.

  // If password is changed then we will hash it again else if other fields are updated and this pre function is called just before save then it will convert the saved hash-password which will be not good.
  if (!this.isModified("password")) {
    // password not modified go next
    next();
  }
  // password modified execute this :-
  this.password = await bcrypt.hash(this.password, 10); // 10 here refers to the length of hash-password.
});

// JWT TOKEN -- now we will store auth token in the cookies and to check the login status.
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare password function
userSchema.methods.comparepassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

// Generating Password Reset Token
userSchema.methods.getresetpasswordtoken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetpasswordtoken to userSchema and generating some hash string in resetpasswordtoken of the user model.
  this.resetpasswordtoken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetpasswordexpire = Date.now() + 15 * 60 * 60 * 1000;

  return resetToken;
};

//exporting user model
module.exports = mongoose.model("User", userSchema);
