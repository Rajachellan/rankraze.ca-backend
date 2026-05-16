const express = require("express");
const { getStats } = require("../controllers/statsController");
const {
  authenticateJwt,
  loadAdminUser,
  requirePermission,
} = require("../middleware/accessControl");

const router = express.Router();

const leadsChain = [authenticateJwt, loadAdminUser, requirePermission("leads")];

router.get("/stats", ...leadsChain, getStats);

module.exports = router;
