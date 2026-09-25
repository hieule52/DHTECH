# DH TECH — Website Design & Digital Solutions Studio

> **"Build Your Digital Presence."**  
> Website chính thức của thương hiệu **DH TECH** — Studio chuyên thiết kế, phát triển website và giải pháp số cao cấp.

---

## 🚀 Giới Thiệu

DH TECH là studio công nghệ & thiết kế website chuyên nghiệp, đồng hành cùng doanh nghiệp và cá nhân trong việc xây dựng hình ảnh thương hiệu số hiện đại, khác biệt và tối ưu chuyển đổi.

- **Founder**: [Lê Diên Hiếu](https://ledienhieu.vercel.app)
- **Hotline**: `0328 821 260`
- **Email**: `lehieu2026.in@gmail.com`
- **GitHub**: [github.com/hieule52](https://github.com/hieule52)
- **TikTok**: [@dhtech68](https://www.tiktok.com/@dhtech68)
- **Website**: [dhtech.io.vn](https://dhtech.io.vn)

---

## 🛠️ Công Nghệ Sử Dụng

- **Backend**: Node.js, Express.js
- **Bảo mật & Tối ưu**:
  - `helmet`: Tăng cường bảo mật HTTP headers, CSP (Content Security Policy)
  - `compression`: Nén Gzip / Brotli cho toàn bộ assets & responses
  - `express-rate-limit`: Giới hạn tần suất request (anti-DDoS, chống spam contact form)
  - `nodemailer`: Xử lý gửi email thông báo tự động khi có khách hàng gửi yêu cầu tư vấn
  - `dotenv`: Quản lý biến môi trường
- **Frontend**:
  - **HTML5 Semantic**: Cấu trúc chuẩn SEO, schema JSON-LD, đầy đủ meta tags Open Graph & Twitter Cards.
  - **CSS3 Design System**: Kiến trúc 3 tầng (Primitive -> Semantic -> Component tokens), Dark Mode Glassmorphism cao cấp, hiệu ứng ánh sáng gradient, responsive 100% mọi màn hình.
  - **Vanilla JavaScript**: Tối ưu hiệu suất, Intersection Observer trigger micro-animations, lazy loading, form validation & real-time feedback, counter animations.

---

## 📂 Cấu Trúc Dự Án

```
DHTech/
├── .agents/skills/          # Hướng dẫn quy chuẩn Design System & UI/UX
├── data/
│   ├── projects.js          # Dữ liệu portfolio & case studies
│   └── services.js          # Dữ liệu dịch vụ, bảng giá & tính năng
├── public/
│   ├── css/
│   │   ├── reset.css        # Modern CSS Reset
│   │   ├── variables.css    # Design System Tokens (Color, Font, Space, Glow)
│   │   ├── components.css   # Buttons, Cards, Badges, Modals, Forms
│   │   └── main.css         # Bố cục các section, keyframes & responsive
│   ├── images/              # Assets hình ảnh, logo, ảnh dự án thực tế
│   └── js/
│       └── main.js          # Interaction, Validation, Scroll & Fetch API
├── views/
│   └── index.html           # Semantic Single Page Application
├── .env.example             # File mẫu biến môi trường
├── package.json             # Khai báo dependencies & scripts
├── robots.txt               # Cấu hình crawler SEO
├── server.js                # Express Application Server
└── sitemap.xml              # Bản đồ website XML
```

---

## 🎨 Thiết Kế & Design System

- **Màu sắc chủ đạo**:
  - `Electric Blue` (`#3B82F6`) — Công nghệ, hiện đại, uy tín
  - `Cyan Accent` (`#06B6D4` / `#22D3EE`) — Tương lai, đột phá, linh hoạt
  - `Dark Background` (`#080B0F` - `#0D1117`) — Chiều sâu không gian số cao cấp
  - `Glassmorphism Card`: Nền xuyên thấu `rgba(255, 255, 255, 0.03)` kết hợp viền sáng `border: 1px solid rgba(255, 255, 255, 0.08)`
- **Typography**: Phông chữ `Plus Jakarta Sans` kết hợp `Inter` tạo cảm giác hiện đại và tinh tế.

---

## 📋 Danh Sách Section

1. **Header / Navbar**: Logo thương hiệu, menu điều hướng mượt mà, nút CTA, menu mobile.
2. **Hero Section**: Slogan mạnh mẽ, badge trạng thái, số liệu ấn tượng, floating badges.
3. **About Section**: Tầm nhìn, sứ mệnh, giá trị cốt lõi và chân dung Founder Lê Diên Hiếu.
4. **Services Section**: 6 gói dịch vụ (Website Doanh nghiệp, Bán hàng, Landing Page, UI/UX, SEO & Performance, Bảo trì).
5. **Process Section**: Quy trình làm việc 5 bước chuyên nghiệp (Khám phá -> Thiết kế -> Lập trình -> Kiểm thử -> Bàn giao).
6. **Portfolio Section**: Các dự án tiêu biểu (Nhat Jewelry, Tiến Quốc Auto Spa, POS Quán Nhậu, AI HUB, v.v.).
7. **Experiments & Labs**: Các dự án nghiên cứu & sản phẩm công nghệ sáng tạo.
8. **Why Choose Us**: 6 lý do khách hàng tin chọn DH TECH (Code sạch, chuẩn SEO, tốc độ cao, hỗ trợ 24/7).
9. **Pricing Section**: Bảng giá trong suốt 3 gói (Starter, Professional, Enterprise) kèm tab chuyển đổi.
10. **CTA Section**: Kêu gọi hành động ấn tượng, thôi thúc bắt đầu dự án.
11. **Contact Section**: Form liên hệ thông minh có xác thực dữ liệu, tích hợp API & gửi mail trực tiếp.
12. **Footer**: Thông tin liên hệ đầy đủ, liên kết mạng xã hội, bản quyền & sitemap links.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Thiết lập biến môi trường
Tạo file `.env` từ file `.env.example`:
```env
PORT=3000
NODE_ENV=development

# Cấu hình SMTP gửi mail liên hệ (Tùy chọn)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CONTACT_EMAIL=lehieu2026.in@gmail.com
```

### 3. Chạy ứng dụng
- **Chế độ phát triển (auto-reload)**:
  ```bash
  npm run dev
  ```
- **Chế độ production**:
  ```bash
  npm start
  ```

Truy cập website tại: [http://localhost:3000](http://localhost:3000)

---

## 🔍 Tối Ưu SEO & Tốc Độ

- Tối ưu thẻ meta Open Graph (Facebook/Zalo) & Twitter Cards.
- Schema Structured Data `Organization`, `WebSite`, `LocalBusiness` chuẩn JSON-LD.
- Endpoint `/sitemap.xml` và `/robots.txt` tự động phục vụ crawler Google / Bing.
- Compression Gzip và bộ nhớ cache trình duyệt tối ưu điểm số Google Lighthouse.

---

© 2026 **DH TECH**. All rights reserved. Crafted by [Lê Diên Hiếu](https://ledienhieu.vercel.app).
