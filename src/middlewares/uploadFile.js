const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const {
  UPLOAD_FILE_PATH,
  ALLOWED_FILE_EXTENTIONS,
  MAX_FILE_SIZE,
} = require("../constants");
const uploadDirectory = UPLOAD_FILE_PATH;
const allowedFileTypes = ALLOWED_FILE_EXTENTIONS;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extname, "") + extname
    );
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);
  if (!allowedFileTypes.includes(extname.substring(1))) {
    const error = createError(400, "File type not allowed");
    return cb(error);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

module.exports = upload;
