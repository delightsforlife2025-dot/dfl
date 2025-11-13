import { supabase } from './supabaseClient';
import type { Page, NavItem, SocialLink, SiteSetting, MenuItem, MenuCategory, Comment } from './types';

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

// ===== COMMENTS API =====

// Fetch approved comments for display on main page
export async function getApprovedComments(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching approved comments:', error);
    return [];
  }

  return data || [];
}

// Fetch all comments (admin only)
export async function getAllComments(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
}

// Get single comment by ID
export async function getCommentById(id: string): Promise<Comment | null> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching comment "${id}":`, error);
    return null;
  }

  return data;
}

// Create new comment
export async function createComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<Comment | null> {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return null;
  }

  return data;
}

// Update comment (admin only)
export async function updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null> {
  const { data, error } = await supabase
    .from('comments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating comment "${id}":`, error);
    return null;
  }

  return data;
}

// Delete comment (admin only)
export async function deleteComment(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting comment "${id}":`, error);
    return false;
  }

  return true;
}

// Approve comment (admin only)
export async function approveComment(id: string): Promise<Comment | null> {
  return updateComment(id, { is_approved: true });
}

// Reject/Unapprove comment (admin only)
export async function rejectComment(id: string): Promise<Comment | null> {
  return updateComment(id, { is_approved: false });
}
