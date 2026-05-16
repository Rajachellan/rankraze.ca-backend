const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/adminUserController");
const {
  authenticateJwt,
  loadAdminUser,
  requireSuperadmin,
} = require("../middleware/accessControl");

const chain = [authenticateJwt, loadAdminUser, requireSuperadmin];

router.get("/admin/meta", ...chain, adminUserController.getMeta);
router.get("/admin/users", ...chain, adminUserController.listUsers);
router.post("/admin/users", ...chain, adminUserController.createUser);
router.patch("/admin/users/:id", ...chain, adminUserController.updateUser);

module.exports = router;
