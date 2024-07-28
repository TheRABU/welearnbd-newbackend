const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("Authorization header missing");
    return res.status(401).send({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("Token missing from authorization header");
    return res.status(401).send({ message: "Authorization token missing" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid Token" });
    }
    req.decoded = decoded;
    next();
  });
};

module.exports = verifyToken;
