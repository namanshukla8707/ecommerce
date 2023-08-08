// All the imports
const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../Controller/orderroutefunction");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Using express router for making routes
const router = express.Router();

// Route 1: Creating first route to "create new order" using POST method and "newOrder function" from orderroutefunction
router.route("/neworder").post(isAuthenticatedUser, newOrder);

// Route 2: Creating second route to "get single order" using GET method and "getSingleOrder function" from orderroutefunction
router.route("/getsingleorder/:id").get(isAuthenticatedUser, getSingleOrder);

// Route 3: Creating third route to "to get users order" using GET method and "myOrders function" from orderroutefunction
router.route("/myorders").get(isAuthenticatedUser, myOrders);

// Route 4: Creating fourth route to "to get all orders" using GET method and "getAllOrders function" from orderroutefunction
router
  .route("/getallorders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

// Route 5: Creating fifth route to "update order status" using PUT method and "updateOrderStatus function" from orderroutefunction
router
  .route("/updateorderstatus/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus);

// Route 6: Creating third route to "delete order" using DELETE method and "deleteOrder function" from orderroutefunction
router
  .route("/deleteorder/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
