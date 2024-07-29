const createError = require("http-errors");
const { successResponse } = require("./responseController.js");
const newUser = require("../models/newUserModel.js");
// new method to signup user
const newUserSignUpMethod = async (req, res, next) => {
  try {
    const userInfo = req.body;
    const { email } = userInfo;

    const isAlreadyExist = await newUser.findOne({ email: email });
    if (isAlreadyExist) {
      return res.status(400).json({
        message: "User already exists, no need to signup just login",
      });
    }

    const createNewUser = await newUser.create({ ...userInfo });

    return successResponse(res, {
      statusCode: 200,
      message: "User registered successfully",
      payload: createNewUser,
    });
  } catch (error) {
    console.error(
      "Error during creating user using new controller:",
      error.message
    );
    next(error);
  }
};

// make admin controller
const makeUserAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Check if user exists
    const checkIfUserExist = await newUser.findById(id);
    if (!checkIfUserExist) {
      return res.status(400).json({
        message: "User does not exist in Database!",
      });
    }

    // Update user role to admin
    const updatedUser = await newUser.findByIdAndUpdate(
      id,
      { $set: { role: "admin" } },
      { new: true } // This returns the updated document
    );

    return res.status(200).json({
      message: "User role updated to admin successfully!",
      payload: updatedUser,
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const getAll = await newUser.find({});

    return successResponse(res, {
      statusCode: 200,
      message: "Fetched All user",
      payload: getAll,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const deleteSingleUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const checkUser = await newUser.findById({ _id: id });
    if (!checkUser) {
      throw new createError(400, "User not found");
    }
    const deletedUser = await newUser.findByIdAndDelete({ _id: id });
    return successResponse(res, {
      statusCode: 200,
      message: "Deleted Successfully",
      payload: deletedUser,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const checkIfUserIsAdmin = async (req, res, next) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is missing" });
    }
    if (email !== req.decoded.email) {
      return res.status(403).send({ message: "forbidden access" });
    }
    const user = await newUser.findOne({ email: email });

    if (user && user.role === "admin") {
      return res.status(200).json({ admin: true });
    } else {
      return res.status(200).json({ admin: false });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = {
  newUserSignUpMethod,
  getAllUser,
  deleteSingleUser,
  makeUserAdmin,
  checkIfUserIsAdmin,
};
