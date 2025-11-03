import { supabase } from './supabaseClient';
import type { Page, NavItem, SocialLink, SiteSetting, MenuItem, MenuCategory } from './types';

// Fetch page by slug
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error(`Error fetching page "${slug}":`, error);
    return null;
  }

  return data;
}

// Fetch all menu categories
export async function getMenuCategories(): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('visible', true)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching menu categories:', error);
    return [];
  }

  return data || [];
}

// Fetch all menu items with optional category filter
export async function getMenuItems(categoryId?: string): Promise<MenuItem[]> {
  let query = supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('position', { ascending: true });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }

  return data || [];
}

// Fetch featured menu items
export async function getFeaturedMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_featured', true)
    .eq('is_available', true)
    .order('position', { ascending: true })
    .limit(6);

  if (error) {
    console.error('Error fetching featured menu items:', error);
    return [];
  }

  return data || [];
}

// Fetch menu item by slug
export async function getMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('slug', slug)
    .eq('is_available', true)
    .single();

  if (error) {
    console.error(`Error fetching menu item "${slug}":`, error);
    return null;
  }

  return data;
}

// Fetch all visible navigation items
export async function getNavItems(): Promise<NavItem[]> {
  const { data, error } = await supabase
    .from('nav_items')
    .select('*')
    .eq('visible', true)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching nav items:', error);
    return [];
  }

  return data || [];
}

// Fetch all social links
export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching social links:', error);
    return [];
  }

  return data || [];
}

// Fetch site setting by key
export async function getSiteSetting(key: string): Promise<any> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching site setting "${key}":`, error);
    return null;
  }

  return data?.value || null;
}

// Fetch all site settings
export async function getAllSiteSettings(): Promise<Record<string, any>> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }

  // Convert array to key-value object
  const settings: Record<string, any> = {};
  data?.forEach((setting: SiteSetting) => {
    settings[setting.key] = setting.value;
  });

  return settings;
}
