# WeLearnBd - Backend

This repository contains the backend code for the WeLearnBd project, a Learning Management System (LMS) platform built with Node.js and Express. The backend handles user authentication, course management, payment processing, and other core functionalities.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [License](#license)

## Technologies Used

This project is built using the following technologies:

### Backend

- **Node.js** - A JavaScript runtime built on Chrome's V8 engine.
- **Express.js** - A minimal and flexible Node.js web application framework.
- **MongoDB** - A NoSQL database for storing and managing data.
- **Mongoose** - An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (jsonwebtoken)** - A library to create and verify JSON Web Tokens for secure authentication.
- **Bcrypt.js** - A library to hash and compare passwords securely.
- **Multer** - A middleware for handling multipart/form-data, used for file uploads.
- **Cloudinary** - A cloud-based service for managing images and videos.
- **Stripe** - A payment processing platform.
- **Nodemailer** - A module for sending emails from Node.js applications.
- **Express Rate Limit** - A middleware for rate-limiting requests to prevent abuse.
- **Express Validator** - A set of express.js middlewares that wraps validator.js functions.
- **Cors** - A middleware for enabling CORS (Cross-Origin Resource Sharing).
- **Http-errors** - A utility to create HTTP errors.
- **Cookie-parser** - A middleware to parse cookies.
- **Dotenv** - A module to load environment variables from a `.env` file.

### Development Tools

- **Nodemon** - A tool that automatically restarts the Node.js application when file changes are detected during development.

### Features
    User authentication using JWT with hashed passwords via Bcrypt.js.
    Rate limiting to protect against brute-force attacks.
    Email notifications and password reset functionality with Nodemailer.
    Secure file uploads and management with Multer and Cloudinary.
    Payment processing with Stripe.
    Robust input validation using Express Validator.
    Modular and scalable codebase using Express.js and Mongoose.
