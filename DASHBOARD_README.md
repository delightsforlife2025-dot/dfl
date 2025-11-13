# Dashboard & Authentication Guide

## Overview
This dashboard uses a simple cookie-based authentication system with demo credentials.

## Demo Credentials
- **Email**: admin@restaurant.com
- **Password**: admin123

## How Authentication Works

1. User submits login form (`/dashboard/login`)
2. Credentials are sent to `/api/auth/login` endpoint
3. If valid, a secure HTTP-only cookie (`admin_token`) is set for 24 hours
4. Middleware (`middleware.ts`) checks for this cookie on all `/dashboard/*` routes
5. Without the cookie, users are redirected to login page

## Setup on Vercel with Custom Domain

### Step 1: Environment Variables
Set these in Vercel Project Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (for server-side operations)
```

### Step 2: Domain Configuration
1. Go to Vercel Dashboard > Settings > Domains
2. Add your custom domain
3. Follow DNS setup instructions
4. Wait for SSL certificate to be provisioned (usually 5-10 minutes)

### Step 3: Testing
1. Deploy to Vercel: `git push`
2. Visit `https://yourdomain.com/dashboard/login`
3. Enter demo credentials
4. You should be redirected to the dashboard

## Troubleshooting Custom Domain Login Issues

### Issue: Login page works, but login fails with "Giriş başarısız" error

**Causes:**
- Incorrect credentials (verify you're using `admin@restaurant.com` / `admin123`)
- Network request is blocked

**Solution:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Check if `/api/auth/login` request shows 200 or 401 status
5. If 401, verify credentials in `/app/api/auth/login/route.ts`

### Issue: Login succeeds but redirects back to login page

**Causes:**
- Cookies are not being set/persisted (most common with custom domains)
- Domain cookie configuration issue
- SameSite attribute too restrictive

**Solutions:**

**A. Verify HTTPS is enabled**
- Custom domains MUST use HTTPS
- Ensure your domain has valid SSL certificate
- Check Vercel Dashboard > Settings > Domains > SSL status

**B. Clear cookies and try again**
1. Go to `/dashboard/login`
2. Open DevTools > Application > Cookies
3. Delete any existing `admin_token` cookies
4. Clear browser cache
5. Try logging in again

**C. Check cookie settings**
- The login route already uses:
  - `sameSite: 'lax'` (allows cookies in top-level navigations)
  - `httpOnly: true` (prevents JavaScript access, security best practice)
  - `secure: true` (in production - requires HTTPS)
  - `path: '/'` (cookie available site-wide)

### Issue: Cookies work in development but not in production

**Solution:**
1. Ensure environment is truly production (check NODE_ENV)
2. Verify HTTPS certificate is valid
3. Check that your custom domain is properly configured in Vercel
4. Temporarily change `sameSite` from `'lax'` to `'none'` and `secure: true` if you need to test cross-domain (not recommended for production)

## Advanced: Switching to Supabase Authentication

The current system uses demo credentials. For production, you should use Supabase Auth:

1. Update `/app/api/auth/login/route.ts` to use:
```typescript
const { data, error } = await supabaseAdmin.auth.signInWithPassword({
  email,
  password,
});
```

2. Update middleware to verify session from Supabase
3. Add sign-up endpoint
4. Add password reset functionality

See `SUPABASE_INTEGRATION_COMPLETE.md` for more details.

## Key Files

- `/app/api/auth/login/route.ts` - Login API endpoint
- `/app/api/auth/logout/route.ts` - Logout endpoint
- `/app/dashboard/login/page.tsx` - Login page UI
- `/middleware.ts` - Route protection and redirects
- `/lib/supabaseClient.ts` - Supabase client (browser)
- `/lib/supabaseServer.ts` - Supabase admin client (server)

## Security Considerations

1. **Demo credentials** are hardcoded for development only
2. For production, use Supabase Auth or similar service
3. Cookies are `httpOnly` to prevent XSS attacks
4. `sameSite: 'lax'` protects against CSRF while allowing normal navigation
5. Always use HTTPS in production

## Cookie Management

### Setting cookies (in API routes):
```typescript
response.cookies.set('admin_token', 'authenticated', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 86400, // 1 day
  path: '/',
});
```

### Deleting cookies (on logout):
```typescript
response.cookies.delete('admin_token');
```

### Accessing cookies (in middleware):
```typescript
const token = request.cookies.get('admin_token');
```
