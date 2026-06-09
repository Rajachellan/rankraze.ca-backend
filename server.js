const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const connectDB = require("./config.js/db");
const formRouter = require("./routes/formRoutes");
const jobApplyRouter = require("./routes/jobApplyRoute");
const jobPostRouter = require("./routes/jobPostRoutes");
const blogRouter = require("./routes/blogRoutes");
const authRouter = require("./routes/authRoutes");
const statsRouter = require("./routes/statsRoutes");
const adminUserRouter = require("./routes/adminUserRoutes");

//WEBSITE PORTFOLIO ROUTES
const websiteportfolioRoutes=require('./routes/websitePortfolioRoutes.js')

//SOCIAL MEDIA PORTFOLIO ROUTER
const socialMediaPortfolioRouter=require('./routes/socialMediaPortfolioRoute.js')

const mongoose = require("mongoose");

const app = express();

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: [
      "https://admin.rankraze.com",
      "https://development.rankraze.com",
      "https://api.rankraze.com",
      "https://api.rankraze.us",
      "https://rankraze.us",
      "https://www.rankraze.us",
      "https://api.rankraze.ca",
      "https://rankraze.ca",
      "https://www.rankraze.ca",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:4000",
      "https://stage.rankraze.com",
      "https://rankraze.com",
      "https://www.rankraze.com",
      "https://www.rankraze.in",
      "https://rankraze.in"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected 🟢" : "Disconnected 🔴";
  res.status(200).json({
    message: "App is running ✅",
    database: dbStatus
  });
});

// TO SEE IMAGES ON FRONTEND
app.use("/api/wbUploads", express.static(path.join(__dirname,"/wbUpload")));
app.use("/api/smUploads", express.static(path.join(__dirname,"/smUpload")));

app.use("/api", formRouter);
app.use("/api", jobApplyRouter);
app.use("/api", jobPostRouter);
app.use("/api", blogRouter);
app.use("/api", statsRouter);
app.use("/api", adminUserRouter);
app.use("/api/auth", authRouter);
app.use("/api", websiteportfolioRoutes);
app.use('/api',socialMediaPortfolioRouter)


// Webhook URL is currently not needed
// console.log("Loaded webhook URL:", process.env.TEAMS_WEBHOOK_URL_CAREERS);

startServer();
