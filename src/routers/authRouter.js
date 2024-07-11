const express = require("express");

const runValidation = require("../validators");
const { handleLogin } = require("../controllers/authController");
const authRouter = express.Router();

authRouter.route("/login").post(handleLogin);

module.exports = authRouter;
