const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
    index: true
  },
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  images: [
    {
      // public_id: {
      //   type: String,
      //   required: true,
      // },
      url: {
        type: String,
        //required: true,
      },
    },
  ],
  ratings: {
    type: Number,
    default: 0,
  },

  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  Stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  numOfReviews: {
    type: Number
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: {
        type: String
      },
      rating: {
        type:  Number
      },
      comment: {
        type: String
      },
    },
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);