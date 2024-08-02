const express = require("express");
const { getAdminStats } = require("../controllers/adminController");
const verifyToken = require("../middlewares/verifyTokens");
const { verifyIsAdmin } = require("../middlewares/isAdminMiddleware");

const adminRouter = express.Router();

adminRouter.route("/showStats").get(verifyToken, verifyIsAdmin, getAdminStats);

module.exports = adminRouter;
