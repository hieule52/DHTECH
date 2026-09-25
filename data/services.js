/**
 * DH TECH - Data: Services
 * Service offerings data
 */

const services = [
  {
    id: 1,
    icon: "globe",
    title: "Website Doanh Nghiệp",
    titleEn: "Business Website",
    description: "Website chuyên nghiệp giúp doanh nghiệp xây dựng hình ảnh và tăng độ tin cậy trên môi trường số.",
    features: ["Thiết kế theo brand identity", "Tối ưu UX/UI", "Responsive hoàn chỉnh", "Tích hợp CMS"],
  },
  {
    id: 2,
    icon: "shopping-bag",
    title: "Website Bán Hàng",
    titleEn: "E-commerce Website",
    description: "Giao diện tối ưu cho sản phẩm, dịch vụ và chuyển đổi khách hàng. Trải nghiệm mua hàng mượt mà.",
    features: ["Product showcase", "Tối ưu conversion", "Mobile-first", "Fast checkout"],
  },
  {
    id: 3,
    icon: "zap",
    title: "Landing Page",
    titleEn: "Landing Page",
    description: "Landing page tập trung vào chiến dịch marketing, quảng cáo và tối đa hóa tỷ lệ chuyển đổi.",
    features: ["A/B testing ready", "CTA optimization", "Load speed ưu tiên", "Analytics tích hợp"],
  },
  {
    id: 4,
    icon: "user",
    title: "Website Cá Nhân",
    titleEn: "Personal Website",
    description: "Portfolio, CV online, personal branding và website cho freelancer. Thể hiện bản sắc cá nhân.",
    features: ["Portfolio showcase", "Personal branding", "Blog integration", "SEO cá nhân"],
  },
  {
    id: 5,
    icon: "layers",
    title: "UI/UX Design",
    titleEn: "UI/UX Design",
    description: "Thiết kế giao diện hiện đại, trực quan và tối ưu trải nghiệm người dùng trên mọi thiết bị.",
    features: ["User research", "Wireframing", "Prototype", "Design system"],
  },
  {
    id: 6,
    icon: "trending-up",
    title: "SEO & Performance",
    titleEn: "SEO & Performance",
    description: "Tối ưu cấu trúc website, tốc độ tải trang và nền tảng SEO để website nổi bật trên Google.",
    features: ["On-page SEO", "Core Web Vitals", "Schema markup", "Page speed"],
  },
];

const processSteps = [
  { step: "01", title: "Discovery", desc: "Tìm hiểu nhu cầu, mục tiêu và khách hàng mục tiêu." },
  { step: "02", title: "Strategy", desc: "Xây dựng cấu trúc và định hướng thiết kế phù hợp." },
  { step: "03", title: "Design", desc: "Thiết kế UI/UX với giao diện hiện đại và trực quan." },
  { step: "04", title: "Development", desc: "Lập trình và tối ưu code, hiệu suất." },
  { step: "05", title: "Testing", desc: "Kiểm tra responsive, performance và trải nghiệm người dùng." },
  { step: "06", title: "Launch", desc: "Deploy website và bàn giao dự án hoàn chỉnh." },
];

const reasons = [
  { icon: "palette", title: "Creative Design", desc: "Thiết kế có cá tính riêng, không dùng template đại trà." },
  { icon: "cpu", title: "Modern Technology", desc: "Sử dụng công nghệ web hiện đại, tối ưu cho tương lai." },
  { icon: "smartphone", title: "Responsive", desc: "Website hoạt động hoàn hảo trên mọi thiết bị." },
  { icon: "search", title: "SEO Ready", desc: "Cấu trúc website được xây dựng chuẩn SEO từ đầu." },
  { icon: "activity", title: "High Performance", desc: "Ưu tiên tốc độ tải trang và Core Web Vitals." },
  { icon: "message-circle", title: "Direct Support", desc: "Làm việc trực tiếp với đội ngũ DH TECH." },
];

module.exports = { services, processSteps, reasons };
