const express = require("express");

const {
  postAllTeacherRequests,
  approveTeacherRequest,
  getAllTeacherRequests,
} = require("../controllers/teacherController");

const teacherRouter = express.Router();

teacherRouter.route("/requests").post(postAllTeacherRequests);
teacherRouter.route("/requests/:id/approve").put(approveTeacherRequest);
teacherRouter.route("/requests").get(getAllTeacherRequests);

module.exports = teacherRouter;
