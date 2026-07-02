const Blogs = require("../models/blogSchema");
const s3Client = require("../config.js/s3Client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

/* =======================
   SLUG HELPERS
======================= */
function slugify(text = "") {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function generateUniqueSlug(title) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;

  while (await Blogs.findOne({ slug })) {
    count++;
    slug = `${baseSlug}-${count}`;
  }
  return slug;
}

/* =======================
   GET BLOGS (LIST)
======================= */
const getBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10; // Reduced default limit for easier pagination
    const category = req.query.category;
    const search = req.query.search;

    let filter = {};

    if (category) {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    if (search) {
      filter.title = new RegExp(search, "i");
    }

    const totalBlogs = await Blogs.countDocuments(filter);

    const blogs = await Blogs.find(filter)
      .sort({ pubDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
      blogs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =======================
   GET BLOG BY SLUG
======================= */
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blogs.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =======================
   GET BLOG BY ID
======================= */
const getBlogsById = async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =======================
   UPLOAD HELPER (R2 or local disk)
======================= */
function getPublicBaseUrl() {
  if (process.env.BASE_URL?.trim()) {
    return process.env.BASE_URL.trim().replace(/\/$/, "");
  }
  const port = process.env.PORT || 4000;
  return `http://localhost:${port}`;
}

function hasR2Config() {
  return Boolean(
    process.env.R2_BUCKET_NAME &&
      process.env.R2_ENDPOINT &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY
  );
}

async function uploadBlogImage(file) {
  if (!file) return "";

  const safeName = file.originalname.replace(/\s+/g, "_");
  const fileName = `${Date.now()}-${safeName}`;

  if (!hasR2Config()) {
    const uploadDir = path.join(__dirname, "..", "uploads", "blogs");
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);
    return `${getPublicBaseUrl()}/uploads/blogs/${fileName}`;
  }

  const key = `${process.env.R2_UPLOAD_PREFIX || ""}${fileName}`;
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `${process.env.R2_PUBLIC_URL}/${key}`;
  } catch (error) {
    console.error("R2 Upload Error:", error);
    throw new Error("Failed to upload image to Cloudflare R2");
  }
}

/* =======================
   CREATE BLOG
======================= */
const createBlog = async (req, res) => {
  try {
    const {
      title,
      category,
      content,
      tags = [],
      metaTitle,
      metaDesc,
      focusKeyword = [],
      keywords = [],
    } = req.body;

    if (!title || !category || !content || !metaTitle || !metaDesc) {
      return res.status(400).json({
        message: "All required fields must be filled.",
      });
    }

    const slug = await generateUniqueSlug(title);
    const url = `/blogs/${slug}`;

    const imagePath = await uploadBlogImage(req.file);

    const finalKeywords =
      keywords.length > 0
        ? keywords
        : focusKeyword.length > 0
        ? focusKeyword
        : title.split(" ").slice(0, 6);

    const newBlog = new Blogs({
      title,
      slug,
      url,
      images: imagePath,
      category,
      content,
      tags,
      metaTitle,
      metaDesc,
      focusKeyword,
      keywords: finalKeywords,
      pubDate: new Date(),
    });

    const savedBlog = await newBlog.save();

    return res.status(201).json({
      success: true,
      data: savedBlog,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =======================
   UPDATE BLOG
======================= */
const updateBlog = async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    const updatedData = { ...req.body };

    if (updatedData.title && updatedData.title !== blog.title) {
      updatedData.slug = await generateUniqueSlug(updatedData.title);
      updatedData.url = `/blogs/${updatedData.slug}`;
    }

    if (req.file) {
      updatedData.images = await uploadBlogImage(req.file);
    }

    const updatedBlog = await Blogs.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );

    return res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =======================
   DELETE BLOG
======================= */
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Note: In R2/S3, we usually don't delete immediately unless necessary
    // but we can skip local fs.unlink here

    await Blogs.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =======================
   STANDALONE UPLOAD (FOR EDITOR)
======================= */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = await uploadBlogImage(req.file);
    return res.status(200).json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getBlogsById,
  updateBlog,
  deleteBlog,
  uploadImage,
};
