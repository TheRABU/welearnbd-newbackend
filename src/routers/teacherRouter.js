const express = require("express");

const {
  postAllTeacherRequests,
  approveTeacherRequest,
  getAllTeacherRequests,
  getMyTeacherRequest,
} = require("../controllers/teacherController");

const teacherRouter = express.Router();

teacherRouter.route("/requests").post(postAllTeacherRequests);
teacherRouter.route("/requests/:id/approve").put(approveTeacherRequest);
teacherRouter.route("/requests").get(getAllTeacherRequests);
teacherRouter.route("/my-request/:email").get(getMyTeacherRequest);

module.exports = teacherRouter;
