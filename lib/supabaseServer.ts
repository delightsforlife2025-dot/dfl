import { createClient } from "@supabase/supabase-js";

/**
 * Service role client — server-only. Placeholders avoid build-time throws when Vercel env is empty;
 * API routes will fail at runtime until real keys are configured.
 */
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://build-placeholder.supabase.co";
const serviceRole =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.build-placeholder-service-role";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — using build placeholders; set both in Vercel."
  );
}

export const supabaseAdmin = createClient(url, serviceRole, {
  auth: { persistSession: false },
});

export default supabaseAdmin;
