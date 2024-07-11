const express = require("express");

const runValidation = require("../validators");
const { handleLogin, handleLogout } = require("../controllers/authController");
const authRouter = express.Router();

authRouter.route("/login").post(handleLogin);
authRouter.route("/logout").post(handleLogout);

module.exports = authRouter;
