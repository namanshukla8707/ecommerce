// All the imports
const Order = require("../Models/ordermodel");
const Product = require("../Models/productmodel");
const ErrorHandler = require("../utils/errorhandler");
const errorasync = require("../middleware/asyncerror");
const Features = require("../utils/features");

// Create new order
exports.newOrder = errorasync(async (request, response, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    razorpay_order_id,
  } = request.body;

  const order = await Order.create({
    razorpay_order_id,
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: request.user._id,
  });

  response.status(200).json({ succes: true, order: order });
});

// Get single order
exports.getSingleOrder = errorasync(async (request, response, next) => {
  // this will give all the order details but also search the user with the id in user database and also provide it's name and email
  const order = await Order.findById(request.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  response.status(200).json({
    success: true,
    order,
  });
});

// Get logged-in users order
exports.myOrders = errorasync(async (request, response, next) => {
  const orders = await Order.find({ user: request.user._id });

  response.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders -- Admin
exports.getAllOrders = errorasync(async (request, response, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  response.status(200).json({ success: true, orders, totalAmount });
});

// Update order status -- Admin
exports.updateOrderStatus = errorasync(async (request, response, next) => {
  const order = await Order.findById(request.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Your Order have been delivered", 400));
  }

  if (request.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }

  order.orderStatus = request.body.status;

  if (request.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  response.status(200).json({ success: true });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// delete order -- Admin
exports.deleteOrder = errorasync(async (request, response, next) => {
  const order = await Order.findById(request.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  await order.deleteOne();

  response.status(200).json({ success: true });
});
