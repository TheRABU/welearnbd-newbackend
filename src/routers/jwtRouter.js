const express = require("express");
const { generateJwtToken } = require("../controllers/newJwtController");

const jwtRouter = express.Router();

jwtRouter.route("/generateToken").post(generateJwtToken);

module.exports = jwtRouter;
