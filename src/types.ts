export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface SiteSettings {
  site_name: string;
  hero_title: string;
  hero_subtitle: string;
  accent_color: string;
  bg_color: string;
  seo_description: string;
  seo_keywords: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  budget: string;
  message: string;
  createdAt: string;
}
