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
    // create jwt
    const accessToken = createJSONWebToken(
      { email },
      process.env.ACCESS_TOKEN_SECRET,
      "10m"
    );
    res.cookie("access_token", accessToken, {
      maxAge: 15 * 60 * 1000, //15min,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return successResponse(res, {
      statusCode: 200,
      message: "user logged in successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleLogin };
