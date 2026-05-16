const User = require("../models/authSchema");
const {
  ADMIN_PERMISSIONS,
  PERMISSION_IDS,
} = require("../config.js/accessConfig");

function toPublicUser(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  delete o.hash;
  delete o.salt;
  return o;
}

exports.getMeta = (req, res) => {
  res.json({
    permissions: ADMIN_PERMISSIONS,
  });
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-hash -salt")
      .sort({ createdAt: -1 })
      .lean();
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, phone, password, role, permissions } = req.body;

    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: "username, email, phone, and password are required" });
    }

    let r = role === "editor" ? "editor" : "admin";
    if (role === "superadmin") {
      r = "admin";
    }

    const perms = Array.isArray(permissions)
      ? permissions.filter((p) => PERMISSION_IDS.includes(p))
      : [];

    const newUser = new User({
      username,
      email,
      phone,
      role: r,
      permissions: perms,
    });

    await User.register(newUser, password);
    const saved = await User.findById(newUser._id).select("-hash -salt");
    return res.status(201).json({ message: "User created", user: toPublicUser(saved) });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Could not create user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email, phone, role, permissions, newPassword } = req.body;

    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    if (role !== undefined) {
      if (user.role === "superadmin") {
        // Only self can change a superadmin account (avoid lockout)
        if (req.adminUser._id.toString() !== user._id.toString()) {
          return res.status(403).json({ message: "Cannot modify another superadmin" });
        }
        if (role === "superadmin" || role === "admin" || role === "editor") {
          user.role = role;
        }
      } else {
        if (role === "superadmin") {
          return res.status(403).json({ message: "Promote to superadmin in the database only" });
        }
        if (role === "admin" || role === "editor") {
          user.role = role;
        }
      }
    }

    if (permissions !== undefined) {
      user.permissions = Array.isArray(permissions)
        ? permissions.filter((p) => PERMISSION_IDS.includes(p))
        : [];
    }

    if (newPassword && typeof newPassword === "string" && newPassword.length > 0) {
      await user.setPassword(newPassword);
    }

    await user.save();
    const fresh = await User.findById(user._id).select("-hash -salt");
    return res.json({ message: "User updated", user: toPublicUser(fresh) });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
