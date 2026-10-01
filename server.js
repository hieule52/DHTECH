/**
 * DH TECH — Express Server
 * Web Design & Digital Solutions Studio
 * ============================================
 */

'use strict';

require('dotenv').config();

const express    = require('express');
const helmet     = require('helmet');
const compression= require('compression');
const rateLimit  = require('express-rate-limit');
const nodemailer = require('nodemailer');
const path       = require('path');
const fs         = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = NODE_ENV === 'development';

/* ============================================================
   SECURITY MIDDLEWARE
   ============================================================ */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'", "'unsafe-inline'"],  // for inline defer scripts
      styleSrc:       ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:        ["'self'", "https://fonts.gstatic.com"],
      imgSrc:         ["'self'", "data:", "https:"],
      connectSrc:     ["'self'"],
      frameSrc:       ["'none'"],
      objectSrc:      ["'none'"],
      upgradeInsecureRequests: isDev ? [] : [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

/* ============================================================
   COMPRESSION
   ============================================================ */
app.use(compression());

/* ============================================================
   RATE LIMITING
   ============================================================ */
// General rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      200,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' },
});

// Strict rate limit for contact API (anti-spam)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max:      10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 giờ.' },
});

app.use(generalLimiter);

/* ============================================================
   BODY PARSER
   ============================================================ */
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));

/* ============================================================
   STATIC FILES with cache headers
   ============================================================ */
const staticOptions = {
  maxAge: isDev ? 0 : '7d',
  etag:   true,
  lastModified: true,
};

app.use(express.static(path.join(__dirname, 'public'), staticOptions));

/* ============================================================
   NODEMAILER TRANSPORTER (lazy init)
   ============================================================ */
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const smtpUser = (process.env.SMTP_USER || '').trim();
  const smtpPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

  if (!smtpUser || !smtpPass) {
    console.warn('[DH TECH] SMTP credentials not configured. Email sending is disabled.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
}

/* ============================================================
   INPUT SANITIZER (simple, no extra deps)
   ============================================================ */
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#x60;')
    .slice(0, 2000); // max length
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   ROUTES
   ============================================================ */

/* --- HOME --- */
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'views', 'index.html');
  res.sendFile(htmlPath, err => {
    if (err) {
      console.error('[DH TECH] Error serving index.html:', err.message);
      res.status(500).send('Internal Server Error');
    }
  });
});

/* --- CONTACT API --- */
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const {
      name, email, phone,
      websiteType, budget, message
    } = req.body;

    // --- Server-side validation ---
    const errors = [];

    const cleanName    = sanitize(name);
    const cleanEmail   = sanitize(email);
    const cleanPhone   = sanitize(phone || '');
    const cleanType    = sanitize(websiteType);
    const cleanBudget  = sanitize(budget || '');
    const cleanMessage = sanitize(message);

    if (!cleanName || cleanName.length < 2) {
      errors.push('Tên không hợp lệ (tối thiểu 2 ký tự).');
    }
    if (!cleanEmail || !validateEmail(cleanEmail)) {
      errors.push('Email không hợp lệ.');
    }
    if (!cleanType) {
      errors.push('Vui lòng chọn loại website.');
    }
    if (!cleanMessage || cleanMessage.length < 10) {
      errors.push('Mô tả dự án quá ngắn (tối thiểu 10 ký tự).');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(' '),
      });
    }

    // --- Email content ---
    const recipientEmail = process.env.CONTACT_EMAIL || 'lehieu2026.in@gmail.com';
    const websiteTypeLabels = {
      business:  'Website Doanh nghiệp',
      ecommerce: 'Website Bán hàng',
      landing:   'Landing Page',
      personal:  'Website Cá nhân / Portfolio',
      uiux:      'UI/UX Design',
      seo:       'SEO & Performance',
      other:     'Khác',
    };
    const budgetLabels = {
      'under-5m':  'Dưới 5 triệu',
      '5-10m':     '5 – 10 triệu',
      '10-20m':    '10 – 20 triệu',
      '20-50m':    '20 – 50 triệu',
      'over-50m':  'Trên 50 triệu',
      'discuss':   'Thảo luận trực tiếp',
    };

    const typeDisplay = websiteTypeLabels[cleanType] || cleanType;
    const budgetDisplay = budgetLabels[cleanBudget] || cleanBudget || 'Thảo luận trực tiếp';

    const textBody = `==============================
YÊU CẦU DỰ ÁN MỚI - DH TECH
==============================

Họ và tên:
${cleanName}

Email:
${cleanEmail}

Số điện thoại:
${cleanPhone || 'Chưa cung cấp'}

Loại website:
${typeDisplay}

Ngân sách dự kiến:
${budgetDisplay}

Mô tả dự án:
${cleanMessage}

==============================
DH TECH
Build Your Digital Presence.
==============================`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 28px 16px; color: #1E293B; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0; }
    .header { background: linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #06B6D4 100%); padding: 32px 28px; color: #FFFFFF; text-align: left; }
    .header-logo { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
    .header-tagline { font-size: 13px; opacity: 0.9; margin: 0; }
    .content { padding: 32px 28px; }
    .intro { font-size: 15px; color: #475569; margin-top: 0; margin-bottom: 24px; line-height: 1.6; }
    .field-card { background: #F8FAFC; border-radius: 10px; border: 1px solid #F1F5F9; padding: 14px 18px; margin-bottom: 12px; }
    .field-label { font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
    .field-value { font-size: 15px; font-weight: 600; color: #0F172A; line-height: 1.5; }
    .field-value a { color: #2563EB; text-decoration: none; }
    .message-box { background: #F8FAFC; border-left: 4px solid #2563EB; border-radius: 4px 10px 10px 4px; padding: 18px; margin-top: 16px; }
    .message-text { font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-wrap; margin-top: 6px; }
    .footer { padding: 24px 28px; background: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #64748B; line-height: 1.6; }
    .footer strong { color: #0F172A; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">DH TECH</div>
      <p class="header-tagline">Yêu Cầu Tư Vấn Website Mới</p>
    </div>
    <div class="content">
      <p class="intro">Bạn nhận được một yêu cầu tư vấn dự án mới từ form liên hệ trên website <strong>DH TECH</strong>.</p>
      
      <div class="field-card">
        <div class="field-label">Họ và tên</div>
        <div class="field-value">${cleanName}</div>
      </div>
      
      <div class="field-card">
        <div class="field-label">Email liên hệ</div>
        <div class="field-value"><a href="mailto:${cleanEmail}">${cleanEmail}</a></div>
      </div>
      
      ${cleanPhone ? `
      <div class="field-card">
        <div class="field-label">Số điện thoại</div>
        <div class="field-value"><a href="tel:${cleanPhone}">${cleanPhone}</a></div>
      </div>` : ''}
      
      <div class="field-card">
        <div class="field-label">Loại website</div>
        <div class="field-value">${typeDisplay}</div>
      </div>
      
      <div class="field-card">
        <div class="field-label">Ngân sách dự kiến</div>
        <div class="field-value">${budgetDisplay}</div>
      </div>
      
      <div class="message-box">
        <div class="field-label">Mô tả dự án</div>
        <div class="message-text">${cleanMessage}</div>
      </div>
    </div>
    <div class="footer">
      <strong>DH TECH Studio</strong> · Build Your Digital Presence.<br />
      Email: ${recipientEmail} · Hotline: 0328 821 260
    </div>
  </div>
</body>
</html>`;

    // --- Send email if SMTP configured ---
    const mailer = getTransporter();
    if (mailer) {
      await mailer.sendMail({
        from:    `"DH TECH Website" <${process.env.SMTP_USER}>`,
        to:      recipientEmail,
        replyTo: cleanEmail,
        subject: `[DH TECH] Yêu cầu tư vấn website mới — ${cleanName}`,
        text:    textBody,
        html:    htmlBody,
      });

      console.log(`[DH TECH] Email sent successfully to ${recipientEmail} from ${cleanEmail}`);
    } else {
      console.warn('[DH TECH] SMTP not configured. Request logged locally:');
      console.log({ name: cleanName, email: cleanEmail, type: typeDisplay });
    }

    return res.status(200).json({
      success: true,
      message: 'Gửi yêu cầu thành công! DH TECH sẽ liên hệ với bạn trong thời gian sớm nhất.',
    });

  } catch (err) {
    // Only log server error, never leak details to client
    console.error('[DH TECH] Contact API internal error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Không thể gửi yêu cầu. Vui lòng thử lại hoặc liên hệ trực tiếp với DH TECH.',
    });
  }
});

/* --- ROBOTS.TXT --- */
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  const robotsPath = path.join(__dirname, 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.sendFile(robotsPath);
  } else {
    res.send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://dhtech.io.vn/sitemap.xml`);
  }
});

/* --- SITEMAP.XML --- */
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.sendFile(sitemapPath);
  } else {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dhtech.io.vn/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    res.send(sitemap);
  }
});

/* ============================================================
   ERROR HANDLERS
   ============================================================ */
// 404
app.use((req, res) => {
  res.status(404).send(`
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 — DH TECH</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #080B0F;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 24px;
    }
    h1 { font-size: 6rem; font-weight: 800; background: linear-gradient(135deg, #3B82F6, #22D3EE); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    p  { color: #6C757D; margin: 16px 0 32px; font-size: 1.125rem; }
    a  {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 28px;
      background: linear-gradient(135deg, #3B82F6, #06B6D4);
      color: white; text-decoration: none;
      border-radius: 8px; font-weight: 600;
      transition: opacity 0.2s;
    }
    a:hover { opacity: 0.85; }
  </style>
</head>
<body>
  <div>
    <h1>404</h1>
    <p>Trang không tồn tại.</p>
    <a href="/">← Về trang chủ DH TECH</a>
  </div>
</body>
</html>`);
});

// 500
app.use((err, req, res, next) => {
  console.error('[DH TECH] Server error:', err.message);
  res.status(500).send(`
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>500 — DH TECH</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      background: #080B0F; color: #fff;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; text-align: center; padding: 24px;
    }
    h1 { font-size: 5rem; font-weight: 800; color: #3B82F6; }
    p  { color: #6C757D; margin: 16px 0 32px; }
    a  { color: #3B82F6; text-decoration: underline; }
  </style>
</head>
<body>
  <div>
    <h1>500</h1>
    <p>Có lỗi xảy ra. Vui lòng thử lại.</p>
    <a href="/">← Về trang chủ</a>
  </div>
</body>
</html>`);
});

/* ============================================================
   START SERVER
   ============================================================ */
app.listen(PORT, () => {
  console.log('\n  ╔══════════════════════════════════════╗');
  console.log('  ║         DH TECH — Server Ready        ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log(`\n  🌐 http://localhost:${PORT}`);
  console.log(`  ⚙️  Environment: ${NODE_ENV}`);
  console.log(`  📧 SMTP: ${process.env.SMTP_USER ? 'Configured' : 'Not configured (contact form will log only)'}`);
  console.log('\n  Build Your Digital Presence.\n');
});

module.exports = app;
