# Cloudflare Setup (flixnettv)

## What to configure
1. Add your domain to Cloudflare DNS.
2. Create records:
   - `app` -> CNAME to Vercel frontend domain
   - `api` -> CNAME to Railway/Render backend domain
3. Enable SSL/TLS Full (Strict).
4. Enable WAF managed rules for `/api/*`.
5. Add caching rule:
   - Cache static assets for `app.*`
   - Bypass cache for `/api/*`

## Optional: Zero Trust Tunnel
Use Cloudflare Tunnel to expose private backend securely if needed.
