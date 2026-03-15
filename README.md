# FlixCod

تطبيق ويب حديث كـ **واجهة طرفية ذكية** (Terminal Shell) بصندوق محادثة واحد، ثنائي اللغة (العربية/الإنجليزية)، مع وضع تشغيل يعتمد على موارد جهاز المستخدم أولاً.

## ما تم تجهيزه
- Frontend: React + Vite + ثيمات + i18n + Provider Linking.
- Auth: تكامل Supabase Auth (Magic Link) من الواجهة.
- Backend: Express API مع حفظ رسائل المحادثة في Supabase.
- Database: Migration SQL جاهزة لـ Supabase.
- Deploy: ملفات وإعدادات مساعدة لـ Vercel + Cloudflare + Railway/Render.

## بنية المشروع
- `frontend/` تطبيق الواجهة.
- `backend/` واجهة API.
- `supabase/migrations/001_init.sql` مخطط قاعدة البيانات.
- `vercel.json` إعداد نشر الواجهة على Vercel.
- `cloudflare/README.md` خطوات تهيئة Cloudflare.
- `.env.example` جميع المتغيرات المطلوبة.

## التشغيل المحلي
```bash
npm install
cp .env.example .env
# حدّث القيم داخل .env
npm run dev:backend
npm run dev:frontend
```

## متغيرات البيئة
- Frontend:
  - `VITE_API_BASE_URL`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Backend:
  - `PORT`
  - `CORS_ORIGIN`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

## خطوات نشر سريعة
1. **Supabase**
   - أنشئ مشروع.
   - نفّذ SQL من `supabase/migrations/001_init.sql`.
   - انسخ `URL` و`anon key` و`service_role key`.

2. **Backend (Railway أو Render)**
   - انشر مجلد `backend` أو المستودع كامل مع start command: `npm run start:backend`.
   - اضبط env الخاصة بالـ backend.

3. **Frontend (Vercel)**
   - انشر المستودع.
   - Build command: `npm run build`
   - Output directory: `frontend/dist`
   - اضبط env الخاصة بالواجهة.
   - عدّل `vercel.json` لاستخدام دومين الـ backend الحقيقي في rewrite الخاص بـ `/api/*`.

4. **Cloudflare**
   - اربط الدومين بـ Vercel (app) وRailway/Render (api).
   - فعّل SSL/WAF و rules المقترحة في `cloudflare/README.md`.
# FlixCod (inside flix-dev-console)

واجهة ويب حديثة كغلاف أنيق لطرفية (Terminal Shell) مع صندوق محادثة ذكي، تدعم العربية والإنجليزية، وتعمل بنمط يعتمد على موارد جهاز المستخدم أولاً.

## Features
- واجهة ثنائية اللغة (AR/EN) + اتجاه RTL/LTR.
- ثيمين: داكن + فاتح.
- تسجيل مجاني إلزامي قبل استخدام أي أداة.
- صندوق محادثة بتصميم Mobile-First وأزرار لمس محسنة.
- ربط مزوّد النماذج بعد تسجيل المستخدم.
- Backend starter API جاهز للتوسعة.

## Structure
- `frontend/`: React + Vite app.
- `backend/`: Express API starter (file DB by default).
- `.dev`: مهام تشغيل/فحص محلي موحدة.
- `docs/FREE_TIER_PLAN.md`: خطة المشروع والنشر ضمن الخطط المجانية.

## Local development
```bash
npm install
./.dev up
```

## Quick checks
```bash
./.dev check
npm run build
```

## Environment variables
انسخ من الملفات:
- `.env.example`
- `frontend/.env.example`
- `backend/.env.example`

المتغيرات المهمة:
- `VITE_API_BASE_URL`: رابط الـ API المستخدم من الواجهة.
- `PORT`: منفذ الباكند.
- `DB_FILE`: مسار ملف قاعدة البيانات (لمنع التعارض بين البيئات).
- `CORS_ORIGIN`: رابط/نطاق مسموح للواجهة.

## Deployment configs (ready)
- **Vercel**: `vercel.json` (Frontend + API rewrite placeholder).
- **Netlify**: `netlify.toml` (publish + redirects).
- **Cloudflare Pages**: `wrangler.toml`.
- **Railway**: `railway.json` + `Procfile` (backend start command).

> قبل النشر: غيّر `YOUR_BACKEND_DOMAIN` في `vercel.json` و`netlify.toml` و`wrangler.toml` إلى رابط الباكند الفعلي.

## Database isolation strategy
- Local dev: `DB_FILE=data/dev.db.json` عبر `.dev up`.
- Local checks/CI: `DB_FILE=data/dev-check.db.json` عبر `.dev check`.
- Production: اضبط `DB_FILE` لكل منصة على مسار مستقل.
