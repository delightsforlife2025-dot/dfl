# Deploying to Vercel (Supabase backend)

This app is a **Next.js 16** project. The database and storage live in **Supabase**; the site runs on **Vercel** and talks to Supabase via environment variables and server-side API routes (`SUPABASE_SERVICE_ROLE_KEY`).

## 1. Supabase (first-time setup)

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run scripts **in order** on a fresh database (adjust if you already applied some):
   1. `sql/init_schema.sql` — extensions, `set_updated_at`, core tables, sample data  
   2. `sql/menu_schema.sql` — menu categories/items + sample rows  
   3. `sql/comments_schema.sql` — comments (if you use that feature)  
   4. `sql/enable_rls.sql` — RLS for pages, `site_settings`, `nav_items`, `social_links`, `contact_messages`  
   5. `sql/storage_policies.sql` — storage rules (after you create the `menu-images` bucket in **Storage**, if uploads are used)

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for more detail.

3. **Storage:** If the dashboard uploads images, create a public bucket (e.g. `menu-images`) and align policies with `storage_policies.sql`.

4. **Auth (optional):** If you log into the dashboard with **Supabase Auth** (not only `ADMIN_EMAIL` / `ADMIN_PASSWORD`), add your production URL under **Authentication → URL configuration** (Site URL and redirect URLs), e.g. `https://your-app.vercel.app` and your custom domain.

## 2. Git repository

Push the project to GitHub, GitLab, or Bitbucket so Vercel can import it.

Do **not** commit `.env.local`. Use [`.env.example`](./.env.example) as the checklist of variable names.

## 3. Vercel project

1. In [Vercel](https://vercel.com), **Add New… → Project** and import the repo.
2. **Framework Preset:** Next.js (auto-detected).  
   **Build Command:** `next build` (default).  
   **Output:** default (not static export).
3. Add **Environment Variables** (Project → Settings → Environment Variables). Use the same names for **Production** and **Preview** unless you use a separate Supabase project for previews.

| Name | Value | Expose to browser |
|------|--------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase API settings | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (**secret**) | No — server only |
| `ADMIN_EMAIL` | Dashboard login email | No |
| `ADMIN_PASSWORD` | Strong password | No |

4. Deploy. After the first deploy, open the site and test `/menu`, `/contact`, and `/dashboard/login`.

## 4. After deploy

- Set **strong** `ADMIN_PASSWORD` (and rotate `SUPABASE_SERVICE_ROLE_KEY` if it was ever leaked).
- Add your **custom domain** in Vercel and, if applicable, update Supabase Auth URL settings.
- **Proxy:** `proxy.ts` protects `/dashboard/*`; no extra Vercel config is required.
- If the build fails with Supabase errors, confirm all variables are set for the **same** environment (Production vs Preview) you are building.

## 5. Local production check

```bash
cp .env.example .env.local
# Edit .env.local with real values, then:
npm run build && npm run start
```

Visit `http://localhost:3000` and verify pages and dashboard login.
