const jwt = require("jsonwebtoken");
const User = require("../models/authSchema");
const { PERMISSION_IDS } = require("../config.js/accessConfig");

function getBearerToken(req) {
  const h = req.headers.authorization;
  if (h && h.startsWith("Bearer ")) return h.slice(7).trim();
  return null;
}

/** Attaches req.auth = { id } from JWT */
function authenticateJwt(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }
  if (!process.env.AUTH_SECRET) {
    return res.status(500).json({ message: "Server misconfiguration" });
  }
  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET);
    const id = payload.id || payload.sub;
    if (!id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }
    req.auth = { id: String(id), username: payload.username, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function isSuperadmin(user) {
  return user.role === "superadmin";
}

/** Legacy: role admin with no explicit permission restrictions = full access */
function isUnrestrictedLegacyAdmin(user) {
  const noPerms = !user.permissions || user.permissions.length === 0;
  return user.role === "admin" && noPerms;
}

function canAccessResource(user, permissionId) {
  if (isSuperadmin(user) || isUnrestrictedLegacyAdmin(user)) return true;
  return Array.isArray(user.permissions) && user.permissions.includes(permissionId);
}

/** Loads full user from DB after JWT */
async function loadAdminUser(req, res, next) {
  try {
    const user = await User.findById(req.auth.id).select("-hash -salt");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.adminUser = user;
    next();
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

function requirePermission(permissionId) {
  if (!PERMISSION_IDS.includes(permissionId)) {
    throw new Error(`Unknown permission: ${permissionId}`);
  }
  return (req, res, next) => {
    const user = req.adminUser;
    if (!user) {
      return res.status(500).json({ message: "User context missing" });
    }
    if (!canAccessResource(user, permissionId)) {
      return res.status(403).json({ message: "Forbidden: insufficient permission" });
    }
    next();
  };
}

function requireSuperadmin(req, res, next) {
  const user = req.adminUser;
  if (!user) {
    return res.status(500).json({ message: "User context missing" });
  }
  if (!isSuperadmin(user)) {
    return res.status(403).json({ message: "Forbidden: superadmin only" });
  }
  next();
}

module.exports = {
  authenticateJwt,
  loadAdminUser,
  requirePermission,
  requireSuperadmin,
  canAccessResource,
  isSuperadmin,
  isUnrestrictedLegacyAdmin,
};
