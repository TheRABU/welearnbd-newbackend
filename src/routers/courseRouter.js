const express = require("express");

const {
  getAllCourses,
  getSingleCourse,
  createCourse,
  deleteCourse,
  getMyPublishedCourses,
  deleteMyPublihsedCourse,
} = require("../controllers/courseController.js");

const courseRouter = express.Router();

courseRouter.route("/").get(getAllCourses);
courseRouter.route("/:id").get(getSingleCourse);
courseRouter.route("/myPublished/:email").get(getMyPublishedCourses);
courseRouter.route("/").post(createCourse);
courseRouter.route("/:id").delete(deleteCourse);
courseRouter.route("/myPublished/:id").delete(deleteMyPublihsedCourse);

module.exports = courseRouter;
