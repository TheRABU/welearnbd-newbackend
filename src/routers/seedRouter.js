const express = require("express");
const { seedUser, removeUsers } = require("../controllers/seedController");
const seedRouter = express.Router();

seedRouter.route("/").post(seedUser);
seedRouter.route("/").delete(removeUsers);

module.exports = seedRouter;
