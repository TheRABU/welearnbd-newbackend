const User = require("../models/userModel.js");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { successResponse } = require("./responseController.js");
const { findWithId } = require("../services/findWithId.js");
const fs = require("fs");
const { deleteImage } = require("../services/deleteImage.js");
const { createJSONWebToken } = require("../services/createJWT.js");
const sendEmailWithNodeMailer = require("../services/sendEmail.js");

// find all users using search and also with pagination
const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
      ],
    };
    const options = {
      password: 0,
    };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();
    if (!users) throw new createError(404, "No users found");

    return successResponse(res, {
      statusCode: 200,
      message: "users fetched successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    console.log(error.message);
    throw new Error();
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    // const options = { password: 0 };
    // const user = await User.findById(id, options);
    // if (!user) {
    //   throw createError(404, "User not found with this id!");
    // }
    return successResponse(res, {
      statusCode: 200,
      message: "User found successfully",
      payload: { user },
    });
  } catch (error) {
    // if (error instanceof mongoose.Error) {
    //   next(createError(400, "Invalid User id"));
    //   return;
    // }
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;

    deleteImage(userImagePath);

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userIsExist = await User.exists({ email: email });
    if (userIsExist) {
      throw new createError(409, "User with email already exists");
    }

    // create jwt
    const token = createJSONWebToken(
      { name, email, password },
      process.env.JWT_SECRET_TOKEN,
      "10m"
    );
    // prepare email
    const emailData = {
      email,
      subject: "Account activation email from Welearnbd",
      html: `
        <h2> Hello there ${name}, Welcome to WelearnBD.com </h2>
        <p>Click here in this link to verify your account. <a href="${process.env.CLIENT_URL}/api/v1/users/activate/${token}" target="_blank">Activate Now</a></p>
      `,
    };
    // send email with nodemailer
    try {
      await sendEmailWithNodeMailer(emailData);
    } catch (error) {
      throw new Error(error.message);
    }
    // console.log(token);
    // const newUser = new User({
    //   name,
    //   email,
    //   password,
    // });

    // await newUser.save();

    return successResponse(res, {
      statusCode: 200,
      message: `please check your email ${email} for verification`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) {
      return next(createError(404, "Token not found"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(createError(401, "Token has expired"));
      } else if (error.name === "JsonWebTokenError") {
        return next(createError(401, "Invalid Token"));
      } else {
        return next(createError(500, "Token verification failed"));
      }
    }

    if (!decoded) {
      return next(createError(404, "User could not be verified"));
    }

    const userExists = await User.exists({ email: decoded.email });
    if (userExists) {
      return next(createError(409, "User with this email already exists"));
    }

    await User.create(decoded);

    return successResponse(res, {
      statusCode: 201,
      message: "User was registered successfully",
    });
  } catch (error) {
    console.error("Error during user activation:", error.message);
    return next(createError(500, "Internal Server Error"));
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  deleteUser,
  registerUser,
  activateUserAccount,
};
