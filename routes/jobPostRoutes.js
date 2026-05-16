const express = require("express");
const router = express.Router();

const {
  createJobPost,
  getAllJobs,
  getJobById,
  getJobBySlug,
} = require("../controllers/jobpostController");
const {
  authenticateJwt,
  loadAdminUser,
  requirePermission,
} = require("../middleware/accessControl");

const jobsWriteChain = [authenticateJwt, loadAdminUser, requirePermission("jobs")];

router.post("/jobs", ...jobsWriteChain, createJobPost);

router.get("/jobs", getAllJobs);

router.get("/jobs/:slug", getJobBySlug);

router.get("/jobs/:id", getJobById);

module.exports = router;
