const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri || typeof uri !== "string" || !uri.trim()) {
    const hint =
      "Set MONGO_URI in Contact-Form-Rankraze/.env (copy from .env.example). If the file exists, ensure the server is started from this folder or that .env sits next to server.js.";
    console.error("❌ MongoDB:", hint);
    throw new Error(hint);
  }
  try {
    await mongoose.connect(uri.trim());
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

module.exports = connectDB;
