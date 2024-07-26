const express = require("express");
const { createPayment } = require("../controllers/paymentController");

const paymentRouter = express.Router();

paymentRouter.route("/create-intent").post(createPayment);

module.exports = paymentRouter;
