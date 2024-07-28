const jwt = require("jsonwebtoken");

const generateJwtToken = async (req, res, next) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "2h",
    });
    res.send({ token });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = { generateJwtToken };
