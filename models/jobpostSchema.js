const mongoose = require("mongoose");

const jobpostSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    jobDescription: { type: String, required: true },
    responsibilities: [{ type: String }],
    skills: [{ type: String }],
    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Internship"],
    },
    workExpierience: { type: String, required: true },
    city: { type: String, default: "Chennai" },
    state: { type: String, default: "TamilNadu" },
    country: { type: String, default: "India" },
    location: { type: String, default: "Anna Nagar" },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

jobpostSchema.index({
  jobTitle: "text",
  jobDescription: "text",
  skills: "text",
  city: "text",
});

module.exports =
  mongoose.models.JobPost || mongoose.model("Ca-JobPost", jobpostSchema);
