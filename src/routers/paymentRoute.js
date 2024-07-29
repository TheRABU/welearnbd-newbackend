const express = require("express");
const {
  createPayment,
  savePaymentData,
  getMyPaymentHistory,
} = require("../controllers/paymentController");
const verifyToken = require("../middlewares/verifyTokens");

const paymentRouter = express.Router();

paymentRouter.route("/create-intent").post(createPayment);
paymentRouter.route("/save-payment").post(savePaymentData);
paymentRouter.route("/my-history/:email").get(verifyToken, getMyPaymentHistory);

module.exports = paymentRouter;
