const multer = require("multer");
const path = require("path");

const UPLOAD_DIR = "/app/uploads/resumes";

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const allowedFileTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF, DOC, and DOCX are allowed"));
  },
});

module.exports = upload;
