const express = require("express");
const router = express.Router();
const { CreateCaseStudy } = require("../controllers/caseStudyController");
const upload = require("../middleware/uploadImages");

// router.get("/blogs/:id", getBlogsById);
router.post("/casestudy", upload.single("image"), CreateCaseStudy);
// router.put("/blogs/:id", upload.single("image"), updateBlog);
// router.delete("/blogs/:id", deleteBlog);
module.exports = router;
