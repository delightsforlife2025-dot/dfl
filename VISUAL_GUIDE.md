# 📸 VISUAL SETUP GUIDE

## Step 1: Go to Supabase Dashboard

```
https://app.supabase.com
                    ↓
        [Login to your account]
                    ↓
        [Click your project]
```

---

## Step 2: Open SQL Editor

```
Dashboard
    ↓
Left Sidebar → "SQL Editor"
    ↓
    [You should see SQL editor interface]
```

**Screenshot location:** Top-left corner, look for "SQL Editor" option

---

## Step 3: Create New Query

```
SQL Editor page
    ↓
Click: "+ New Query" (top right blue button)
    ↓
    [Empty SQL editor opens]
```

---

## Step 4: Copy & Paste SQL

In the empty SQL editor, paste this:

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

---

## Step 5: Run Query

```
SQL Editor with code pasted
    ↓
Click: "Run" button (right side, usually blue)
    ↓
    [You'll see result message]
```

**Expected result:** 
```
Query returned no results ✅
```

**OR if you see:**
```
Policy already exists
```

**That's OK!** Just means it was already there. Still works.

---

## Step 6: Verify in Table Editor

```
Supabase Dashboard
    ↓
Left Sidebar → "Table Editor"
    ↓
    [Select "site_settings" table]
    ↓
    [Should see rows like:]
    - contact_info
    - general_settings
```

If you see these rows → Everything is good! ✅

If missing → Click "Insert Row" and add them manually

---

## Step 7: Restart Dev Server

In your terminal:

```powershell
# Press Ctrl+C if server is running
# Then run:
npm run dev

# Should see:
# ✓ Ready in XXXms
```

---

## Step 8: Test It Works

Open browser: `http://localhost:3000`

### Check These:

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Look for:**
   - ✅ NO red error messages
   - ✅ NO "Error fetching" messages
   - ✅ Page displays normally

4. **Go to Dashboard Settings:**
   - `http://localhost:3000/dashboard/settings`
   - Try changing logo/colors
   - Click "Kaydet" (Save)
   - Should save without errors ✅

---

## 🎉 Success Indicators

- [x] No console errors
- [x] Featured dishes display on home page
- [x] Settings can be saved
- [x] Dashboard loads data
- [x] Contact form works

If you see all ✅ → **You're done!**

---

## 🆘 If Something Goes Wrong

### Error: "Policy already exists"
→ That's fine! Policies were created before. Just ignore.

### Error: "Unknown table"
→ Make sure `sql/init_schema.sql` was run first in Supabase

### Still seeing "Error fetching" messages
→ Refresh browser (Ctrl+Shift+R) and restart server

### Settings won't save
→ Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
→ Restart server

---

## 📋 Checklist

- [ ] Went to Supabase SQL Editor
- [ ] Created new query
- [ ] Pasted RLS SQL
- [ ] Clicked "Run"
- [ ] Verified `site_settings` table has data
- [ ] Restarted `npm run dev`
- [ ] Opened `http://localhost:3000`
- [ ] Checked console - no red errors
- [ ] Tested settings save
- [ ] ✅ ALL WORKING!

---

**Total Time: 10 minutes max**

You got this! 🚀

