const express = require("express");
const {
  newUserSignUpMethod,
  getAllUser,
} = require("../controllers/newUserController");

const newUserRouter = express.Router();

newUserRouter.route("/").post(newUserSignUpMethod);
newUserRouter.route("/getAll").get(getAllUser);

module.exports = newUserRouter;
