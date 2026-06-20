# CODEXUS — Website Setup & Editing Guide

## 📁 Project Structure
```
codexus/
├── index.html         ← Main webpage (edit content here)
├── style.css          ← All styling/colors
├── app.js             ← Frontend behaviour
├── api/
│   └── contact.js     ← Contact form backend (Vercel serverless function)
├── server.js          ← Local Node.js server (for running locally only)
├── package.json
├── vercel.json        ← Vercel config (intentionally minimal — see note below)
└── README.md          ← This file
```

> **Why are the HTML/CSS/JS files at the root and not in a `public/` folder?**
> Vercel automatically serves static files from the project root and automatically
> turns any file inside the `api/` folder into a serverless function. Keeping this
> layout means **no routing config is needed** — `index.html` is served at `/` and
> the form endpoint lives at `/api/contact` with zero extra setup. The old `public/`
> + `builds`/`routes` setup is what caused the `404: NOT_FOUND` error.

---

## ✏️ HOW TO EDIT CONTENT

All editable fields are marked with `<!-- ✏️ EDIT -->` comments in `index.html`.

### 1. Team / Creators
Search for `EDIT CREATOR 1` and `EDIT CREATOR 2` in `index.html`. Update:
- **Name** – change the `<h3 class="team-name">` text
- **Role** – change the `<p class="team-role">` text
- **Location** – change the `<p class="team-location">` text
- **Bio** – change the `<p class="team-bio">` paragraph
- **Email** – change the `href="mailto:..."` and the display text
- **Initials** – change the `<span class="avatar-initials">` (e.g. `AK`)

### 2. Company Info
Search for `EDIT: Update the company description` to change the About section text.
Change the founding year in the `<p class="about-year">` tag.

### 3. Contact Details
- **WhatsApp**: Find `wa.me/254700000000` and replace `254700000000` with your number (country code + number, no spaces/+)
- **Email**: Find `hello@codexus.dev` and replace with your real email

### 4. Adding/Removing Projects
In `index.html`, find the `<!-- ✏️ PROJECT CARD` comments:
- **Completed project**: Copy a `<div class="project-card completed">` block, paste inside `#completed-list`, edit title/desc/tags/date
- **Pending project**: Copy a `<div class="project-card pending">` block, paste inside `#pending-list`, edit similarly
- **Remove**: Simply delete the whole `<div class="project-card ...">...</div>` block

### 5. Colors & Branding (style.css)
At the top of `style.css`, the `:root` block contains all color tokens:
```css
--navy:  #0D1B2A   /* dark background */
--gold:  #C9A84C   /* accent color    */
```
Change these to rebrand the entire site instantly.

---

## 🚀 DEPLOYMENT ON VERCEL

### Quick Deploy
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Leave all build settings as their defaults (Framework Preset: **Other**, no build command, no output directory). Click **Deploy**
4. Done! Your site is live at `/`, and the form posts to `/api/contact`.

### Set Up Email (for the contact form)
In Vercel dashboard → Your Project → **Settings → Environment Variables**, add:

| Variable     | Value                          |
|-------------|-------------------------------|
| EMAIL_USER   | your Gmail address             |
| EMAIL_PASS   | Gmail App Password*            |
| EMAIL_TO     | email where orders go to       |

*Get Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords

Redeploy after adding the variables (Deployments tab → ⋯ → Redeploy).

---

## 💻 RUNNING LOCALLY

```bash
# Install dependencies
npm install

# Start server
npm start

# Visit http://localhost:3000
```

---

## 📦 PACKAGES (to change descriptions/delivery times)
Search for the package name in `index.html` (e.g. `Bronze`, `Silver`, `Gold`) and edit:
- `<p class="package-desc">` — description paragraph
- `<strong>3 Days</strong>` — delivery time
- `<li>` items in `<ul class="package-features">` — feature list

---

## 💬 WhatsApp Order Fallback
If the email is not configured, the contact form will automatically open WhatsApp with a pre-filled message when submitted. Make sure the WhatsApp number in `app.js` matches the one in `index.html`.

---

Built by Codexus 🖤 | Powered by AI + Code
