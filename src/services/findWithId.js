const User = require("../models/userModel");
const createError = require("http-errors");
const mongoose = require("mongoose");
const findWithId = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);
    if (!item) {
      throw createError(404, `${Model.modelName} does not exist!`);
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Invalid id");
    }
    throw error;
  }
};

module.exports = { findWithId };
