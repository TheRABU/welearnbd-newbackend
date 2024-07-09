const express = require("express");

const {
  getAllCourses,
  getSingleCourse,
  createCourse,
  deleteCourse,
} = require("../controllers/courseController.js");

const courseRouter = express.Router();

courseRouter.route("/").get(getAllCourses);
courseRouter.route("/:id").get(getSingleCourse);
courseRouter.route("/").post(createCourse);
courseRouter.route("/:id").delete(deleteCourse);

module.exports = courseRouter;
