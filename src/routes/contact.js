import { Router } from "express";
import nodemailer from "nodemailer";

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
    // Gmail example — swap host/port/auth for any SMTP provider (SendGrid, Mailgun, etc.)
    // family: 4 forces IPv4 — some hosts (like Render) can't reach Gmail's IPv6 address
    // and fail with ENETUNREACH otherwise.
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      family: 4,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail "App Password", not your normal password
      },
    });

    await transporter.sendMail({
      from: `"Forge Athletic Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`,
    });

    res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("Email send failed:", err.message);
    res.status(500).json({ error: "Something went wrong sending your message. Please try again later." });
  }
});

export default router;
