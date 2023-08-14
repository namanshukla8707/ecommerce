const express = require("express");
const {
  processPayment,
  sendRazorpayApiKey,
  paymentVerficiation,
} = require("../Controller/paymentroutefunction");
const { isAuthenticatedUser } = require("../middleware/auth");

// Using express router for making routes
const router = express.Router();

// Route 1: Creating first route to "payment of order placed" using POST method and "checkout function" paymentroutefunction
router.route("/checkout").post(isAuthenticatedUser, processPayment);

// Route 2: Creating second route to "send api_key to frontend" using GET method and "sendRazorpayApiKey function" paymentroutefunction
router.route("/razorpayApiKey").get(isAuthenticatedUser, sendRazorpayApiKey);

// Route 3: Creating third route to "verify payment" using POST method and "paymentVerification function" paymentroutefunction
router.route("/verification").post(isAuthenticatedUser, paymentVerficiation);

module.exports = router;
