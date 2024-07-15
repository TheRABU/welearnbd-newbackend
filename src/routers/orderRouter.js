const express = require("express");
const { placeOrder } = require("../controllers/orderController");

const orderRoutes = express.Router();

orderRoutes.route("/").post(placeOrder);

module.exports = orderRoutes;
