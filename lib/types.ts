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

function firstNonEmptyString(o: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const val = o[k];
    if (typeof val === "string") {
      const t = val.trim();
      if (t) return t;
    }
  }
  return undefined;
}

/** Normalize dashboard / legacy shapes (snake_case, camelCase, double-encoded JSON). */
export function asGeneralSiteSettings(v: unknown): GeneralSiteSettings | null {
  let raw: unknown = v;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const site_name = firstNonEmptyString(o, "site_name", "siteName");
  const site_tagline = firstNonEmptyString(o, "site_tagline", "siteTagline");
  const logo_url = firstNonEmptyString(o, "logo_url", "logoUrl");
  const favicon_url = firstNonEmptyString(o, "favicon_url", "faviconUrl");
  const out: GeneralSiteSettings = {};
  if (site_name) out.site_name = site_name;
  if (site_tagline) out.site_tagline = site_tagline;
  if (logo_url) out.logo_url = logo_url;
  if (favicon_url) out.favicon_url = favicon_url;
  return out;
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
