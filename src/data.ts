import { PortfolioItem, SiteSettings } from './types';

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  { id: 1, title: "Modern Tech Logo", category: "Technology", imageUrl: "https://picsum.photos/seed/tech1/800/600", description: "A sleek, minimalist logo for a software startup." },
  { id: 2, title: "Organic Cafe Branding", category: "Food & Beverage", imageUrl: "https://picsum.photos/seed/cafe1/800/600", description: "Warm and inviting brand identity for a local coffee shop." },
  { id: 3, title: "Luxury Fashion Mark", category: "Fashion", imageUrl: "https://picsum.photos/seed/fashion1/800/600", description: "Elegant and high-end logo design for a boutique brand." },
  { id: 4, title: "Creative Studio Identity", category: "Creative", imageUrl: "https://picsum.photos/seed/studio1/800/600", description: "Bold and vibrant identity for a design collective." },
  { id: 5, title: "Eco-Friendly Product Logo", category: "Sustainability", imageUrl: "https://picsum.photos/seed/eco1/800/600", description: "Nature-inspired branding for sustainable products." },
  { id: 6, title: "Fitness App Icon", category: "Health", imageUrl: "https://picsum.photos/seed/fitness1/800/600", description: "Dynamic and energetic visual identity for a fitness platform." }
];

export const INITIAL_SETTINGS: SiteSettings = {
  site_name: "로고픽 (LogoPick)",
  hero_title: "당신의 브랜드를 완성하는 단 하나의 로고",
  hero_subtitle: "세련된 감각과 전문성으로 소상공인과 크리에이터의 가치를 시각화합니다.",
  accent_color: "#D4AF37",
  bg_color: "#0A192F",
  seo_description: "로고픽 - 프리미엄 로고 및 브랜드 아이덴티티 디자인 서비스",
  seo_keywords: "로고제작, 브랜딩, 디자인, 소상공인로고, 스타트업로고"
};
