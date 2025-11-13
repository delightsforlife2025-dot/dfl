# ⚡ SETUP NOW - Copy & Paste (2 minutes)

## The Easiest Way

### Step 1: Copy the SQL

The SQL is ready in file: **`SETUP_RLS.sql`**

Open that file and copy everything (Ctrl+A, Ctrl+C)

### Step 2: Open Supabase

Go to: **https://app.supabase.com**

### Step 3: SQL Editor

Click left sidebar → **"SQL Editor"**

### Step 4: New Query

Click top-right button: **"+ New Query"**

### Step 5: Paste

In the empty editor, paste the SQL (Ctrl+V)

### Step 6: Run

Click blue **"Run"** button on the right

### Step 7: Done ✅

You should see: `Query returned no results`

---

## That's It!

Now restart your dev server:
```
npm run dev
```

Then open: `http://localhost:3000`

**Everything should work perfectly now!** 🎉

---

## What If You See An Error?

### "Policy already exists"
→ That's fine! Means policies were already created. Ignore it.

### "Unknown table"
→ Make sure `sql/init_schema.sql` was run first

### Still getting errors?
→ Check `FIX_CHECKLIST.md` for troubleshooting

---

## Verify It Worked

After running the SQL:

1. Open `http://localhost:3000` in browser
2. Press `F12` (Developer Tools)
3. Go to **Console** tab
4. Look for: ✅ NO red error messages
5. Check: ✅ Featured dishes display
6. Test: Go to `/dashboard/settings` and change a setting
7. Result: ✅ Should save without errors

**If all checkmarks → You're done!** 🚀

