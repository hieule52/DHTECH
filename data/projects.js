/**
 * DH TECH - Data: Projects
 * Portfolio projects data
 */

const projects = [
  {
    id: 1,
    title: "Nhật Jewelry",
    category: "E-commerce Website",
    categoryVi: "Website Thương mại",
    description: "Website giới thiệu và thương mại cho thương hiệu trang sức với giao diện hiện đại và tập trung vào hình ảnh sản phẩm.",
    image: "/images/NhatJewerly.png",
    url: "https://nhat-jewerly.vercel.app/",
    tags: ["UI/UX", "E-commerce", "Responsive"],
    featured: true,
  },
  {
    id: 2,
    title: "Tiến Quốc Auto Spa",
    category: "Business Website",
    categoryVi: "Website Doanh nghiệp",
    description: "Website dịch vụ chăm sóc xe hơi chuyên nghiệp, tập trung vào chuyển đổi khách hàng.",
    image: "/images/TienQuocAutoSpa.png",
    url: "https://tienquoc-autospa.vercel.app/",
    tags: ["Business", "Service", "SEO"],
    featured: true,
  },
];

const experiments = [
  {
    id: 3,
    title: "AI Study Hub",
    category: "AI Platform",
    categoryVi: "Nền tảng AI",
    description: "Nền tảng học tập tích hợp AI, hỗ trợ sinh viên và người học trong việc tiếp cận tài nguyên học tập thông minh.",
    image: "/images/AIHUB.png",
    url: "https://github.com/hieule52/ai-study-hub-v2",
    isGithub: true,
    tags: ["AI", "Education", "React"],
  },
  {
    id: 4,
    title: "GionQuan",
    category: "POS System",
    categoryVi: "Hệ thống quản lý",
    description: "Ứng dụng quản lý quán nhậu và điểm bán hàng, tối ưu quy trình vận hành.",
    image: "/images/posQuanNhau.png",
    url: "https://github.com/hieule52/GionQuan",
    isGithub: true,
    tags: ["POS", "Management", "Node.js"],
  },
];

module.exports = { projects, experiments };
