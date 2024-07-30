const Teacher = require("../models/teacherModel");
const createError = require("http-errors");

const verifyIsTeacher = async (req, res, next) => {
  try {
    const { email } = req.decoded.email;
    const teacher = await Teacher.findOne({ email: email });
    if (!teacher) {
      return createError(404, "Teacher request not found");
    }
    const isTeacher = teacher.status === "approved";

    if (!isTeacher) {
      return res.status(401).send({ message: "You are not a teacher yet!" });
    }
    next();
  } catch (error) {
    console.log("Error at isTeachermiddleware catch block:", error.message);
    next(error);
  }
};

module.exports = { verifyIsTeacher };
