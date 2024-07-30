const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51PgLlLRp1Brjf92SCecEtJLZrjeX8HGSlPufV91cCprzwmYydgKC32Kz5PxeUHEFnm1xmYIWkLuGRKYlpipSSjUw0028wOFBlZ"
);

const createError = require("http-errors");
const Payment = require("../models/paymentModel");
const Cart = require("../models/cartModel");
const mongoose = require("mongoose");
require("dotenv").config();

// create payment intent
const createPayment = async (req, res, next) => {
  try {
    const { price } = req.body;
    const amount = parseInt(price * 100);
    if (amount <= 0.5) {
      return next(createError(400, "Minimum amount must be at least $0.5 usd"));
    }

    if (!stripe) {
      return console.log("Stripe banaite partasina boss");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    if (!paymentIntent) {
      console.log("Could not create payment intent");
      return next(createError(500, "Payment intent creation failed"));
    }

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("The error is at catch block", error.message);
    next(error);
  }
};

// save data
const savePaymentData = async (req, res) => {
  try {
    const payment = req.body;

    const paymentResult = await Payment.create({ ...payment });
    // carefully delete each item
    const query = {
      _id: {
        $in: payment.cartIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    };
    const deleteResult = await Cart.deleteMany(query);

    res.status(200).json({
      message: "Payment saved and cart items deleted successfully",
      paymentResult,
      deleteResult,
    });
  } catch (error) {
    console.log(error.message);
    throw new error();
  }
};

const getMyPaymentHistory = async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };
    if (req.params.email !== req.decoded.email) {
      return res
        .status(403)
        .send({ message: "forbidden access ja vaag shala!" });
    }
    const findMyPayment = await Payment.find(query);
    res.status(200).send(findMyPayment);
  } catch (error) {
    console.log(error.message);
    throw createError(404, "Could not find history sorry for that!");
  }
};

module.exports = { createPayment, savePaymentData, getMyPaymentHistory };
