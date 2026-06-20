// ══════════════════════════════════════════
//  CODEXUS — server.js  (Node.js backend)
//  Run: node server.js  |  Port: 3000
// ══════════════════════════════════════════

const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ══════════════════════════════════════════
//  CONTACT / ORDER API
//  POST /api/contact
//
//  ✏️ HOW TO CONFIGURE:
//  1. Set environment variables in your .env or Vercel dashboard:
//       EMAIL_USER  = your Gmail address (e.g. codexus@gmail.com)
//       EMAIL_PASS  = your Gmail App Password (NOT your login password)
//                    → Google Account → Security → App Passwords
//       EMAIL_TO    = recipient email (e.g. hello@codexus.dev)
//  2. Redeploy. Done.
// ══════════════════════════════════════════
app.post('/api/contact', async (req, res) => {
  const { name, email, package: pkg, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  // ── Email transport (nodemailer via Gmail) ──────────────
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"Codexus Orders" <${process.env.EMAIL_USER}>`,
        to:   process.env.EMAIL_TO || process.env.EMAIL_USER,
        replyTo: email,
        subject: `🛒 New Order Request – ${pkg || 'Unspecified'} Package`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0D1B2A;color:#F5F6F8;padding:32px;border-radius:12px;">
            <h2 style="color:#C9A84C;font-family:Georgia,serif;letter-spacing:2px;">CODE<span style="color:#fff">X</span>US</h2>
            <h3 style="color:#C9A84C;">New Order / Inquiry</h3>
            <table style="width:100%;border-collapse:collapse;margin-top:16px;">
              <tr><td style="padding:8px 0;color:#7A8FA6;width:100px;">Name</td><td style="color:#F5F6F8;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#7A8FA6;">Email</td><td style="color:#F5F6F8;"><a href="mailto:${email}" style="color:#C9A84C;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#7A8FA6;">Package</td><td style="color:#F5F6F8;">${pkg || 'Not selected'}</td></tr>
            </table>
            <div style="margin-top:20px;padding:16px;background:rgba(255,255,255,0.04);border-radius:8px;border-left:3px solid #C9A84C;">
              <p style="color:#7A8FA6;margin:0 0 8px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Project Description</p>
              <p style="color:#F5F6F8;line-height:1.6;margin:0;">${message || '(No description provided)'}</p>
            </div>
            <p style="margin-top:24px;color:#7A8FA6;font-size:12px;">This message was sent from the Codexus website contact form.</p>
          </div>
        `
      });

      return res.json({ success: true, message: 'Order received! We will contact you within 24 hours.' });
    } catch (err) {
      console.error('Email error:', err.message);
      return res.status(500).json({ error: 'Failed to send email. Please try WhatsApp.' });
    }
  }

  // ── Fallback: log to console if no email configured ────
  console.log('\n📬 New Contact Request:');
  console.log(`  Name:    ${name}`);
  console.log(`  Email:   ${email}`);
  console.log(`  Package: ${pkg || 'Not selected'}`);
  console.log(`  Message: ${message || '(none)'}\n`);

  return res.json({
    success: true,
    message: 'Message received (no email configured — check server logs).'
  });
});

// ── Health check ──────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Codexus API', timestamp: new Date().toISOString() });
});

// ── SPA catch-all ─────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n⚡ Codexus server running on http://localhost:${PORT}\n`);
});

module.exports = app;
