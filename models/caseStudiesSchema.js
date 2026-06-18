const mongoose = require("mongoose");
const caseStudiesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: String },
  category: { type: String, required: true },
  tags: { type: [String] },
  publishedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ca-CaseStudy", caseStudiesSchema);
