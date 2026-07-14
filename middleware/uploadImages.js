const multer = require("multer");

const storage = multer.memoryStorage();

const allowedFileTypes = ["image/webp", "image/jpeg", "image/jpg", "image/png"];

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB images
    fieldSize: 25 * 1024 * 1024, // large HTML content fields
  },
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only WebP, JPEG, and PNG images are allowed"));
  },
});

module.exports = upload;
