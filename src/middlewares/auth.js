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
    req.user = decoded.user;
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

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw createError(403, "Forbidden access. Must be an admin");
    }
    next();
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const authenticateToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await userCollection.findOne(query);
  const isAdmin = user.isAdmin;
  if (!isAdmin) {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAdmin,
  authenticateToken,
  verifyAdmin,
};
