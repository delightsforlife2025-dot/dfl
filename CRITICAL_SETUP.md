# 🚨 CRITICAL SETUP REQUIRED

Complete these steps in order. This will take ~5 minutes and fix all major issues.

## Step 1: Enable RLS Policies (2 minutes)

1. Go to **[Supabase Dashboard](https://app.supabase.com)**
2. Go to **SQL Editor**
3. Click **"New Query"**
4. **Copy and paste this entire SQL block** (from `sql/enable_rls.sql`)

```sql
-- Enable RLS on all public-facing tables and set policies for read-only access

-- PAGES TABLE - Public read-only
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public pages are viewable by everyone"
  ON pages FOR SELECT
  USING (is_published = true);

-- SITE_SETTINGS TABLE - Public read-only
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

-- NAV_ITEMS TABLE - Public read-only
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public nav items are viewable by everyone"
  ON nav_items FOR SELECT
  USING (visible = true);

-- SOCIAL_LINKS TABLE - Public read-only
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public social links are viewable by everyone"
  ON social_links FOR SELECT
  USING (true);

-- CONTACT_MESSAGES TABLE - Public insert-only
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);
```

5. Click **"Run"** (ignore any "already exists" errors - that's fine)
6. You should see: `Query returned no results`

## Step 2: Verify Data Exists

Go to **Table Editor** in Supabase and check:

- ✅ `site_settings` table has at least these rows:
  - `contact_info` (with address, phone, email)
  - `general_settings` (with site_name, logo_url, etc.)

If missing, add sample data using the **Insert Row** button.

## Step 3: Restart Dev Server

In your terminal:
```powershell
npm run dev
```

The app should now load without errors! 

## Step 4: Test

1. Open `http://localhost:3000`
2. You should see featured dishes (no console errors)
3. Go to Dashboard → Settings and try changing logo/colors
4. Settings should save successfully

---

## Environment Variables Configured ✅

- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅

All three are set in `.env.local`

---

## Common Issues & Fixes

### "Policy already exists" errors
→ That's OK! Just click **"Run"** anyway. Supabase won't create duplicates.

### Still seeing "Error fetching" messages
→ RLS policies weren't created. Go back to Step 1 and run the SQL again.

### Settings won't save
→ Make sure `SUPABASE_SERVICE_ROLE_KEY` is in `.env.local` and restart the server.

---

**Total Time:** ~5 minutes for all steps

Once RLS is enabled in Supabase, **everything should work**.

