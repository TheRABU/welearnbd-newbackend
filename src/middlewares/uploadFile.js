const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const {
  UPLOAD_FILE_PATH,
  ALLOWED_FILE_EXTENTIONS,
  MAX_FILE_SIZE,
  ALLOWED_FILE_EXTENSIONS_NEW,
  ALLOWED_MIME_TYPES_NEW,
} = require("../constants");
const uploadDirectory = UPLOAD_FILE_PATH;
const allowedFileTypes = ALLOWED_FILE_EXTENTIONS;

// using disk storage
const userStorage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, uploadDirectory);
  // },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extname, "") + extname
    );
  },
});

// const fileFilter = (req, file, cb) => {
//   const extname = path.extname(file.originalname);
//   // if (!allowedFileTypes.includes(extname.substring(1))) {
//   //   const error = createError(
//   //     400,
//   //     "File type not allowed because:",
//   //     error.message
//   //   );
//   //   return cb(error.message);
//   // }
//   if (!allowedFileTypes.includes(file.mimetype)) {
//     return cb(new Error("File type is not allowed", Error.message), false);
//   }

//   cb(null, true);
// };

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase().substring(1);
  const mimetype = file.mimetype.toLowerCase();

  if (
    !ALLOWED_FILE_EXTENSIONS_NEW.includes(extname) ||
    !ALLOWED_MIME_TYPES_NEW.includes(mimetype)
  ) {
    return cb(new createError(400, "File type is not allowed"), false);
  }

  cb(null, true);
};

// using Memory storage

// const storage = multer.memoryStorage();
// const fileFilter = (req, file, cb) => {
//   if (!file.mimetype.startsWith("image/")) {
//     return cb(new Error("Only Image files are allowed"), false);
//   }
//   if (file.size > MAX_FILE_SIZE) {
//     return cb(new Error("Maximum file size limit exceeded"), false);
//   }
//   if (!ALLOWED_FILE_EXTENTIONS.includes(file.mimetype)) {
//     return cb(new Error("File type not allowed"), false);
//   }
//   cb(null, true);
// };

const uploadUserImage = multer({
  storage: userStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: fileFilter,
});

module.exports = uploadUserImage;
