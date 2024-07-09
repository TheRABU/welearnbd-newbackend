const multer = require("multer");
const path = require("path");
const { UPLOAD_FILE_PATH } = require("../constants");
const uploadDirectory = UPLOAD_FILE_PATH;
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

const upload = multer({ storage: storage });

module.exports = upload;
