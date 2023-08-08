// All the imports
const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../Controller/productroutefunction");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Using express router for making routes
const router = express.Router();

// Route 1: Creating first route to "get all the products" using GET method and "getAllProduct function" from productroutefunction
router.route("/fetchallproducts").get(getAllProducts);

// Route 2: Creating second route to "authenticate the user is he/she is logged-in or not, very the role of user if he is admin then only he can go next, create a product" using POST method and "createProduct function" from productroutefunction -- Admin
router
  .route("/admin/createproduct")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

// Route 3: Creating third route to "authenticate the user is he/she is logged-in or not,  very the role of user if he is admin then only he can go next, update a product" using PUT method and "updateProduct function" from productroutefunction -- Admin
router
  .route("/admin/updateproduct/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

// Route 4: Creating fourth route to "authenticate the user is he/she is logged-in or not,  very the role of user if he is admin then only he can go next, delete a product" using DELETE method and "deleteProduct function" from productroutefunction -- Admin
router
  .route("/admin/deleteproduct/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// Route 5: Creating fifth route to "get a product detail" using GET method and "getProductDetail function" from productroutefunction
router.route("/getproductdetail/:id").get(getProductDetail);

// Route 6: Creating sixth route to "create or update product review" using PUT method and "createProductReview function" from productroutefunction
router
  .route("/createproductreview/")
  .put(isAuthenticatedUser, createProductReview);

// Route 7: Creating seventh route to "get all the reviews of the product" using GET method and "getProductReviews function" from productroutefunction
router.route("/getproductreviews/").get(getProductReviews);

// Route 8: Creating eight route to "delete a product review" using DELETE method and "deleteReview function" from productroutefunction
router.route("/deletereview/").delete(isAuthenticatedUser, deleteReview);

module.exports = router;
