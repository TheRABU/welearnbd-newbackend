const User = require("../models/userModel.js");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { successResponse } = require("./responseController.js");
const { findWithId } = require("../services/findWithId.js");
const fs = require("fs");
const { deleteImage } = require("../services/deleteImage.js");
const { createJSONWebToken } = require("../services/createJWT.js");
const sendEmailWithNodeMailer = require("../services/sendEmail.js");
const cloudinary = require("../cloudinary/cloudinary.js");
const { default: mongoose } = require("mongoose");

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

    // const imageBufferString = req.file?.buffer.toString("base64");
    const image = req.file?.path;
    if (image && image.size > 1024 * 1024 * 2) {
      throw createError(400, "File is too large. It must be less than 2 MB");
    }
    const userIsExist = await User.exists({ email: email });
    if (userIsExist) {
      throw new createError(409, "User with email already exists");
    }

    const tokenPayload = {
      name,
      email,
      password,
    };
    if (image) {
      tokenPayload.image = image;
    }
    // create jwt
    const token = createJSONWebToken(
      tokenPayload,
      process.env.JWT_SECRET_TOKEN,
      "1hr"
    );
    // prepare email
    const emailData = {
      email,
      subject: "Account activation email from Welearnbd",
      html: `
        <h2> Hello there ${name}, Welcome to WelearnBD.com </h2>
        <p>Click here in this link to verify your account. <a href="${process.env.CLIENT_URL}/verify/${token}" target="_blank">Activate Now</a></p>
      `,
    };
    // send email with nodemailer
    try {
      // await sendEmailWithNodeMailer(emailData);
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

// new method to signup user
const newUserSignUpMethod = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userIsExist = await User.exists({ email: email });
    if (userIsExist) {
      throw new createError(409, "User with email already exists");
    }

    const newCreatedUserInDatabase = new User({
      name,
      email,
      password,
    });

    const savedUser = await newCreatedUserInDatabase.save();

    const tokenPayload = {
      savedUser,
    };

    // create jwt
    // const token = createJSONWebToken(
    //   tokenPayload,
    //   process.env.JWT_SECRET_TOKEN,
    //   "1hr"
    // );

    return successResponse(res, {
      statusCode: 200,
      message: "User registered successfully",
      payload: savedUser,
    });
  } catch (error) {
    console.error(
      "Error during creating user using new controller:",
      error.message
    );
    throw error;
  }
};

// new method to login user
const newLoginMethod = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const testAdmin = async (req, res, next) => {
  res.json("ADMIN route");
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
    const image = decoded.image;
    if (image) {
      try {
        const response = await cloudinary.uploader.upload(image, {
          folder: "weLearnBD/users/profile",
        });
        decoded.image = response.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        throw new createError(500, "Image upload failed");
      }
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

const updateUserAccount = async (req, res, next) => {
  try {
    const id = req.params.id;

    const updateOptions = {
      new: true,
      runValidators: true,
      context: "query",
    };
    let updates = {};
    const allowedFields = ["name", "password", "image"];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw createError(400, "Email can not be updated");
      }
    }
    // updating fields

    // if(req.body.name){
    //   updates.name = req.body.name;
    // }
    // if(req.body.password){
    //   updates.password = req.body.password;
    // }

    const image = req.file?.path;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw new Error("File is too large must be less than 2 MB");
      }
      updates.image = image;
      // replace the old image
      user.image !== "default.jpeg" && deleteImage(user.image);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      updateOptions
    );
    if (!updatedUser) {
      throw createError(404, "could not update user");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "User information updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// const banUser = async (req, res, next) => {
//   try {
//     const userId = req.params.userId;
//     await findWithId(User, userId);
//     const updates = { isBanned: true };
//     const updateOptions = { new: true, runValidators: true, context: "query" };

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       updates,
//       updateOptions
//     ).select("-password");

//     if (!updatedUser) {
//       throw createError(404, "Could not ban user!!");
//     }
//     return successResponse(res, {
//       statusCode: 200,
//       message: "User banned successfully",
//       payload: updatedUser,
//     });
//   } catch (error) {
//     console.log("Error at ban user controller", error.message);
//   }
// };

const manageUserStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const action = req.body.action;

    let update;
    let successMessage;
    if (action === "ban") {
      update = { isBanned: true };
      successMessage = "User was banned successfully";
    } else if (action === "unban") {
      update = { isBanned: false };
      successMessage = "User was unbanned successfully";
    } else if (action === "teacher") {
      update = { isCourseTeacher: true };
      successMessage = "You have been updated as a Teacher";
    } else {
      throw createError(
        400,
        `Invalid Action. you can only "ban" or "unban" action.`
      );
    }

    const updateOptions = {
      new: true,
      runValidators: true,
      context: "query",
    };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    ).select("-password");
    if (!updatedUser) {
      throw createError(400, "Could not update user status!");
    }
    return successResponse(res, {
      statusCode: 200,
      message: successMessage,
      payload: updatedUser,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "Invalid id");
    }
    console.log(error.message);
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { email, oldPassword, newPassword } = req.body;
    // check if user exist
    // const user = await User.findOne({ email: email });
    const user = await findWithId(User, userId);
    if (!user) {
      throw createError(404, "User not found");
    }
    // compare password
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatched) {
      throw createError(400, "Old Password do not match");
    }

    // const update = { $set: { password: newPassword } };
    // const updateOptions = { new: true };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "Could not change your password try again later.");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Password updated successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    console.log("Error at update password controller", error.message);
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  deleteUser,
  registerUser,
  activateUserAccount,
  updateUserAccount,
  manageUserStatus,
  updatePassword,
  newUserSignUpMethod,
  testAdmin,
};
