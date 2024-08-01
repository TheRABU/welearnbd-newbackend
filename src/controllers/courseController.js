const Course = require("../models/courseModel.js");
const { successResponse } = require("./responseController.js");
const createError = require("http-errors");
/*
 TODO: Create newCourseController;
*/

// get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
// get single course by id
const getSingleCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const findSingleCourse = await Course.findById(id);
    res.status(200).json(findSingleCourse);
  } catch (error) {
    const message = error.message;
    res.status(500).send(message);
  }
};
const getMyPublishedCourses = async (req, res, next) => {
  try {
    const email = req.params.email;
    if (email !== req.decoded.email) {
      return res
        .status(403)
        .json({ message: "Unauthorized access could not identify user token" });
    }

    const findMyCourses = await Course.find({ teacherEmail: email });
    // if (findMyCourses.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "Sorry, no courses found for your email" });
    // }
    return successResponse(res, {
      statusCode: 200,
      message: "Found all the courses you published",
      payload: findMyCourses,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
// create a new course
const createCourse = async (req, res) => {
  const {
    courseName,
    teacherName,
    teacherEmail,
    price,
    category,
    level,
    courseImage,
  } = req.body;

  try {
    const newCourse = new Course({
      courseName,
      teacherName,
      teacherEmail,
      price,
      category,
      level,
      courseImage,
    });
    const course = await newCourse.save();
    return successResponse(res, {
      statusCode: 200,
      message: "Success",
      payload: course,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error);
  }
};
// delete a course
const deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteCourse = await Course.deleteOne(id);
    res.status(200).json(deleteCourse);
  } catch (error) {
    const message = error.message;
    res.status(500).send(message);
  }
};
const deleteMyPublihsedCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const findMyCourse = await Course.findById({ _id: id });
    if (!findMyCourse) {
      return createError(404, "No such course found to delete");
    }
    const deletedCourse = await Course.findByIdAndDelete({ _id: id });

    return successResponse(res, {
      statusCode: 200,
      message: "Your Course Deleted Successfully",
      payload: deletedCourse,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getSingleCourse,
  getMyPublishedCourses,
  createCourse,
  deleteCourse,
  deleteMyPublihsedCourse,
};
