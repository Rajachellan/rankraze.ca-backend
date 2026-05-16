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
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newForm = new Form({
      name,
      email,
      phone,
      subject,
      message,
    });

    await newForm.save();
    // sendToTeams(newForm);

    res
      .status(201)
      .json({ success: true, message: "Form saved" });
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { createForm };
