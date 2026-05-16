const CaseStudy = require("../models/caseStudiesSchema");

const getCaseStudy = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const CreateCaseStudy = async (req, res) => {
  try {
    const { title, description, category, tags, publishedDate } = req.body;
    const images = req.file ? `/uploads/images/${req.file.filename}` : null;
    if (!title || !description || !category || tags || publishedDate) {
      return res
        .status(400)
        .json({ message: "All fields except Tags are required." });
    }
    const newStudy = new CaseStudy({
      title,
      description,
      category,
      images,
      publishedDate,
      tags,
    });
    const savedStudy = await newStudy.save();
    res.status(201).json({ success: true, data: savedStudy });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { CreateCaseStudy, getCaseStudy };
