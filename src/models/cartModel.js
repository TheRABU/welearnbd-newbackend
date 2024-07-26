const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItemId: {
      type: String,
      ref: "Course",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
    },
    teacherName: {
      type: String,
    },
    courseName: {
      type: String,
    },
    courseImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
