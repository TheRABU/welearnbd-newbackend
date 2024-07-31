const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_CLIENT_SECRET);
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
// const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter.js");
const courseRouter = require("./routers/courseRouter.js");
const { errorResponse } = require("./controllers/responseController.js");
const cors = require("cors");
const authRouter = require("./routers/authRouter.js");
const teacherRouter = require("./routers/teacherRouter.js");
const paymentRouter = require("./routers/paymentRoute.js");
const cartRouter = require("./routers/cartRouter.js");
const newUserRouter = require("./routers/newuserRouter.js");
const jwtRouter = require("./routers/jwtRouter.js");
require("dotenv").config();
const app = express();

const rateLimiter = rateLimit({
  windowsMs: 1 * 60 * 1000, // 1 minute,
  max: 10,
  message: "Rate limit exceeded for this ip. Try again later",
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://checkout.stripe.com",
  "https://firebase.google.com",
  "https://we-learn-bd.web.app",
  "https://we-learn-bd.firebaseapp.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// app.use(rateLimiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/api/v1/users", userRouter);
app.use("/api/v1/new-users", newUserRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/seed", seedRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/jwt", jwtRouter);

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
