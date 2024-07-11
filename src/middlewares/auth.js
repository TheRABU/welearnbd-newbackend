const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      throw createError(401, "Access token not found");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      throw createError(401, "Invalid access token. Please log in again");
    }
    req.userId = decoded._id;
    next();
  } catch (error) {
    return next(error);
  }
};

const isLoggedOut = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (token) {
      try {
        const decoded = jwt.verify(
          access_token,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (decoded) {
          throw createError(400, "User is already logged in");
        }
      } catch (error) {
        console.log(error.message);
        throw error;
      }
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut };
