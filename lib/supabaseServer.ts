import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.warn('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. Server supabase operations will fail.');
}

// This client should only be used server-side (e.g., API routes). It uses the service role key.
export const supabaseAdmin = createClient(url ?? '', serviceRole ?? '', {
  auth: { persistSession: false }
});

export default supabaseAdmin;
