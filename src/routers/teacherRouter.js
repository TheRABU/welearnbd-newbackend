const express = require("express");

const {
  postAllTeacherRequests,
  approveTeacherRequest,
  getAllTeacherRequests,
  getMyTeacherRequest,
  checkIfUserIsTeacher,
} = require("../controllers/teacherController");
const verifyToken = require("../middlewares/verifyTokens");
const { verifyIsAdmin } = require("../middlewares/isAdminMiddleware");

const teacherRouter = express.Router();

teacherRouter.route("/requests").post(postAllTeacherRequests);
teacherRouter
  .route("/requests/:id/approve")
  .put(verifyToken, verifyIsAdmin, approveTeacherRequest);
teacherRouter
  .route("/requests")
  .get(verifyToken, verifyIsAdmin, getAllTeacherRequests);
teacherRouter.route("/my-request/:email").get(verifyToken, getMyTeacherRequest);
teacherRouter
  .route("/checkTeacher/:email")
  .get(verifyToken, checkIfUserIsTeacher);
module.exports = teacherRouter;
