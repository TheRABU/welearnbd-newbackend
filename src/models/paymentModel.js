const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    cartIds: {
      type: [String],
      ref: "Cart",
    },
    cartItemIds: {
      type: [String],
      ref: "Cart",
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
