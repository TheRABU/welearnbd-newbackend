const cloudinary = require("cloudinary").v2;

const {
  cloudinary_cloudName,
  cloudinary_apiKey,
  cloudinary_apiSecret,
} = require("../constants.js");

cloudinary.config({
  cloud_name: cloudinary_cloudName,
  api_key: cloudinary_apiKey,
  api_secret: cloudinary_apiSecret,
  secure: true,
});

module.exports = cloudinary;
