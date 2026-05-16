const multer = require("multer");

const storage = multer.memoryStorage();

const allowedFileTypes = ["image/webp", "image/jpeg", "image/jpg", "image/png"];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only WebP, JPEG, and PNG images are allowed"));
  },
});

module.exports = upload;
