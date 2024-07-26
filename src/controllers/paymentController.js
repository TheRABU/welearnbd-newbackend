const stripe = require("stripe")(process.env.STRIPE_CLIENT_SECRET);
const createError = require("http-errors");
const Payment = require("../models/paymentModel");
const Cart = require("../models/cartModel");
const { default: mongoose } = require("mongoose");
const { successResponse } = require("./responseController");
const createPayment = async (req, res) => {
  try {
    const { price } = req.body;
    const amount = parseInt(price * 100);
    if (amount <= 0.5) {
      return createError(400, "Minimum amount must be at least $0.5 usd");
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error.message);
    throw new error();
  }
};

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
    // if (req.params.email !== req.decoded.email) {
    //   return res
    //     .status(403)
    //     .send({ message: "forbidden access ja vaag shala!" });
    // }
    const findMyPayment = await Payment.find(query);
    res.status(200).send(findMyPayment);
  } catch (error) {
    console.log(error.message);
    throw createError(404, "Could not find history sorry for that!");
  }
};

module.exports = { createPayment, savePaymentData, getMyPaymentHistory };
