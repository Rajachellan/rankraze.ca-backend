const express = require("express");
const { createForm, getForms } = require("../controllers/formController");
const {
  authenticateJwt,
  loadAdminUser,
  requirePermission,
} = require("../middleware/accessControl");

const router = express.Router();

const leadsChain = [authenticateJwt, loadAdminUser, requirePermission("leads")];

router.post("/form", createForm);
router.get("/forms", ...leadsChain, getForms);

module.exports = router;
