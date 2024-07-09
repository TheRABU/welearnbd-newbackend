const express = require("express");
const {
  getAllUsers,
  getOneUser,
  deleteUser,
  activateUserAccount,
  registerUser,
} = require("../controllers/userController");
const userRouter = express.Router();

userRouter.route("/").get(getAllUsers);
userRouter.route("/:id").get(getOneUser);
userRouter.route("/:id").delete(deleteUser);
userRouter.route("/register").post(registerUser);
userRouter.route("/verify").post(activateUserAccount);

module.exports = userRouter;
