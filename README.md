# Portfolio Studio

A polished, responsive personal portfolio starter with Arabic/English language switching, public project demos, and a private content management dashboard.

> **Important:** Entries shown before connecting Supabase are clearly labelled sample content. They are fictional placeholders, not claims about the site owner's employment, credentials, or completed work. Replace them before publishing.

## Features

- Bilingual English/Arabic public site, including RTL layout for Arabic.
- Responsive visual design with an understated navy, slate, and blue palette.
- Profile, social links, email/phone contact details, experience, skills, achievements, projects, and flexible page sections.
- Project cover images, technology tags, GitHub/live-demo links, and video URLs (YouTube/Vimeo embed supported). Admin uploads can store image, video, or PDF files in Supabase Storage (50 MB per file limit configured in the SQL schema).
- Private sign-in dashboard with overview, create/edit/delete, publish/hide controls, sort order, and site-level section visibility.
- Supabase PostgreSQL, Auth, Storage, and row-level security. Public users can read published items; an allow-listed administrator can edit.
- Ready for Vite static deployment using Cloudflare Pages or a similar host.

## Stack

- React + TypeScript + Vite
- Supabase (PostgreSQL, Authentication, Storage, Row Level Security)
- lucide-react icons
- Plain CSS, no utility CSS build dependency

## 1. Run locally

Install Node.js 20+ and Git if not already installed. In a terminal, go to this directory and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Without environment variables, the public site runs in **sample preview mode**. Admin data editing is intentionally disabled until a Supabase backend is configured.

## 2. Set up Supabase

1. Create a project at <https://supabase.com/dashboard>.
2. Open **SQL Editor**, create a new query, paste all of `supabase/schema.sql`, and run it.
3. Open **Project Settings → API** (or **Connect**) and copy the Project URL plus the publishable key / anon public key. Do **not** use a service-role or secret key in a browser app.
4. Copy `.env.example` to `.env.local` and enter those two public values:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_PUBLISHABLE_OR_ANON_KEY
```

5. Stop and restart `npm run dev` so Vite reloads environment variables.

### Create the private administrator

Public self-registration is not provided by the app.

1. In Supabase Dashboard, open **Authentication → Users** and add a user with the email and password that will be used for the admin login. If the dashboard offers a confirmation option, confirm the account for your own portfolio project.
2. In **SQL Editor**, run this query after replacing the email with the exact account you created:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'YOUR_ADMIN_EMAIL@example.com'
on conflict (user_id) do nothing;
```

3. Visit `http://localhost:5173/admin` and sign in with that email/password.

The app checks the signed-in user's ID against `public.admins`. A normal authenticated user is not automatically an administrator. Do not add a public sign-up flow without redesigning these policies.

### Storage and media

The SQL file creates a public-read bucket named `portfolio-media`, allows image/video/PDF file types, and limits each file to 50 MB. Public-read means anyone who can access the website can view published media URLs; never upload private documents. To avoid consuming the included storage quota with large videos, an external video URL (e.g. YouTube/Vimeo) is usually preferable. The admin upload helper stores files in a user-specific path. It does not automatically delete an old asset when a content entry is changed or deleted, so periodically clean up unused files from Storage.

## 3. Build and deploy for free

Current straightforward option: Cloudflare Pages for the static frontend and Supabase for data/auth/media. Free-plan limits and eligibility can change, so confirm current terms before relying on a no-cost deployment.

1. Push this folder to a GitHub repository. **Never commit `.env.local`**.
2. In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Connect to Git** and choose the repository.
3. Use these build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (the repository root where `package.json` lives)
4. In Cloudflare Pages project settings, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as build environment variables for production (and preview if wanted). These are public frontend settings, not secrets; the actual protection is Supabase RLS and Auth.
5. Deploy. Cloudflare gives you a `*.pages.dev` public URL. Pushes to the production branch can trigger new deployments.
6. In Supabase Authentication settings, review Site URL and allowed Redirect URLs. Add the exact Cloudflare site origin (for example, `https://your-project.pages.dev`) and your local development origin while developing. Keep the permitted URLs as narrow as practical.
7. Open `/admin` on the live website and sign in. Add your real profile and content, then publish items when ready.

Official deployment guide: <https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/>

## 4. Editing content

- **Profile:** display name, role, biography in both languages, photo, email/phone, location, GitHub, LinkedIn, résumé URL.
- **Projects:** bilingual title/description, comma-separated tech stack, cover image, demo video URL or file, repository/live demo links, featured state, publish state, and sort order.
- **Experience:** bilingual role, company, dates, current-role state, description, location, publish state, and order.
- **Skills:** bilingual name/category, optional 0–100 proficiency display, publish state, and order.
- **Achievements:** bilingual details, issuer/date, optional certificate image/link, publish state, and order.
- **Page sections:** add bilingual headings and text for extra sections; use a stable section key such as `approach`.
- **Site settings:** change the site title/accent color and show/hide major sections.

For each item, fill English and Arabic fields as desired. Missing translations fall back to the other language. Only published content is shown publicly.

## 5. Checks before launch

- Replace every sample card and placeholder with facts you can verify, or remove it.
- Add a photo you are comfortable making public.
- Verify all social, email, telephone, repository, video, résumé and demo URLs.
- Test on a phone, keyboard, and both language directions.
- Keep Supabase RLS enabled; never paste a service-role key into `VITE_*` variables or frontend code.
- Use a strong unique admin password and keep the number of admin users minimal.
- Take backups of important data and media before significant changes.

## Limitations / future extensions

This version is the first deployable foundation. It does not yet include draft previews, granular administrator roles, an in-dashboard admin-user manager, analytics, automated contact-form email delivery, content versioning, or automatic Storage cleanup. Contact links currently open the visitor's email client/phone app. These can be added in future iterations.

## Arabic quick start

1. أنشئ مشروعًا في Supabase وشغّل ملف `supabase/schema.sql` كاملًا من SQL Editor.
2. انسخ `.env.example` إلى `.env.local` وأضف رابط المشروع والمفتاح العام فقط، ولا تستخدم `service_role` داخل الواجهة.
3. أنشئ مستخدمًا من Authentication → Users، ثم أضف معرّفه إلى جدول `public.admins` باستخدام استعلام SQL الموجود أعلاه.
4. شغّل `npm install` ثم `npm run dev`، وافتح `/admin` وسجّل الدخول.
5. للنشر: ارفع المشروع إلى GitHub، واربطه بـ Cloudflare Pages، واجعل أمر البناء `npm run build` ومجلد النشر `dist`، ثم أضف متغيرَي Supabase إلى إعدادات البناء.
6. المحتوى الظاهر قبل الربط تجريبي فقط. استبدله ببيانات حقيقية قبل مشاركة رابط الموقع مع الآخرين.
