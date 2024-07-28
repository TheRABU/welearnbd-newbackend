const express = require("express");
const {
  newUserSignUpMethod,
  getAllUser,
  deleteSingleUser,
  makeUserAdmin,
  checkIfUserIsAdmin,
} = require("../controllers/newUserController");
const verifyToken = require("../middlewares/verifyTokens");
const { verifyIsAdmin } = require("../middlewares/isAdminMiddleware");

const newUserRouter = express.Router();

newUserRouter.route("/").post(newUserSignUpMethod);
newUserRouter.route("/getAll").get(verifyToken, verifyIsAdmin, getAllUser);
newUserRouter.route("/:id").delete(deleteSingleUser);
newUserRouter.route("/makeAdmin/:id").patch(makeUserAdmin);
newUserRouter.route("/isUserAdmin/:email").get(verifyToken, checkIfUserIsAdmin);
module.exports = newUserRouter;
