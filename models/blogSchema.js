const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // This is the SAME as frontend canonical URL
    url: { type: String, required: true },

    images: { type: String, default: "" },
    ogImage: { type: String, default: "" },

    category: {
      type: String,
      required: true,
      enum: [
        "Digital Marketing",
        "Digital Marketing Service",
        "Web Services",
        "Branding",
        "Video Productions",
        "Extended Reality",
        "AI Services",
        "Software Development",
        "React JS Development Company",
      ],
    },

    content: { type: String, required: true },

    tags: { type: [String], default: [] },
    keywords: { type: [String], required: true },
    focusKeyword: { type: [String], required: true },

    metaTitle: { type: String, default: "" },
    metaDesc: { type: String, default: "" },

    status: {
      type: String,
      enum: ["draft", "publish", "private"],
      default: "publish",
    },

    pubDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Us-Blogs", blogSchema);
