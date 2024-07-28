const newUser = require("../models/newUserModel.js");

const verifyIsAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await newUser.findOne(query);
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return res
      .status(403)
      .send({ message: "forbidden access. user is not an admin!" });
  }
  next();
};

module.exports = { verifyIsAdmin };
