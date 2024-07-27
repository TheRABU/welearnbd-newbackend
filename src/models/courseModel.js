const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseImage: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    teacherEmail: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },

    // postedBy: {
    //   type: ObjectId,
    //   ref: "Teachers",
    // },
    courseSyllabus: {
      type: [Object],
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
