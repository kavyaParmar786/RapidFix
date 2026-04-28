# Better Auth Setup Guide

## 1. Install dependencies
```bash
npm install
```

## 2. Set up environment variables
Copy `.env.local.example` to `.env.local` and fill in:

### Better Auth Secret
```bash
# Generate a random secret:
openssl rand -base64 32
```
Paste that as `BETTER_AUTH_SECRET`.

### Better Auth URL
- Local dev: `http://localhost:3000`
- Vercel: your full domain e.g. `https://rapid-fix-henna.vercel.app`
  Set both `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` to the same value.

### Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Authorized redirect URIs — add:
   - `http://localhost:3000/api/auth/callback/google` (for local)
   - `https://your-vercel-domain.vercel.app/api/auth/callback/google` (for prod)
4. Copy Client ID and Client Secret into `.env.local`

## 3. Vercel environment variables
Add all the same variables in Vercel → Project → Settings → Environment Variables.
Make sure `BETTER_AUTH_URL` = your full Vercel URL (not localhost).

## 4. Run locally
```bash
npm run dev
```

## How it works
- Auth is handled by Better Auth at `/api/auth/[...all]`
- Sessions stored in secure httpOnly cookies — no redirect loops
- Google OAuth → `/api/auth/callback/google` → `/sso-callback` → role-select or dashboard
- Email/password signup goes directly to role-select
