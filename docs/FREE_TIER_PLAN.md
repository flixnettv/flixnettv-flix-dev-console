# FlixCod Free-Tier Project Plan

## الهدف
بناء تطبيق FlixCod كواجهة طرفية حديثة بذكاء تفاعلي، مع أولوية تشغيل على جهاز المستخدم، وتكامل سحابي اختياري عند الحاجة.

## توزيع الأدوار على حساباتك
- **GitHub**: إدارة الكود + CI + إصدار النسخ.
- **Supabase**: Auth + Database + تخزين إعدادات الربط.
- **Vercel**: استضافة الواجهة الأمامية (Primary Web).
- **Railway/Render**: استضافة الـ API الخلفي (Express).
- **Cloudflare**: DNS + SSL + WAF + Caching Rules.
- **Docker Hub**: صورة backend للنقل السريع.

## حدود الخطط المجانية (عملي)
1. التشغيل الافتراضي Local Device Mode.
2. منع أي استدعاء كثيف للسحابة بدون تسجيل دخول.
3. حفظ المحادثات المختصرة فقط (Retention محدود).
4. عمل rate limit بسيط لكل مستخدم لاحقاً.

## خطة التنفيذ
- **M1 (جاهزة الآن)**: UI كامل + i18n + Theme + ربط مزود + backend + DB schema.
- **M2**: سياسات RLS متقدمة وربط مستخدم Supabase الحقيقي مع السجلات.
- **M3**: موصلات Gemini/Open-source + Queue + Usage stats.
- **M4**: قوالب prompts + تصدير جلسات + تحسين performance.

## نشر فوري
1. شغّل migration SQL في Supabase.
2. انشر backend على Railway/Render واضبط env.
3. انشر frontend على Vercel واضبط env + rewrite `/api/*`.
4. اربط الدومين عبر Cloudflare وأضف WAF rules.
# FlixCod Free-Tier Project Plan (2026-ready)

## 1) Product direction
- Build FlixCod as a bilingual (Arabic/English) web terminal shell with one smart chat box.
- Use **user-device-first inference** (WebGPU/WebAssembly/CPU) where possible.
- Add optional cloud connectors only after user login and provider selection.

## 2) Service mapping using your existing accounts
- **GitHub (flixnettv)**: mono-repo, issues, release tags, GitHub Actions for lint/build.
- **Supabase (flixnettv@gmail.com)**: authentication, user profile, encrypted provider keys, usage table.
- **Netlify**: primary frontend deployment, branch previews.
- **Vercel**: fallback frontend deployment and edge experiments.
- **Railway / Render**: optional lightweight API proxy for providers requiring server secret.
- **Docker Hub (flixnettv)**: publish backend image for portable deploy.
- **Cloudflare (flixnettv)**: DNS, caching, WAF + optional Cloudflare Tunnel for secure endpoints.
- **StackBlitz**: live demo/sandbox for contributors.

## 3) Free-tier architecture boundaries
1. Keep default mode local on-device to reduce token and server costs.
2. Use server only for:
   - login/session
   - key vault operations
   - provider calls that cannot be executed safely in browser
3. Cap free usage per account with soft limits and local queue.

## 4) Model/provider strategy (free/open)
- **Google Gemini**: use free quota endpoints for low-volume assistant mode.
- **Open-source models**: route through user-selected endpoints or local wasm/webgpu runtimes.
- **Open Code / openclaw**: treat as pluggable connectors (BYOK pattern).

## 5) Milestones
- M1 (now): polished shell UI + i18n + themes + provider linker + local simulation.
- M2: Supabase auth + saved connector profiles.
- M3: provider adapters (Gemini + open-source gateway + local web inference).
- M4: usage dashboard + export chats + prompt templates.

## 6) Suggested automation scripts
- prebuild: check env and provider config shape.
- deploy:web: push frontend to Netlify (primary).
- deploy:api: deploy lightweight proxy to Railway/Render.
- release: docker build + push to Docker Hub namespace `flixnettv`.
