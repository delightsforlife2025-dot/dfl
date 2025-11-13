# ⚡ QUICK START - 3 STEPS TO FIX EVERYTHING

## Step 1️⃣: Run SQL in Supabase (2 min)

Go to **Supabase Dashboard** → **SQL Editor** → **New Query**

Paste and Run:
```sql
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public pages" ON pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public nav" ON nav_items FOR SELECT USING (visible = true);
CREATE POLICY "Public social" ON social_links FOR SELECT USING (true);
CREATE POLICY "Public contact" ON contact_messages FOR INSERT WITH CHECK (true);
```

✅ Click **Run**

---

## Step 2️⃣: Check Data Exists (1 min)

In Supabase → **Table Editor**:

Click `site_settings` table. 

You should see rows like:
- `contact_info` 
- `general_settings`

**If missing:** Click **Insert Row** and add them

---

## Step 3️⃣: Restart Server (1 min)

Terminal:
```powershell
npm run dev
```

---

## ✅ DONE!

Go to `http://localhost:3000` - should work perfectly now!

**Issues?** See `FIX_CHECKLIST.md` for troubleshooting.

