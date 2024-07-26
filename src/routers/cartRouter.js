const express = require("express");
const {
  addToCart,
  getAllCartItems,
  deleteCartItem,
} = require("../controllers/cartController");

const cartRouter = express.Router();

cartRouter.route("/").post(addToCart);
cartRouter.route("/").get(getAllCartItems);
cartRouter.route("/:id").delete(deleteCartItem);

module.exports = cartRouter;
