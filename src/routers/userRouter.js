const express = require("express");
const {
  getAllUsers,
  getOneUser,
  deleteUser,
  activateUserAccount,
  registerUser,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadFile");
const userRouter = express.Router();
// /api/v1/users
userRouter.route("/").get(getAllUsers);
userRouter.route("/:id").get(getOneUser);
userRouter.route("/:id").delete(deleteUser);
userRouter.route("/register").post(upload.single("image"), registerUser);
userRouter.route("/verify").post(activateUserAccount);

module.exports = userRouter;
