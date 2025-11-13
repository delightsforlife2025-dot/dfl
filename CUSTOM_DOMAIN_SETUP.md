# Custom Domain Login Fixes - Complete Guide

## What Was Fixed

Your login system was failing on custom domains due to **overly restrictive cookie security settings**. This has been fixed with the following changes:

### 1. **Updated Cookie Settings in Login Route**
**File:** `/app/api/auth/login/route.ts`

**Change:** Modified `sameSite` from `'strict'` to `'lax'`

```typescript
// BEFORE (too restrictive for custom domains):
sameSite: 'strict'

// AFTER (allows cookies in normal navigation):
sameSite: 'lax'
```

**Why:** 
- `sameSite: 'strict'` blocks cookies from being sent even in top-level navigations, which breaks login redirects
- `sameSite: 'lax'` allows cookies for same-site requests and top-level navigations, perfect for normal web apps
- This is still secure against CSRF attacks

### 2. **Improved Login Page Error Handling**
**File:** `/app/dashboard/login/page.tsx`

**Changes:**
- Added `credentials: "include"` to fetch request to ensure cookies are sent/received
- Added 100ms delay before redirect to ensure cookie is persisted
- Added console error logging for debugging

```typescript
// Added to fetch options:
credentials: "include"

// Added after successful login:
await new Promise(resolve => setTimeout(resolve, 100));
```

### 3. **Documentation Updated**
**File:** `/DASHBOARD_README.md` - Complete troubleshooting guide added

---

## Step-by-Step Setup on Vercel

### Prerequisites
- ✅ Domain registered and DNS pointing to Vercel
- ✅ Project deployed on Vercel
- ✅ HTTPS/SSL certificate active on your domain

### Step 1: Verify Domain Setup in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Domains**
4. Your custom domain should be listed with a green checkmark
5. Click on the domain - verify SSL status shows "✓ Valid Certificate"

**If SSL isn't active yet:**
- Wait 5-10 minutes for automatic provisioning
- Or manually request using "Request Certificate"

### Step 2: Deploy the Fixed Code

```bash
# Add and commit the fixes
git add app/api/auth/login/route.ts
git add app/dashboard/login/page.tsx
git add DASHBOARD_README.md
git commit -m "fix: improve cookie handling for custom domains"

# Push to trigger Vercel deployment
git push origin main
```

**Wait for deployment to complete** (watch at Vercel Dashboard)

### Step 3: Test the Login

1. Visit `https://yourdomain.com/dashboard/login` (note the **HTTPS**)
2. Enter credentials:
   - **Email:** `admin@restaurant.com`
   - **Password:** `admin123`
3. Click "Giriş Yap" (Sign In)
4. **Expected result:** Redirected to dashboard (`https://yourdomain.com/dashboard`)

### Step 4: Verify It Works

- Open browser DevTools (F12)
- Go to **Application** → **Cookies**
- You should see `admin_token` cookie with value `authenticated`
- Cookie attributes:
  - **Domain:** your domain
  - **Path:** /
  - **Expires:** (current date + 1 day)
  - **HttpOnly:** ✓ checked
  - **Secure:** ✓ checked (for HTTPS)
  - **SameSite:** Lax

---

## Troubleshooting Checklist

### ❌ Login returns "Geçersiz e-posta veya şifre" (Invalid credentials)

**Check:**
- [ ] Email is exactly: `admin@restaurant.com`
- [ ] Password is exactly: `admin123`
- [ ] No leading/trailing spaces
- [ ] CAPS LOCK is off

**Debug:**
1. Open DevTools → Network tab
2. Attempt login
3. Look for request to `/api/auth/login`
4. Check response:
   - **200 = credentials OK** but cookie not persisting (see next issue)
   - **401 = wrong credentials** (verify above)

### ❌ Login succeeds but redirects back to login page

**Most Common Causes:**

1. **HTTPS not enabled**
   - [ ] URL must start with `https://` (not `http://`)
   - [ ] Check Vercel Dashboard → Settings → Domains
   - [ ] Verify SSL certificate status is "Valid"

2. **Cookies disabled in browser**
   - [ ] Check browser cookie settings
   - [ ] Try a different browser
   - [ ] Try non-private/incognito mode
   - [ ] Temporarily disable privacy extensions

3. **Cookie not being saved**
   - [ ] Open DevTools → Application → Cookies
   - [ ] Try logging in
   - [ ] Check if `admin_token` appears
   - [ ] If not appearing, wait for deployment to complete

4. **Old code still running**
   - [ ] Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - [ ] Clear browser cache: DevTools → Network → Disable cache
   - [ ] Check Vercel deployment status

### ❌ Works on Vercel.app but not custom domain

**Causes:**
- Domain SSL not yet provisioned
- DNS not properly propagated
- Custom domain not added to Vercel project

**Solution:**
1. In Vercel Dashboard → Domains → Select your domain
2. Check "Assigned Project" field - should show your project name
3. Check DNS status - should have green checkmarks
4. Wait 5-10 minutes and refresh
5. Try again with `https://yourdomain.com`

### ❌ Still having issues?

**Debug Information to Collect:**
1. Full URL you're accessing (including domain)
2. Exact error message shown
3. DevTools Console errors (red messages)
4. DevTools Network tab screenshot of `/api/auth/login` request
5. Screenshot of cookies in DevTools → Application → Cookies
6. Vercel deployment log (view in Vercel Dashboard)

---

## How Cookies Work in This System

### Login Flow
```
1. User enters credentials
2. Browser sends POST to /api/auth/login with credentials
3. API validates credentials
4. If valid, API sets cookie in response:
   - Name: "admin_token"
   - Value: "authenticated"
   - HttpOnly: true (JavaScript can't access it)
   - Secure: true (only sent over HTTPS)
   - SameSite: lax (prevents CSRF attacks)
   - MaxAge: 86400 (valid for 24 hours)
5. Browser receives response and saves cookie
6. Browser redirects to /dashboard
7. Middleware intercepts request to /dashboard
8. Middleware checks for "admin_token" cookie
9. If cookie exists, allows access
10. If no cookie, redirects back to /dashboard/login
```

### Why SameSite Policy Matters

- **strict:** Blocks cookies even for same-site top-level navigation - TOO RESTRICTIVE
- **lax:** (✓ CURRENT) Allows cookies for same-site requests - PERFECT BALANCE
- **none:** Allows cross-site cookies - NOT RECOMMENDED, requires Secure flag

---

## Security Notes

### ✅ Current Security Features
- **HttpOnly cookies** - protects against XSS attacks
- **Secure flag** - cookies only sent over HTTPS
- **SameSite: lax** - protects against CSRF attacks
- **1-day expiry** - tokens automatically expire
- **Credentials hardcoded** - demo-only, fine for testing

### ⚠️ For Production

Before going live with real users, you should:

1. **Move credentials to environment variables**
```bash
# In Vercel Project Settings → Environment Variables
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=... # Use bcrypt hash, not plain text!
```

2. **Use Supabase Auth instead**
- See `SUPABASE_INTEGRATION_COMPLETE.md`
- Provides user management, password reset, etc.

3. **Add Rate Limiting**
- Prevent brute force attacks
- Use `npm install express-rate-limit`

4. **Add Logging**
- Log all login attempts for security auditing

---

## Files Changed

| File | Change | Impact |
|------|--------|--------|
| `/app/api/auth/login/route.ts` | Changed `sameSite` from `'strict'` to `'lax'` | 🟢 FIXES custom domain cookies |
| `/app/dashboard/login/page.tsx` | Added `credentials: "include"` + 100ms delay + error logging | 🟢 IMPROVES reliability |
| `/DASHBOARD_README.md` | Added troubleshooting guide | 📚 HELPS debug issues |
| `/middleware.ts` | No changes needed | ✅ Already working correctly |

---

## Testing Checklist

Before considering this fixed, verify:

- [ ] Can access login page at `https://yourdomain.com/dashboard/login`
- [ ] Can enter credentials and submit form
- [ ] After successful login, redirected to dashboard
- [ ] `admin_token` cookie appears in DevTools
- [ ] Can refresh page without being logged out
- [ ] Cookie expires after 24 hours (or logout manually)
- [ ] Can click logout and be redirected to login page
- [ ] `admin_token` cookie is deleted after logout
- [ ] Accessing `/dashboard` without login redirects to login page

---

## Quick Reference Commands

```bash
# Redeploy current code
git push origin main

# Check deployment status
# Go to: https://vercel.com/dashboard

# Clear browser cache (browser DevTools)
# Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# View current environment variables
# Go to Vercel → Settings → Environment Variables
```

---

## Next Steps

1. ✅ **Deploy these fixes** to Vercel
2. ✅ **Test login** on custom domain
3. ⚠️ **If still issues**, follow troubleshooting checklist above
4. 📚 **Consider Supabase Auth** for production (more features, better UX)
5. 🔒 **Move credentials** to environment variables before production

Good luck! 🚀
