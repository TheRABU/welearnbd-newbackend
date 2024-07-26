const express = require("express");
const {
  createPayment,
  savePaymentData,
  getMyPaymentHistory,
} = require("../controllers/paymentController");

const paymentRouter = express.Router();

paymentRouter.route("/create-intent").post(createPayment);
paymentRouter.route("/save-payment").post(savePaymentData);
paymentRouter.route("/my-history/:email").get(getMyPaymentHistory);

module.exports = paymentRouter;
