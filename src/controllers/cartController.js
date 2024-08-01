const createError = require("http-errors");
const Cart = require("../models/cartModel.js");
const { successResponse } = require("./responseController.js");

const addToCart = async (req, res, next) => {
  try {
    const {
      cartItemId,
      price,
      courseName,
      courseImage,
      teacherName,
      level,
      email,
    } = req.body;
    // Check if all required fields are present
    if (!cartItemId || !price || !email) {
      throw createError(
        400,
        "cartItemId, price, and email are required fields."
      );
    }
    // Validate price
    if (price < 0) {
      throw createError(401, "Price is invalid");
    }
    const checkIfExist = await Cart.findById({ _id: cartItemId });
    if (checkIfExist) {
      res
        .status(400)
        .json({ message: "You already have that item in your cart" });
    }
    // Create new cart item
    const newCartItem = new Cart({
      cartItemId,
      price,
      courseName,
      courseImage,
      teacherName,
      level,
      email,
    });
    // Save the cart item to the database
    const savedItemToCart = await newCartItem.save();
    return successResponse(res, {
      statusCode: 200,
      message: "Item added to cart",
      payload: savedItemToCart,
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.status || 500).json({ message: error.message });
    next(error);
  }
};

const getAllCartItems = async (req, res, next) => {
  try {
    const email = req.query.email;
    const query = { email: email };
    const findCartItems = await Cart.find(query);
    res.status(200).send(findCartItems);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const deleteCartItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedItem = await Cart.findOneAndDelete({ _id: id });
    res.status(200).send(deletedItem);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = { addToCart, getAllCartItems, deleteCartItem };
