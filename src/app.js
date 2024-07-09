const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter.js");
const courseRouter = require("./routers/courseRouter.js");
const { errorResponse } = require("./controllers/responseController.js");
require("dotenv").config();
const app = express();

const rateLimiter = rateLimit({
  windowsMs: 1 * 60 * 1000, // 1 minute,
  max: 10,
  message: "Rate limit exceeded for this ip. Try again later",
});

app.use(rateLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/seed", seedRouter);
app.use("/api/v1/courses", courseRouter);

app.get("/", async (req, res) => {
  res.json("Server choltase");
});

// client side error handling
app.use((req, res, next) => {
  res.status(404).json({
    message: "Could not found sorry",
  });
});
// server side error
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
