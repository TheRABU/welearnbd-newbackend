const express = require("express");

const runValidation = require("../validators");
const { handleLogin, handleLogout } = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const { validateUserLogin } = require("../validators/auth");
const authRouter = express.Router();

authRouter
  .route("/login")
  .post(validateUserLogin, runValidation, isLoggedOut, handleLogin);
authRouter.route("/logout").post(isLoggedIn, handleLogout);

module.exports = authRouter;
