const axios = require("axios");
const mongoose = require("mongoose");
const JobApply = require("../models/jobapplySchema");
const JobPost = require("../models/jobpostSchema");
require("dotenv").config();

const TEAMS_WEBHOOK_URL_CAREERS = process.env.TEAMS_WEBHOOK_URL_CAREERS;

async function createJobApply(req, res) {
  try {
    const {
      fullName,
      email,
      mobile,
      gender,
      linkedinProfile,
      highestQualification,
      overallExperience,
      noticePeriod,
      job,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Resume is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(job)) {
      return res.status(400).json({ success: false, message: "Invalid job id format" });
    }

    const jobExists = await JobPost.findById(job);
    if (!jobExists) {
      return res.status(400).json({ success: false, message: "Invalid job id. Job does not exist." });
    }

    const newApplication = await JobApply.create({
      fullName,
      email,
      mobile,
      gender,
      linkedinProfile,
      highestQualification,
      overallExperience,
      noticePeriod,
      resume: req.file.filename,
      job: jobExists._id,
    });

    // ✅ Correct public resume URL
    const resumeLink = `${process.env.BASE_URL || "https://api.rankraze.ca"}/resumes/${req.file.filename}`;

    const card = {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      themeColor: "0076D7",
      summary: "New Job Application",
      title: "📩 New Job Application Received",
      sections: [
        {
          facts: [
            { name: "Full Name", value: fullName },
            { name: "Email", value: email },
            { name: "Mobile", value: mobile },
            { name: "Gender", value: gender },
            { name: "LinkedIn", value: linkedinProfile || "N/A" },
            { name: "Qualification", value: highestQualification },
            { name: "Experience", value: overallExperience },
            { name: "Notice Period", value: noticePeriod },
            { name: "Applied Job", value: jobExists.title || jobExists.jobTitle },
            { name: "Resume", value: `[Download Resume](${resumeLink})` },
          ],
        },
      ],
    };

    /*
    if (TEAMS_WEBHOOK_URL_CAREERS) {
      await axios.post(TEAMS_WEBHOOK_URL_CAREERS, card);
    }
    */

    res.status(201).json({ success: true, data: newApplication });
  } catch (error) {
    console.error("Error creating job application:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}


module.exports = { createJobApply };
