# Forge Athletic — Backend (Contact Form API)

A minimal Node.js + Express backend that receives the contact form
submission from the frontend and emails it to you via Nodemailer.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```
   - `EMAIL_USER` — your Gmail address
   - `EMAIL_PASS` — a Gmail **App Password** (not your normal password).
     Generate one at https://myaccount.google.com/apppasswords
     (requires 2-Step Verification turned on for your Google account).
   - `EMAIL_TO` — where you want form submissions delivered
   - `FRONTEND_URL` — the URL of your frontend (for CORS)

3. Run the server:
   ```bash
   npm run dev     # auto-restarts on file changes (nodemon)
   # or
   npm start       # plain node, for production
   ```

   You should see: `Forge backend running on http://localhost:5000`

4. Test it's alive: open http://localhost:5000/api/health in a browser —
   you should see `{"status":"ok"}`.

## API

**POST** `/api/contact`

Request body:
```json
{ "name": "Jane Doe", "email": "jane@example.com", "message": "Hi, I want to join." }
```

Success response (200):
```json
{ "success": true, "message": "Message sent successfully." }
```

Error response (400/500):
```json
{ "error": "Description of what went wrong" }
```

## Using a different email provider

Gmail is used here for simplicity. For production, a transactional email
service (SendGrid, Mailgun, Resend, AWS SES) is more reliable — swap the
`nodemailer.createTransport(...)` block in `src/routes/contact.js` for your
provider's SMTP settings or SDK.

## Deploying

Free options that work well for a small Express API:
- [Render](https://render.com) — connect your GitHub repo, set the env vars
  in the dashboard, deploy.
- [Railway](https://railway.app) — same idea, very fast setup.

After deploying, set `VITE_API_URL` in the **frontend's** `.env` to your
deployed backend URL (e.g. `https://forge-backend.onrender.com`) so the
contact form points at production instead of localhost.
