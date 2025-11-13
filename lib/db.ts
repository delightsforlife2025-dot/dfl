import supabaseAdmin from './supabaseServer';

export async function getNavItems() {
  const { data, error } = await supabaseAdmin.from('nav_items').select('*').order('position', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getSiteSettings() {
  const { data, error } = await supabaseAdmin.from('site_settings').select('key, value');
  if (error) throw error;
  // Convert array of {key, value} into an object map
  const map: Record<string, any> = {};
  (data || []).forEach((r: any) => {
    map[r.key] = r.value;
  });
  return map;
}

export async function getPage(slug: string) {
  const { data, error } = await supabaseAdmin.from('pages').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
}
