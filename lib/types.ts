// Database types
export interface Page {
  id: string;
  slug: string;
  title: string;
  content: Record<string, any>;
  metadata?: Record<string, any>;
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
  value: Record<string, any>;
  updated_at: string;
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
