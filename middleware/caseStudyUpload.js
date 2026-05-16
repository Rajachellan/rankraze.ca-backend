const multer = require("multer");
const path = require("path");

const UPLOAD_DIR = "/home/skalelit/uploads/CaseStudies";

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const allowedFileTypes = ["image/webp"];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only WebP images are allowed"));
  },
});

module.exports = upload;
