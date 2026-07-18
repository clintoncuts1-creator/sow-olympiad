# Vercel Deployment Guide

## Issue
Build fails on Vercel with: `supabaseKey is required` error.

This happens because **environment variables defined in `.env.local` are NOT uploaded to Vercel**. You must set them explicitly in the Vercel dashboard.

---

## Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Project Settings
1. Navigate to [Vercel Dashboard](https://vercel.com)
2. Select your project: `sow-olympiad`
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Variables

Add the following environment variables. These are already in your `.env.local` file:

#### Public Variables (safe to expose)
```
NEXT_PUBLIC_SUPABASE_URL
Value: https://twgdfztpklcxfojuxugo.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Z2RmenRwa2xjeGZvanV4dWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4OTkzMDAsImV4cCI6MjA5ODQ3NTMwMH0.tzgwNOiIqM34H7jm14xUB0E3D8_Rmas1NSHeSKzCFVo
```

#### Private Variables (server-side only)
```
SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Z2RmenRwa2xjeGZvanV4dWdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjg5OTMwMCwiZXhwIjoyMDk4NDc1MzAwfQ.69F69aD2dvvllENeRhPyXDnctBjWsTAv6KaWuORevnA

ADMIN_PASSWORD_HASH
Value: $2a$10$YQv8PlkzYlKSHEZA8TK1BOhqwM5EEG/JGvgCGLxAChD9Gw.6Ey5hS

JWT_SECRET
Value: sow-2026-dev-jwt-secret-key
```

### Step 3: Configure Environment Availability
When adding each variable, ensure it's available in the right environments:

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | ✅ | ✅ | ✅ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ | ✅ | ✅ |
| SUPABASE_SERVICE_ROLE_KEY | ✅ | ✅ | ❌ (optional) |
| ADMIN_PASSWORD_HASH | ✅ | ✅ | ❌ (optional) |
| JWT_SECRET | ✅ | ✅ | ❌ (optional) |

### Step 4: Redeploy
After adding environment variables:
1. Go to **Deployments** tab
2. Click the three-dot menu (⋯) on the last deployment
3. Select **Redeploy**
4. Or push a new commit to trigger automatic redeploy

---

## Environment Variable Reference

### NEXT_PUBLIC_SUPABASE_URL
- **Type**: Public (client-safe)
- **Source**: Supabase Dashboard → Settings → API
- **Purpose**: Endpoint for Supabase API calls
- **Example**: `https://twgdfztpklcxfojuxugo.supabase.co`

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Type**: Public (client-safe, read-only)
- **Source**: Supabase Dashboard → Settings → API (anon/public key)
- **Purpose**: Client-side authentication and public data access
- **Note**: Does NOT expose sensitive operations (write/delete is restricted by RLS)

### SUPABASE_SERVICE_ROLE_KEY
- **Type**: Private (server-only, never expose to client)
- **Source**: Supabase Dashboard → Settings → API (service_role key)
- **Purpose**: Server-side admin operations (bypasses RLS)
- **Warning**: This key has full access to all data. Keep it secret!

### ADMIN_PASSWORD_HASH
- **Type**: Private (server-only)
- **Purpose**: Admin login password verification (bcrypt hash)
- **Value**: `$2a$10$YQv8PlkzYlKSHEZA8TK1BOhqwM5EEG/JGvgCGLxAChD9Gw.6Ey5hS`
- **Password**: `admin123` (dev only, change in production)

### JWT_SECRET
- **Type**: Private (server-only)
- **Purpose**: Sign/verify session JWT tokens
- **Value**: `sow-2026-dev-jwt-secret-key` (change in production)
- **Length**: Should be at least 32 characters for production

---

## Troubleshooting

### Build still fails after adding variables
1. Wait 2-3 minutes for variables to propagate
2. Clear Vercel cache: Settings → Advanced → Purge Build Cache → Purge
3. Trigger a new deployment: Push a commit or redeploy manually

### "supabaseKey is required" runtime error
- This means `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing or empty
- Check Vercel Environment Variables page
- Verify variable is set for the current environment (Production/Preview/Development)

### "Unauthorized" errors in admin panel
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- Check that RLS policies are correctly configured in Supabase
- Verify admin password is set in database

---

## Security Best Practices

### DO:
✅ Set `SUPABASE_SERVICE_ROLE_KEY` as a **Private** variable in Vercel
✅ Use environment variable masking in Vercel (hidden from logs)
✅ Rotate secrets periodically in production
✅ Use unique JWT_SECRET per environment
✅ Keep `.env.local` out of git (add to `.gitignore`)

### DON'T:
❌ Commit `.env.local` to git (secrets exposed!)
❌ Use same secrets in dev/staging/production
❌ Share Vercel environment settings screenshots
❌ Use weak JWT_SECRET values
❌ Log environment variables in error messages

---

## Local Development (Already Configured)

Your local setup is already correct:
- `.env.local` has all variables ✅
- `@types/bcryptjs` installed in devDependencies ✅
- Build works locally with `npm run build` ✅

Just ensure Vercel has the same environment variables set, and builds will succeed.

---

## Next Steps

1. Add the 5 environment variables to Vercel dashboard
2. Redeploy the project
3. Verify deployment succeeds
4. Test admin login with password `admin123`
5. Import the database seed: `supabase/seed.sql`

