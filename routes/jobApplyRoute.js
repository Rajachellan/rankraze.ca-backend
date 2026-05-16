const express = require("express");
const router = express.Router();
const { createJobApply } = require("../controllers/jobapplyController");
const upload = require("../middleware/uploadResume");

router.post("/apply", upload.single("resume"), createJobApply);

module.exports = router;
