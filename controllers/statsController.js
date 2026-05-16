const Form = require("../models/formSchema");
const Blogs = require("../models/blogSchema");
const JobApply = require("../models/jobapplySchema");

async function getStats(req, res) {
  try {
    const { month, year } = req.query;
    
    const now = new Date();
    const targetMonth = month ? parseInt(month) : now.getMonth(); // 0-indexed
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

    console.log(`📊 Fetching stats for Filter: ${targetMonth + 1}/${targetYear} (Range: ${startOfMonth.toISOString()} to ${endOfMonth.toISOString()})`);

    const [formLeadsThisMonth, jobLeadsThisMonth] = await Promise.all([
      Form.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      JobApply.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } })
    ]);

    const leadsThisMonth = formLeadsThisMonth + jobLeadsThisMonth;

    const [totalForms, totalJobApps] = await Promise.all([
      Form.countDocuments({}),
      JobApply.countDocuments({})
    ]);

    const totalLeads = totalForms + totalJobApps;

    const blogsThisMonth = await Blogs.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalBlogs = await Blogs.countDocuments({});

    console.log(`✅ Stats fetched: ${leadsThisMonth} monthly leads / ${totalLeads} total leads`);

    res.status(200).json({
      success: true,
      data: {
        leadsThisMonth,
        totalLeads,
        blogsThisMonth,
        totalBlogs,
        month: startOfMonth.toLocaleString('default', { month: 'long' }),
        year: startOfMonth.getFullYear()
      }
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

module.exports = { getStats };
