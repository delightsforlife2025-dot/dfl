import "server-only";

import { supabaseAdmin } from "./supabaseServer";
import { isSupabaseConfigured } from "./supabaseConfigured";
import type { Page, MenuItem, MenuCategory, Comment } from "./types";

/** Server-only Supabase reads (service role). Use from Server Components / route handlers only. */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabaseAdmin
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

export async function getSiteSetting(key: string): Promise<unknown> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching site setting "${key}":`, error);
    return null;
  }

  return data?.value ?? null;
}

export async function getFeaturedMenuItems(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabaseAdmin
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

  return data ?? [];
}

export async function getApprovedComments(): Promise<Comment[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabaseAdmin
    .from('comments')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching approved comments:', error);
    return [];
  }

  return data ?? [];
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabaseAdmin
    .from('menu_categories')
    .select('*')
    .eq('visible', true)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching menu categories:', error);
    return [];
  }

  return data ?? [];
}

export async function getMenuItems(categoryId?: string): Promise<MenuItem[]> {
  if (!isSupabaseConfigured()) return [];

  let query = supabaseAdmin
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

  return data ?? [];
}
