const express = require("express");
const {
  getAllUsers,
  getOneUser,
  deleteUser,
  activateUserAccount,
  registerUser,
  updateUserAccount,

  manageUserStatus,
  updatePassword,
} = require("../controllers/userController");
const uploadUserImage = require("../middlewares/uploadFile");
const { validateUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const userRouter = express.Router();
// /api/v1/users
userRouter.route("/").get(isLoggedIn, getAllUsers);
userRouter.route("/:id").get(isLoggedIn, getOneUser);
userRouter.route("/:id").delete(isLoggedIn, deleteUser);
userRouter
  .route("/register")
  .post(
    uploadUserImage.single("image"),
    isLoggedOut,
    validateUserRegistration,
    runValidation,
    registerUser
  );
userRouter.route("/verify").post(isLoggedOut, activateUserAccount);
userRouter
  .route("/update/:id")
  .put(uploadUserImage.single("image"), isLoggedIn, updateUserAccount);

userRouter.route("/status/:id").put(isLoggedIn, isAdmin, manageUserStatus);
userRouter.route("/update-pass/:id").put(isLoggedIn, updatePassword);

module.exports = userRouter;
