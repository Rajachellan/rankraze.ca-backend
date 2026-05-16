const express = require("express");
const router = express.Router();
const {
  getBlogs,
  getBlogsById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogBySlug,
  uploadImage,
} = require("../controllers/blogController");
const upload = require("../middleware/uploadImages");
const {
  authenticateJwt,
  loadAdminUser,
  requirePermission,
} = require("../middleware/accessControl");

const blogWriteChain = [authenticateJwt, loadAdminUser, requirePermission("blogs")];

router.get("/blogs", getBlogs);
router.get("/blogs/id/:id", getBlogsById);
router.get("/blogs/:slug", getBlogBySlug);
router.post("/blogs", ...blogWriteChain, upload.single("image"), createBlog);
router.put("/blogs/:id", ...blogWriteChain, upload.single("image"), updateBlog);
router.post("/blogs/upload", ...blogWriteChain, upload.single("image"), uploadImage);
router.delete("/blogs/:id", ...blogWriteChain, deleteBlog);
module.exports = router;
