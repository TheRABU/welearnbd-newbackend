const User = require("../models/userModel.js");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { successResponse } = require("./responseController.js");
const { createJSONWebToken } = require("../services/createJWT.js");

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        "User does not exist with this email. Please register account"
      );
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw createError(401, "Email or Password do not match");
    }
    if (user.isBanned) {
      throw createError(403, "User is banned please contact the authority");
    }
    const userWithoutPass = await User.findOne({ email }).select("-password");
    // create jwt
    const accessToken = createJSONWebToken(
      { user },
      process.env.ACCESS_TOKEN_SECRET,
      "20m"
    );
    res.cookie("access_token", accessToken, {
      maxAge: 20 * 60 * 1000, //15min,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return successResponse(res, {
      statusCode: 200,
      message: "user logged in successfully",
      payload: { userWithoutPass },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");

    return successResponse(res, {
      statusCode: 200,
      message: "user logged out successfully",
      payload: {},
    });
  } catch (error) {
    console.log(error.message);
    throw new error();
  }
};

module.exports = { handleLogin, handleLogout };
