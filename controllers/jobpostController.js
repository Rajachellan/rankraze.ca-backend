const mongoose = require("mongoose");
const JobPost = require("../models/jobpostSchema");

// ---------------- SLUG FUNCTIONS ---------------- //

function slugify(text = "") {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function generateUniqueSlug(jobTitle) {
  const baseSlug = slugify(jobTitle);
  let slug = baseSlug;

  const existing = await JobPost.find({ slug: new RegExp(`^${baseSlug}`) });

  if (existing.length === 0) return slug;

  return `${baseSlug}-${existing.length + 1}`;
}

// ---------------- CREATE JOB POST ---------------- //

async function createJobPost(req, res) {
  try {
    const {
      jobTitle,
      jobDescription,
      responsibilities,
      skills,
      jobType,
      workExpierience,
      city,
      state,
      country,
      location,
    } = req.body;

    if (!jobTitle || !jobDescription || !jobType || !workExpierience) {
      return res.status(400).json({
        error:
          "jobTitle, jobDescription, jobType, workExpierience are required",
      });
    }

    const slug = await generateUniqueSlug(jobTitle);

    const newJobPost = await JobPost.create({
      jobTitle,
      slug,
      jobDescription,
      responsibilities: responsibilities || [],
      skills: skills || [],
      jobType,
      workExpierience,
      city,
      state,
      country,
      location,
    });

    return res.status(201).json({ success: true, data: newJobPost });
  } catch (err) {
    console.error("❌ Failed to create job:", err);

    if (err.code === 11000) {
      return res.status(409).json({ error: "Slug already exists" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// ---------------- GET ALL JOBS (Basic Search + Pagination 40) ---------------- //

async function getAllJobs(req, res) {
  try {
    let { page = 1, limit = 40, search, city, jobType } = req.query;

    page = Number(page);
    limit = Number(limit);

    const filter = { isActive: true };

    // 🔍 BASIC SEARCH (simple)
    if (search) {
      filter.$or = [
        { jobTitle: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (city) filter.city = city;
    if (jobType) filter.jobType = jobType;

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      JobPost.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      JobPost.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ---------------- GET JOB BY ID ---------------- //

async function getJobById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await JobPost.findById(id);

    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.error("❌ Error fetching job by ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ---------------- GET JOB BY SLUG ---------------- //

async function getJobBySlug(req, res) {
  try {
    const { slug } = req.params;

    const job = await JobPost.findOne({ slug, isActive: true });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.error("❌ Error fetching job by slug:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createJobPost,
  getAllJobs,
  getJobById,
  getJobBySlug,
};
