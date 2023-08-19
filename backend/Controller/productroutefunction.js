// All the imports
const Product = require("../Models/productmodel");
const ErrorHandler = require("../utils/errorhandler");
const errorasync = require("../middleware/asyncerror");
const Features = require("../utils/features");
const cloudinary = require("cloudinary");

// Create product function -- Admin
exports.createProduct = errorasync(async (request, response, next) => {
  let images = [];
  if (typeof request.body.images === "string") {
    images.push(request.body.images);
  } else {
    images = request.body.images;
  }
  const imagesLink = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  request.body.images = imagesLink;
  request.body.user = request.user.id;

  const product = await Product.create(request.body);
  response.status(201).json({
    success: true,
    product,
  });
});

// Get all the products function
exports.getAllProducts = errorasync(async (request, response, next) => {
  const resultperpage = 12;
  const productcount = await Product.countDocuments();
  // For sending search query.
  const features = new Features(Product.find(), request.query)
    .search()
    .filter();

  let products = await features.query;
  let filteredProductsCount = products.length;
  features.pagination(resultperpage);
  // features class is returning query that's we used it as again n again Product.find() function is very messy.
  // products = await features.query;
  response.status(200).json({
    success: true,
    products,
    productcount,
    resultperpage,
    filteredProductsCount,
  });
});

// Get all the products function -- Admin
exports.getAdminProducts = errorasync(async (request, response, next) => {
  const resultperpage = 12;
  const productcount = await Product.countDocuments();
  // For sending search query.
  const features = new Features(Product.find(), request.query)
    .search()
    .filter();

  let products = await features.query;
  let filteredProductsCount = products.length;
  features.pagination(resultperpage);
  // features class is returning query that's we used it as again n again Product.find() function is very messy.
  // products = await features.query;
  response.status(200).json({
    success: true,
    products,
    productcount,
    resultperpage,
    filteredProductsCount,
  });
});

//Update the product function -- Admin
exports.updateProduct = errorasync(async (request, response, next) => {
  let product = await Product.findById(request.params.id);
  const productcount = await Product.countDocuments();
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // adding images to cloudinary
  let images = [];
  if (typeof request.body.images === "string") {
    images.push(request.body.images);
  } else {
    images = request.body.images;
  }

  if (images !== undefined) {
    // Deleting all the images from cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    request.body.images = imagesLink;
  }

  product = await Product.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  response.status(200).json({ success: true, product, productcount });
});

// Delete a product function -- Admin
exports.deleteProduct = errorasync(async (request, response, next) => {
  let product = await Product.findById(request.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // Deleting all the images from cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }
  await Product.findByIdAndDelete(request.params.id);
  response
    .status(200)
    .json({ success: true, message: "Product deleted Successfully" });
});

// Get a product detail function
exports.getProductDetail = errorasync(async (request, response, next) => {
  const product = await Product.findById(request.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  response.status(200).json({ success: true, product });
});

// Create new review or update the review
exports.createProductReview = errorasync(async (request, response, next) => {
  const { rating, comment, productId } = request.body;
  // console.log(request.user.id); => 64c0d035a8ef1d1945d603d1
  // console.log(request.user._id); => new ObjectId("64c0d035a8ef1d1945d603d1")
  const review = {
    user: request.user._id,
    name: request.user.name,
    rating: Number(rating),
    comment,
  };

  // Finding product by it's ID.
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === request.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === request.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.rating = product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.rating = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  response.status(200).json({ success: true, review });
});

// Get all reviews of a product
exports.getProductReviews = errorasync(async (request, response, next) => {
  // Finding product by it's ID.
  const product = await Product.findById(request.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  response.status(200).json({ success: true, reviews: product.reviews });
});

// Delete a review
exports.deleteReview = errorasync(async (request, response, next) => {
  // Finding product by it's ID.
  const product = await Product.findById(request.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== request.query.id.toString()
  );

  // Checking is the loggin-user is deleting the review which he has done or not.
  const candelete = product.reviews.find(
    (rev) => rev.user.toString() === request.user.id.toString()
  );

  // Allowing admin to delete anyone's review
  if (!candelete && request.user.role !== "admin") {
    return next(
      new ErrorHandler(
        "The review which you are trying to delete is not created by you.",
        400
      )
    );
  }

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let rating = 0;

  if (reviews.length !== 0) {
    rating = avg / reviews.length;
  }

  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    request.query.productId,
    {
      reviews,
      rating,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      userFindAndModify: true,
    }
  );
  response.status(200).json({ success: true });
});
