# ⚡ FlixCod Dev Console

غلاف طرفية عصري بالعربية والإنجليزية — يعمل على الجهاز أولاً، مع دعم سحابي اختياري.

## 🏗️ المعمارية (بدون Railway/Render)

```
GitHub (Source + CI)
    ↓
Vercel / Netlify / Cloudflare Pages  ←── Frontend (React + Vite)
    ↓ API calls
Supabase Edge Functions              ←── Backend (Deno + TypeScript)
    ↓
Supabase DB + Auth                   ←── Database + Authentication
    ↑
Cloudflare                           ←── DNS + SSL + WAF
```

## 🚀 خطوات النشر

### 1. Supabase
1. أنشئ مشروع على [supabase.com](https://supabase.com)
2. شغّل `supabase/migrations/001_init.sql` في SQL Editor
3. فعّل **Email (Magic Link)** من Authentication → Providers
4. انسخ: `SUPABASE_URL` و `ANON_KEY` من Settings → API

### 2. Frontend على Vercel
1. ربط الـ repo من [vercel.com](https://vercel.com)
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build`
4. **Output:** `dist`
5. أضف في Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 3. Frontend على Netlify (بديل)
1. ربط الـ repo من [netlify.app](https://netlify.app)
2. الإعدادات موجودة في `netlify.toml` — لا تحتاج تغيير
3. أضف نفس الـ env vars في Site Settings

### 4. Frontend على Cloudflare Pages (بديل)
1. ربط الـ repo من [pages.cloudflare.com](https://pages.cloudflare.com)
2. **Build Command:** `npm run build`
3. **Build output:** `frontend/dist`
4. أضف نفس الـ env vars

### 5. Supabase Edge Functions
```bash
# تثبيت Supabase CLI
npm install -g supabase

# تسجيل الدخول
supabase login

# ربط بمشروعك
supabase link --project-ref YOUR_PROJECT_REF

# نشر الـ functions
supabase functions deploy health
supabase functions deploy config
supabase functions deploy chat
```

### 6. Cloudflare (DNS + SSL)
1. أضف الدومين في Cloudflare
2. غيّر Name Servers عند المسجّل
3. أضف CNAME يشير لـ Vercel/Netlify
4. SSL: Full (strict)

## 🛠️ تطوير محلي

```bash
# نسخ ملف البيئة
cp env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# تعبئة القيم الحقيقية في الملفات

# تثبيت packages
npm install

# تشغيل frontend فقط (موصى به)
npm run dev:frontend

# أو تشغيل backend محلي أيضاً
npm run dev:backend
```

## 📁 هيكل المشروع

```
flix-dev-console/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── App.jsx              # الشاشة الرئيسية
│   │   ├── components/
│   │   │   └── ChatWindow.jsx   # واجهة الشات
│   │   ├── i18n/
│   │   │   └── translations.js  # العربي/الإنجليزي
│   │   ├── lib/
│   │   │   └── supabaseClient.js
│   │   └── index.css
│   ├── .env.example
│   └── vite.config.js
├── backend/                     # للتطوير المحلي فقط
│   └── src/
│       ├── server.js
│       ├── lib/env.js
│       └── services/supabase.js
├── supabase/
│   ├── functions/               # Edge Functions (الإنتاج)
│   │   ├── _shared/
│   │   │   ├── cors.ts
│   │   │   └── supabase.ts
│   │   ├── health/index.ts
│   │   ├── config/index.ts
│   │   └── chat/index.ts
│   └── migrations/
│       └── 001_init.sql
├── .github/workflows/
│   └── node.js.yml              # CI/CD
├── vercel.json                  # إعدادات Vercel
├── netlify.toml                 # إعدادات Netlify
└── wrangler.toml                # إعدادات Cloudflare Pages
```

## 🔒 الأمان

- ✅ Row Level Security (RLS) على قاعدة البيانات
- ✅ JWT authentication عبر Supabase
- ✅ Magic Link (بدون كلمة مرور)
- ✅ Security headers في Vercel/Netlify
- ✅ لا يوجد secret في الـ frontend

## 📊 حدود الخطط المجانية

| خدمة | الحد المجاني |
|------|-------------|
| Supabase | 500MB DB, 2GB bandwidth, 500K Edge Function invocations |
| Vercel | 100GB bandwidth, builds غير محدودة |
| Netlify | 100GB bandwidth, 300 build minutes/month |
| Cloudflare Pages | بناءات غير محدودة، bandwidth غير محدود |
