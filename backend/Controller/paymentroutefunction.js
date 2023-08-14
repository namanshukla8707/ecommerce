// All the imports
const ErrorHandler = require("../utils/errorhandler");
const errorasync = require("../middleware/asyncerror");
const { instance } = require("../index");
const CryptoJS = require("crypto-js");
const Order = require("../Models/ordermodel");

// checkout payment
exports.processPayment = errorasync(async (request, response) => {
  const amount = Number(request.body.amount * 100);
  const user = request.body.user;
  const options = {
    amount: Number(request.body.amount * 100),
    currency: "INR",
    receipt: "order_rcptid_11",
  };

  const order = await instance.orders.create(options);
  response.status(200).json({
    success: true,
    order,
    amount,
    user,
  });
});

// sending api_key
exports.sendRazorpayApiKey = errorasync(async (request, response) => {
  response
    .status(200)
    .json({ success: true, razorpayApiKey: process.env.RAZORPAY_API_KEY });
});

exports.paymentVerficiation = errorasync(async (request, response, next) => {
  const generated_signature = CryptoJS.HmacSHA256(
    request.body.razorpay_order_id + "|" + request.body.razorpay_payment_id,
    process.env.RAZORPAY_API_SECRET
  );
  if (generated_signature == request.body.razorpay_signature) {
    const paymentInfoUpdate = {
      status: "Paid",
      id: request.body.razorpay_payment_id,
    };
    let order = await Order.findOneAndUpdate(
      { razorpay_order_id: request.body.razorpay_order_id },
      {
        paymentInfo: paymentInfoUpdate,
      }
    );
    response.redirect(`http://localhost:3000/paymentCompleted?reference=${request.body.razorpay_payment_id}`);
  } else {
    const paymentInfoUpdate = {
      status: "Pending",
      id: request.body.razorpay_payment_id,
    };
    let order = await Order.findOneAndUpdate(
      { razorpay_order_id: request.body.razorpay_order_id },
      {
        paymentInfo: paymentInfoUpdate,
      }
    );
    response.status(200).json({ success: false });
  }
});
