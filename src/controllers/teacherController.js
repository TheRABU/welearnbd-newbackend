const Teacher = require("../models/teacherModel");
const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse, errorResponse } = require("./responseController");

const postAllTeacherRequests = async (req, res, next) => {
  try {
    const { name, email, category, experience } = req.body;

    const isTeacherExist = await Teacher.exists({ email: email });
    if (isTeacherExist) {
      res.status(400).json({ message: "User is already a teacher" });
    }
    const teacherRequest = new Teacher({
      name,
      email,
      category,
      experience,
      status: "pending",
    });
    const createRequest = await teacherRequest.save();

    return successResponse(res, {
      statusCode: 200,
      message: "Teacher request is submitted and pending approval",
      payload: createRequest,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
    throw new error();
  }
};

const getAllTeacherRequests = async (req, res, next) => {
  try {
    const allRequests = await Teacher.find({});
    return successResponse(res, {
      statusCode: 200,
      message: "Fetched all teacher requests from db",
      payload: allRequests,
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const getMyTeacherRequest = async (req, res, next) => {
  try {
    const email = req.params.email;

    if (!email) {
      throw createError(400, "Email Couldn't get from client side");
    }
    if (email !== req.decoded.email) {
      throw createError(403, "Forbidden Access");
    }

    const request = await Teacher.find({ email });
    if (!request) {
      res.status(404).json({ message: "Your request not found" });
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Found user request",
      payload: request,
    });
  } catch (error) {
    next(error);
  }
};

const approveTeacherRequest = async (req, res, next) => {
  try {
    const id = req.params.id;
    const request = await Teacher.findById(id);
    if (!request) {
      return createError(404, "Request not found");
    }
    const updateOptions = { new: true };
    const updatedRequest = await Teacher.findByIdAndUpdate(
      id,
      { status: "approved" },
      updateOptions
    );

    return successResponse(res, {
      statusCode: 200,
      message: "Teacher request approved",
      payload: updatedRequest,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const checkIfUserIsTeacher = async (req, res, next) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is missing" });
    }
    if (email !== req.decoded.email) {
      return res.status(403).send({ message: "forbidden access" });
    }
    const teacher = await Teacher.findOne({ email: email });
    if (teacher && teacher.status === "approved") {
      return res.status(200).json({ teacher: true });
    } else {
      return res.status(200).json({ teacher: false });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = {
  postAllTeacherRequests,
  approveTeacherRequest,
  getAllTeacherRequests,
  getMyTeacherRequest,
  checkIfUserIsTeacher,
};
