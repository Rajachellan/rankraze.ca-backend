const Form = require("../models/formSchema");

async function sendToTeams(formData) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;

  if (!webhookUrl) return console.error("TEAMS_WEBHOOK_URL not set");

  const payload = {
    text: `📩 **New Contact-Form Submission**\n
**Name:** ${formData.name}\n
**Email:** ${formData.email}\n
**Subject:** ${formData.subject || "N/A"}\n
**phone:** ${formData.phone}\n
**Created On:** ${new Date(formData.createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    })}\n
**Message:** ${formData.message || "N/A"}`,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(res.statusText);
    console.log("✅ Notification sent to Teams");
  } catch (err) {
    console.error("❌ Failed to send to Teams:", err);
  }
}

async function createForm(req, res) {
  try {
    const { name, email, phone, subject, message, source } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newForm = new Form({
      name,
      email,
      phone,
      subject,
      message,
      source: source || "unknown",
    });

    await newForm.save();
    console.log(
      `📩 New lead saved: ${newForm.name} (${newForm.email}) from ${newForm.source} [${newForm._id}]`
    );
    // sendToTeams(newForm);

    res
      .status(201)
      .json({ success: true, message: "Form saved", data: { id: newForm._id } });
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function getForms(req, res) {
  try {
    let { page = 1, limit = 20, search, month, year } = req.query;

    page = Number(page);
    limit = Math.min(Number(limit), 100);

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { source: { $regex: search, $options: "i" } },
      ];
    }

    if (month !== undefined && year !== undefined) {
      const targetMonth = parseInt(month);
      const targetYear = parseInt(year);
      const startOfMonth = new Date(targetYear, targetMonth, 1);
      const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);
      filter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Form.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Form.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { createForm, getForms };
