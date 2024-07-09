const DATABASE_NAME = "weLearnBD";

const SMTP_USER_NAME = "fazlerabbi.xd@gmail.com";
const SMTP_USER_PASS = "meyz ncpe xqbx szij";

const UPLOAD_FILE_PATH = "public/images/users";

const MAX_FILE_SIZE = Number(`${process.env.MAX_FILE_SIZE}`) || 1024 * 1024 * 2;
const ALLOWED_FILE_EXTENTIONS = process.env.ALLOWED_FILE_EXTENTIONS || [
  "jpg",
  "jpeg",
  "png",
];

module.exports = {
  DATABASE_NAME,
  SMTP_USER_PASS,
  SMTP_USER_NAME,
  UPLOAD_FILE_PATH,
  MAX_FILE_SIZE,
  ALLOWED_FILE_EXTENTIONS,
};
