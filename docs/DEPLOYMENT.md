# Deployment Guide (Vercel + Cloudflare + Netlify + Railway)

## 1) Backend first (Railway)
1. Create a new Railway project linked to this repo.
2. Service root: repo root.
3. Railway reads `railway.json` and starts with `npm --workspace backend run start`.
4. Set env vars:
   - `PORT=8787`
   - `DB_FILE=/data/flixcod-db.json` (or another persistent path)
   - `CORS_ORIGIN=https://YOUR_FRONTEND_DOMAIN`
5. Verify:
   - `GET /api/health`
   - `POST /api/auth/register`

## 2) Frontend deployment options

### Netlify
- Build command: `npm --workspace frontend run build`
- Publish directory: `frontend/dist`
- In `netlify.toml`, replace `YOUR_BACKEND_DOMAIN` with Railway URL.
- Add `VITE_API_BASE_URL` in Netlify env vars.

### Vercel
- Framework: Vite.
- Build command: `npm --workspace frontend run build`
- Output dir: `frontend/dist`
- In `vercel.json`, replace `YOUR_BACKEND_DOMAIN`.
- Add `VITE_API_BASE_URL` in env vars.

### Cloudflare Pages
- Build command: `npm --workspace frontend run build`
- Output: `frontend/dist`
- `wrangler.toml` موجود لضبط `pages_build_output_dir`.
- ضع `VITE_API_BASE_URL` كمتغير بيئة في Cloudflare Pages.

## 3) Avoid database conflicts
- لا تستخدم نفس `DB_FILE` بين بيئة التطوير والإنتاج.
- لكل منصة باكند مستقلة استخدم ملف مختلف.
- لا تعتمد على storage مؤقت؛ استخدم volume/persistent disk عند الإمكان.

## 4) Release check list
- Frontend build ✅
- Backend health ✅
- Registration ✅
- Auth-gated chat ✅
- CORS configured with frontend domain ✅
