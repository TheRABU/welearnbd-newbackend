const express = require("express");

const runValidation = require("../validators");
const { handleLogin, handleLogout } = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const authRouter = express.Router();

authRouter.route("/login").post(isLoggedOut, handleLogin);
authRouter.route("/logout").post(isLoggedIn, handleLogout);

module.exports = authRouter;
