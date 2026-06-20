// ══════════════════════════════════════════
//  api/contact.js — Vercel Serverless Function
//  This file handles POST /api/contact on Vercel
//
//  ✏️ TO CONFIGURE EMAIL:
//  In Vercel dashboard → Project → Settings → Environment Variables, add:
//    EMAIL_USER = your Gmail (e.g. codexus@gmail.com)
//    EMAIL_PASS = Gmail App Password (Google → Security → App Passwords)
//    EMAIL_TO   = where to receive orders (e.g. hello@codexus.dev)
// ══════════════════════════════════════════

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, package: pkg, message } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      await transporter.sendMail({
        from: `"Codexus Orders" <${process.env.EMAIL_USER}>`,
        to:   process.env.EMAIL_TO || process.env.EMAIL_USER,
        replyTo: email,
        subject: `🛒 New Order – ${pkg || 'Unspecified'} Package from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;background:#0D1B2A;color:#F5F6F8;padding:32px;border-radius:12px;">
            <h2 style="color:#C9A84C;">CODEXUS – New Order Request</h2>
            <p><strong style="color:#C9A84C;">Name:</strong> ${name}</p>
            <p><strong style="color:#C9A84C;">Email:</strong> ${email}</p>
            <p><strong style="color:#C9A84C;">Package:</strong> ${pkg || 'Not selected'}</p>
            <p><strong style="color:#C9A84C;">Message:</strong> ${message || '(none)'}</p>
          </div>`
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Email failed.' });
    }
  }

  // No email configured — still return success (form won't show error)
  console.log('Contact:', { name, email, pkg, message });
  return res.status(200).json({ success: true });
};
