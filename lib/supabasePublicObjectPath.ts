/** Extract Storage object path from a Supabase public object URL. */
export function supabasePublicObjectPath(imageUrl: string, bucket: string): string | null {
  const marker = `/${bucket}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;
  const rest = imageUrl.slice(idx + marker.length).split("?")[0];
  try {
    return decodeURIComponent(rest);
  } catch {
    return rest;
  }
}
