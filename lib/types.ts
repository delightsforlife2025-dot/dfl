// Database types
export interface Page {
  id: string;
  slug: string;
  title: string;
  content: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  position: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

/** Stored JSON in `site_settings` for key `contact_info` */
export interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
}

/** Home featured dish card (CMS or fallback) */
export interface FeaturedDishCard {
  image: string;
  title: string;
  description: string;
  price?: number;
}

/** `site_settings` key `general_settings` */
export interface GeneralSiteSettings {
  site_name?: string;
  logo_url?: string;
  favicon_url?: string;
  site_tagline?: string;
}

export function asGeneralSiteSettings(v: unknown): GeneralSiteSettings | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  return v as GeneralSiteSettings;
}

export function asContactInfo(v: unknown): ContactInfo | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  return v as ContactInfo;
}

export interface ContactMessage {
  id: string;
  name?: string;
  email: string;
  subject?: string;
  message: string;
  ip?: string;
  user_agent?: string;
  handled: boolean;
  created_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  position: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id?: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  image_url?: string;
  images?: string[]; // Array of image URLs for product gallery
  youtube_url?: string;
  ingredients?: string[];
  allergens?: string[];
  tags?: string[];
  is_available: boolean;
  is_featured: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_image_url?: string;
  comment_text: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}
