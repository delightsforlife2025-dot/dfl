import { createClient } from "@supabase/supabase-js";

/**
 * Real values must be set in `.env.local` (dev) and Vercel env (prod).
 * Placeholders keep `createClient` from throwing during `next build` when env is not injected yet.
 */
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://build-placeholder.supabase.co";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.build-placeholder-anon-key";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.warn(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — using build placeholders; set these in Vercel for a working site."
  );
}

export const supabase = createClient(url, anonKey);

export default supabase;
