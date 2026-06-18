const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String },
    message: { type: String },
    source: { type: String, default: "unknown" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ca-Form", formSchema);
