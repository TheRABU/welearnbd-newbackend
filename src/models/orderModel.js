const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },

  priceAtPurchase: {
    type: Number,
    required: true,
  },
});

const Order = ("Orders", orderSchema);

module.exports = Order;
