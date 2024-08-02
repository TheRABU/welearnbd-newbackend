const { successResponse } = require("./responseController.js");

const newUser = require("../models/newUserModel.js");
const Course = require("../models/courseModel.js");
const Payment = require("../models/paymentModel.js");
const Teacher = require("../models/teacherModel.js");

const getAdminStats = async (req, res, next) => {
  try {
    // Run queries in parallel to optimize performance
    const [
      totalUsers,
      totalTeacherRequests,
      totalCourses,
      totalOrders,
      payments,
    ] = await Promise.all([
      newUser.estimatedDocumentCount(),
      Teacher.estimatedDocumentCount(),
      Course.estimatedDocumentCount(),
      Payment.estimatedDocumentCount(),
      Payment.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$price",
            },
          },
        },
      ]),
    ]);

    const totalRevenue = payments.length > 0 ? payments[0].totalRevenue : 0;

    // Send a standardized success response
    res.json({
      users: totalUsers,
      teachers: totalTeacherRequests,
      products: totalCourses,
      orders: totalOrders,
      revenue: totalRevenue,
    });
  } catch (error) {
    console.error("Error in getAdminStats controller:", error.message);
    next(error); // Use centralized error handling middleware
  }
};

module.exports = { getAdminStats };
