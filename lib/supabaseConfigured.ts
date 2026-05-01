import "server-only";

/** True when real Supabase env is set (not build/CI placeholders). */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url.trim() || !service.trim()) return false;
  if (url.includes("build-placeholder") || service.includes("build-placeholder")) return false;
  return true;
}
