-- Portfolio Studio schema for Supabase PostgreSQL.
-- Run this entire file once in Supabase Dashboard > SQL Editor.
-- Security principle: public visitors can read only published content; only an allow-listed admin can write.

create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER prevents recursive row-level-security checks while consulting the allow-list.
create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

create table if not exists public.profile (
  id integer primary key default 1 check (id = 1),
  full_name text not null default '',
  role_en text not null default '', role_ar text not null default '',
  headline_en text not null default '', headline_ar text not null default '',
  bio_en text not null default '', bio_ar text not null default '',
  avatar_url text not null default '',
  email text not null default '', phone text not null default '',
  location_en text not null default '', location_ar text not null default '',
  github_url text not null default '', linkedin_url text not null default '',
  website_url text not null default '', resume_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  site_title_en text not null default 'Portfolio',
  site_title_ar text not null default 'معرض الأعمال',
  accent_color text not null default '#8daed8',
  show_projects boolean not null default true,
  show_experience boolean not null default true,
  show_skills boolean not null default true,
  show_achievements boolean not null default true,
  show_extra_content boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title_en text not null default '', title_ar text not null default '',
  description_en text not null default '', description_ar text not null default '',
  tech_stack text[] not null default '{}',
  image_url text not null default '', video_url text not null default '',
  github_url text not null default '', demo_url text not null default '',
  featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  role_en text not null default '', role_ar text not null default '',
  company_en text not null default '', company_ar text not null default '',
  location_en text not null default '', location_ar text not null default '',
  start_date date, end_date date, is_current boolean not null default false,
  description_en text not null default '', description_ar text not null default '',
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name_en text not null default '', name_ar text not null default '',
  category_en text not null default '', category_ar text not null default '',
  level integer check (level between 0 and 100),
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title_en text not null default '', title_ar text not null default '',
  issuer_en text not null default '', issuer_ar text not null default '',
  date date,
  description_en text not null default '', description_ar text not null default '',
  credential_url text not null default '', image_url text not null default '',
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  section_key text not null default '',
  title_en text not null default '', title_ar text not null default '',
  body_en text not null default '', body_ar text not null default '',
  is_visible boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

-- Automatically keep updated_at current on modifications.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

do $$
declare tbl text;
begin
  foreach tbl in array array['profile','site_settings','projects','experiences','skills','achievements','content_blocks'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', tbl);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl);
  end loop;
end $$;

alter table public.admins enable row level security;
alter table public.profile enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.skills enable row level security;
alter table public.achievements enable row level security;
alter table public.content_blocks enable row level security;

-- The signed-in user can verify only their own admin-list entry. Never expose the full list publicly.
drop policy if exists "admins can read own membership" on public.admins;
create policy "admins can read own membership" on public.admins for select to authenticated using (user_id = auth.uid());

-- Profile and site settings are public-facing singleton records.
drop policy if exists "public can read profile" on public.profile;
create policy "public can read profile" on public.profile for select to anon, authenticated using (true);
drop policy if exists "admins manage profile" on public.profile;
create policy "admins manage profile" on public.profile for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "public can read site settings" on public.site_settings;
create policy "public can read site settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "admins manage site settings" on public.site_settings;
create policy "admins manage site settings" on public.site_settings for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Repeat public-published + allow-listed admin policies for the collections.
drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects for select to anon, authenticated using (is_published = true);
drop policy if exists "admins manage projects" on public.projects;
create policy "admins manage projects" on public.projects for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "public read published experiences" on public.experiences;
create policy "public read published experiences" on public.experiences for select to anon, authenticated using (is_published = true);
drop policy if exists "admins manage experiences" on public.experiences;
create policy "admins manage experiences" on public.experiences for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "public read published skills" on public.skills;
create policy "public read published skills" on public.skills for select to anon, authenticated using (is_published = true);
drop policy if exists "admins manage skills" on public.skills;
create policy "admins manage skills" on public.skills for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "public read published achievements" on public.achievements;
create policy "public read published achievements" on public.achievements for select to anon, authenticated using (is_published = true);
drop policy if exists "admins manage achievements" on public.achievements;
create policy "admins manage achievements" on public.achievements for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "public read visible content blocks" on public.content_blocks;
create policy "public read visible content blocks" on public.content_blocks for select to anon, authenticated using (is_visible = true);
drop policy if exists "admins manage content blocks" on public.content_blocks;
create policy "admins manage content blocks" on public.content_blocks for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Public portfolio media: website visitors can see assets; only the admin allow-list can upload/change/delete them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 52428800,
  array['image/jpeg','image/png','image/webp','image/gif','image/avif','video/mp4','video/webm','video/quicktime','application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 52428800,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can view portfolio media" on storage.objects;
create policy "public can view portfolio media" on storage.objects for select to anon, authenticated using (bucket_id = 'portfolio-media');
drop policy if exists "admins can upload portfolio media" on storage.objects;
create policy "admins can upload portfolio media" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());
drop policy if exists "admins can update portfolio media" on storage.objects;
create policy "admins can update portfolio media" on storage.objects for update to authenticated using (bucket_id = 'portfolio-media' and public.is_portfolio_admin()) with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());
drop policy if exists "admins can delete portfolio media" on storage.objects;
create policy "admins can delete portfolio media" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

-- Ensure singleton site settings exist; profile stays blank until you add accurate details in the admin panel.
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- SQL privileges complement RLS; both layers must allow an operation.
grant select on public.profile, public.site_settings to anon, authenticated;
grant select on public.projects, public.experiences, public.skills, public.achievements, public.content_blocks to anon, authenticated;
grant insert, update, delete on public.profile, public.site_settings, public.projects, public.experiences, public.skills, public.achievements, public.content_blocks to authenticated;
grant select on public.admins to authenticated;
