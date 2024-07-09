const Course = require("../models/courseModel.js");

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
// create a new course
const createCourse = async (req, res) => {
  const { courseName, teacherName, price, category, level, courseImage } =
    req.body;

  try {
    const newCourse = new Course({
      courseName,
      teacherName,
      price,
      category,
      level,
      courseImage,
    });
    const course = await newCourse.save();
    res.status(201).json(course);
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

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  deleteCourse,
};
