require("dotenv").config();

const DATABASE_NAME = "weLearnBD";

const SMTP_USER_NAME = "fazlerabbi.xd@gmail.com";
const SMTP_USER_PASS = "meyz ncpe xqbx szij";

const UPLOAD_FILE_PATH = "public/images/users";

const MAX_FILE_SIZE = Number(`${process.env.MAX_FILE_SIZE}`) || 1024 * 1024 * 2;
const ALLOWED_FILE_EXTENTIONS = process.env.ALLOWED_FILE_EXTENTIONS || [
  "image/jpg",
  "image/jpeg",
  "image/png",
];
const ALLOWED_FILE_EXTENSIONS_NEW = ["jpg", "jpeg", "png"];
const ALLOWED_MIME_TYPES_NEW = ["image/jpeg", "image/png"];

const cloudinary_cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinary_apiKey = process.env.CLOUDINARY_API_KEY;
const cloudinary_apiSecret = process.env.CLOUDINARY_API_SECRET;

module.exports = {
  DATABASE_NAME,
  SMTP_USER_PASS,
  SMTP_USER_NAME,
  UPLOAD_FILE_PATH,
  MAX_FILE_SIZE,
  ALLOWED_FILE_EXTENTIONS,
  cloudinary_cloudName,
  cloudinary_apiKey,
  cloudinary_apiSecret,
  ALLOWED_FILE_EXTENSIONS_NEW,
  ALLOWED_MIME_TYPES_NEW,
};
