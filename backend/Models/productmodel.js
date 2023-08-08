// All the imports
const mongoose = require("mongoose");

// Making product model
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter Product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter Product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [4, "stock cannot exceed 4 characters"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        default: 0,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//exporting product model
module.exports = mongoose.model("Product", productSchema);
