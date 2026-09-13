import { Router } from "express";

const router = Router();

// POST /api/contact  { name, email, message }
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // Basic server-side validation (never trust the frontend alone)
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "Name, email, and message are all required." });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  try {
    // Using Resend's HTTPS API instead of SMTP — many free hosts (including
    // Render's free tier) block outbound SMTP ports, but a plain HTTPS
    // request like this always goes through.
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Forge Athletic Website <onboarding@resend.dev>",
        to: [process.env.EMAIL_TO],
        reply_to: email,
        subject: `New contact form message from ${name}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Resend API error: ${response.status} ${errorBody}`);
    }

    res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("Email send failed:", err.message);
    res.status(500).json({ error: "Something went wrong sending your message. Please try again later." });
  }
});

export default router;
