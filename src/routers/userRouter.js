const express = require("express");
const {
  getAllUsers,
  getOneUser,
  deleteUser,
  activateUserAccount,
  registerUser,
  updateUserAccount,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadFile");
const { validateUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");
const userRouter = express.Router();
// /api/v1/users
userRouter.route("/").get(isLoggedIn, getAllUsers);
userRouter.route("/:id").get(isLoggedIn, getOneUser);
userRouter.route("/:id").delete(isLoggedIn, deleteUser);
userRouter
  .route("/register")
  .post(
    upload.single("image"),
    isLoggedOut,
    validateUserRegistration,
    runValidation,
    registerUser
  );
userRouter.route("/verify").post(isLoggedOut, activateUserAccount);
userRouter
  .route("/update/:id")
  .put(upload.single("image"), isLoggedIn, updateUserAccount);

module.exports = userRouter;
