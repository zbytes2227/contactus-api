// pages/api/contactus.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { name, email, phone, message, category } = req.body;

  // === Validation ===
  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Name is required and must be at least 2 characters.",
    });
  }

  if (!email && !phone) {
    return res.status(400).json({
      success: false,
      message: "Either email or phone number is required.",
    });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format." });
  }

  if (phone && !/^\d{7,15}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Phone number must be 7 to 15 digits.",
    });
  }

  if (!message || message.trim().length < 10 || message.trim().length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Message must be between 10 and 1000 characters.",
    });
  }

  // === Prepare data to send to Google Apps Script ===
  const payload = {
    name,
    email: email || "",
    phone: phone || "",
    message,
    category: category || "General",
  };

  try {
    const scriptResponse = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!scriptResponse.ok) {
      throw new Error("Failed to submit to Google Sheets");
    }

    return res.status(200).json({
      success: true,
      message: `📬 We’ve received your message. Our team will contact you within 1 business day.`,
    });
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}
