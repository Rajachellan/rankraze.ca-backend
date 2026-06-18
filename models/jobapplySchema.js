const mongoose = require("mongoose");

const jobapplySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  mobile: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Mobile must be 10 digits"],
  },
  gender: { type: String, required: true, enum: ["Male", "Female"] },
  linkedinProfile: { type: String },
  highestQualification: {
    type: String,
    enum: ["Doctorate", "Post Graduate", "Under Graduate", "Diploma", "Others"],
    default: "Others",
    required: true,
  },
  overallExperience: { type: String, required: true },
  noticePeriod: {
    type: String,
    enum: ["Immediate Joining", "Under 15 Days", "Under 1 Month", "Others"],
    default: "Others",
    required: true,
  },
  resume: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ca-JobApply", jobapplySchema);
