// All the imports
const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getSingleUser,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require("../Controller/userroutefunction");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Using express router for making routes
const router = express.Router();

// Route 1: Creating first route to "create a user or register a user" using POST method and "registerUser function" from userroutefunction
router.route("/createuser").post(registerUser);

// Route 2: Creating second route to "login a user" using POST method and "loginUser function" from userroutefunction
router.route("/loginuser").post(loginUser);

// Route 3: Creating third route to "logout a user" using GET method and "loginUser function" from userroutefunction
router.route("/logoutuser").get(logoutUser);

// Route 4: Creating fourth route to "forgot password" using POST method and "forgotPassword function" from userroutefunction
router.route("/forgotpassword").post(forgotPassword);

// Route 5: Creating fifth route to "reset password" using PUT method and "resetPassword function" from userroutefunction
router.route("/resetpassword/:token").put(resetPassword);

// Route 6: Creating sixth route to "get user details" using GET method and "getUserDetails function" from userroutefunction
router.route("/getuserdetails").get(isAuthenticatedUser, getUserDetails);

// Route 7: Creating seventh route to "update user password" using PUT method and "updatePassword function" from userroutefunction
router.route("/updatepassword").put(isAuthenticatedUser, updatePassword);

// Route 8: Creating eight route to "update user profile" using PUT method and "updateProfile function" from userroutefunction
router.route("/updateprofile").put(isAuthenticatedUser, updateProfile);

// Route 9: Creating ninth route to "get all users profile and only admin can access it" using GET method and "getAllUsers function" from userroutefunction
router.route("/admin/getallusers").get(isAuthenticatedUser,authorizeRoles("admin"), getAllUsers);

// Route 10: Creating tenth route to "get single user profile and only admin can access it" using GET method and "getSingleUser function" from userroutefunction
router.route("/admin/getsingleuser/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);

// Route 11: Creating eleventh route to "update user role by admin" using PUT method and "updateUserRole function" from userroutefunction
router.route("/admin/updateuserrole/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);

// Route 12: Creating eleventh route to "delete a user by admin" using DELETE method and "deleteUser function" from userroutefunction
router.route("/admin/deleteuser/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
