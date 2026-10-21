import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import {
  ArrowDownRight, ArrowLeft, ArrowUpRight, Award, BriefcaseBusiness, Check,
  Code2, ExternalLink, Github, Globe2, LayoutDashboard, Linkedin, LoaderCircle, LockKeyhole,
  Mail, PenLine, Phone, Play, Plus, Save, Settings2, ShieldCheck, Sparkles, Trash2,
  Upload, UserRound, Wrench, X, type LucideIcon
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { words } from './i18n';
import { DEMO_ACHIEVEMENTS, DEMO_CONTENT, DEMO_EXPERIENCE, DEMO_PROFILE, DEMO_PROJECTS, DEMO_SETTINGS, DEMO_SKILLS } from './demo';
import { EMPTY_PROFILE, EMPTY_SETTINGS, type Lang, type Profile, type Row, type SiteSettings } from './types';

const cx = (...v: Array<string | false | null | undefined>) => v.filter(Boolean).join(' ');
const localize = (item: Row | null | undefined, key: string, lang: Lang) => item?.[`${key}_${lang}`] || item?.[`${key}_${lang === 'en' ? 'ar' : 'en'}`] || item?.[key] || '';
const demo = !isSupabaseConfigured;

type FieldType = 'text' | 'textarea' | 'url' | 'number' | 'boolean' | 'date' | 'list' | 'color';
type FieldDef = { key: string; label: string; type?: FieldType; hint?: string };
type ResourceDef = { key: string; table: string; label: string; icon: LucideIcon; titleField: string; fields: FieldDef[]; publishField?: string };

const resources: ResourceDef[] = [
  { key: 'projects', table: 'projects', label: 'Projects', icon: Code2, titleField: 'title_en', fields: [
    { key: 'title_en', label: 'Title (English)' }, { key: 'title_ar', label: 'Title (Arabic)' },
    { key: 'description_en', label: 'Description (English)', type: 'textarea' }, { key: 'description_ar', label: 'Description (Arabic)', type: 'textarea' },
    { key: 'tech_stack', label: 'Technologies (comma-separated)', type: 'list', hint: 'Example: TypeScript, React, Supabase' },
    { key: 'image_url', label: 'Cover image URL', type: 'url', hint: 'You can paste a URL or upload an image below.' },
    { key: 'video_url', label: 'Demo video URL', type: 'url', hint: 'Paste a YouTube/Vimeo URL or upload a short video.' },
    { key: 'github_url', label: 'GitHub URL', type: 'url' }, { key: 'demo_url', label: 'Live demo URL', type: 'url' },
    { key: 'featured', label: 'Featured project', type: 'boolean' }, { key: 'is_published', label: 'Visible on public website', type: 'boolean' }, { key: 'sort_order', label: 'Sort order', type: 'number' }
  ] },
  { key: 'experience', table: 'experiences', label: 'Experience', icon: BriefcaseBusiness, titleField: 'role_en', fields: [
    { key: 'role_en', label: 'Role (English)' }, { key: 'role_ar', label: 'Role (Arabic)' }, { key: 'company_en', label: 'Company / organization (English)' }, { key: 'company_ar', label: 'Company / organization (Arabic)' },
    { key: 'location_en', label: 'Location (English)' }, { key: 'location_ar', label: 'Location (Arabic)' }, { key: 'start_date', label: 'Start date', type: 'date' }, { key: 'end_date', label: 'End date (leave blank if current)', type: 'date' },
    { key: 'is_current', label: 'Current role', type: 'boolean' }, { key: 'description_en', label: 'Description (English)', type: 'textarea' }, { key: 'description_ar', label: 'Description (Arabic)', type: 'textarea' },
    { key: 'is_published', label: 'Visible on public website', type: 'boolean' }, { key: 'sort_order', label: 'Sort order', type: 'number' }
  ] },
  { key: 'skills', table: 'skills', label: 'Skills', icon: Wrench, titleField: 'name_en', fields: [
    { key: 'name_en', label: 'Skill (English)' }, { key: 'name_ar', label: 'Skill (Arabic)' }, { key: 'category_en', label: 'Category (English)' }, { key: 'category_ar', label: 'Category (Arabic)' },
    { key: 'level', label: 'Level (0–100, optional)', type: 'number' }, { key: 'is_published', label: 'Visible on public website', type: 'boolean' }, { key: 'sort_order', label: 'Sort order', type: 'number' }
  ] },
  { key: 'achievements', table: 'achievements', label: 'Achievements', icon: Award, titleField: 'title_en', fields: [
    { key: 'title_en', label: 'Title (English)' }, { key: 'title_ar', label: 'Title (Arabic)' }, { key: 'issuer_en', label: 'Issuer (English)' }, { key: 'issuer_ar', label: 'Issuer (Arabic)' },
    { key: 'date', label: 'Date', type: 'date' }, { key: 'description_en', label: 'Description (English)', type: 'textarea' }, { key: 'description_ar', label: 'Description (Arabic)', type: 'textarea' },
    { key: 'credential_url', label: 'Credential URL', type: 'url' }, { key: 'image_url', label: 'Certificate image URL', type: 'url' },
    { key: 'is_published', label: 'Visible on public website', type: 'boolean' }, { key: 'sort_order', label: 'Sort order', type: 'number' }
  ] },
  { key: 'content', table: 'content_blocks', label: 'Page sections', icon: PenLine, titleField: 'title_en', publishField: 'is_visible', fields: [
    { key: 'section_key', label: 'Section key (e.g. approach)' }, { key: 'title_en', label: 'Title (English)' }, { key: 'title_ar', label: 'Title (Arabic)' },
    { key: 'body_en', label: 'Content (English)', type: 'textarea' }, { key: 'body_ar', label: 'Content (Arabic)', type: 'textarea' },
    { key: 'is_visible', label: 'Visible on public website', type: 'boolean' }, { key: 'sort_order', label: 'Sort order', type: 'number' }
  ] }
];

const profileFields: FieldDef[] = [
  { key: 'full_name', label: 'Display name' }, { key: 'role_en', label: 'Professional title (English)' }, { key: 'role_ar', label: 'Professional title (Arabic)' },
  { key: 'headline_en', label: 'Hero headline (English)', type: 'textarea' }, { key: 'headline_ar', label: 'Hero headline (Arabic)', type: 'textarea' },
  { key: 'bio_en', label: 'About me (English)', type: 'textarea' }, { key: 'bio_ar', label: 'About me (Arabic)', type: 'textarea' },
  { key: 'avatar_url', label: 'Profile photo URL', type: 'url' }, { key: 'email', label: 'Contact email' }, { key: 'phone', label: 'Phone number' },
  { key: 'location_en', label: 'Location / availability (English)' }, { key: 'location_ar', label: 'Location / availability (Arabic)' },
  { key: 'github_url', label: 'GitHub profile URL', type: 'url' }, { key: 'linkedin_url', label: 'LinkedIn profile URL', type: 'url' },
  { key: 'website_url', label: 'Other website URL', type: 'url' }, { key: 'resume_url', label: 'Résumé URL', type: 'url' }
];
const settingFields: FieldDef[] = [
  { key: 'site_title_en', label: 'Browser / site title (English)' }, { key: 'site_title_ar', label: 'Browser / site title (Arabic)' },
  { key: 'accent_color', label: 'Accent color', type: 'color' }, { key: 'show_projects', label: 'Show projects section', type: 'boolean' },
  { key: 'show_experience', label: 'Show experience section', type: 'boolean' }, { key: 'show_skills', label: 'Show skills section', type: 'boolean' },
  { key: 'show_achievements', label: 'Show achievements section', type: 'boolean' }, { key: 'show_extra_content', label: 'Show extra page sections', type: 'boolean' }
];

function usePortfolioData() {
  const [profile, setProfile] = useState<Profile>(demo ? DEMO_PROFILE : EMPTY_PROFILE);
  const [settings, setSettings] = useState<SiteSettings>(demo ? DEMO_SETTINGS : EMPTY_SETTINGS);
  const [projects, setProjects] = useState<Row[]>(demo ? DEMO_PROJECTS : []);
  const [experience, setExperience] = useState<Row[]>(demo ? DEMO_EXPERIENCE : []);
  const [skills, setSkills] = useState<Row[]>(demo ? DEMO_SKILLS : []);
  const [achievements, setAchievements] = useState<Row[]>(demo ? DEMO_ACHIEVEMENTS : []);
  const [content, setContent] = useState<Row[]>(demo ? DEMO_CONTENT : []);
  const [loading, setLoading] = useState(!demo);
  const [loadError, setLoadError] = useState('');
  const refresh = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    setLoading(true); setLoadError('');
    try {
      const [p, s, pr, ex, sk, ac, cb] = await Promise.all([
        supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
        supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('projects').select('*').eq('is_published', true).order('sort_order'),
        supabase.from('experiences').select('*').eq('is_published', true).order('sort_order'),
        supabase.from('skills').select('*').eq('is_published', true).order('sort_order'),
        supabase.from('achievements').select('*').eq('is_published', true).order('sort_order'),
        supabase.from('content_blocks').select('*').eq('is_visible', true).order('sort_order')
      ]);
      const errs = [p.error, s.error, pr.error, ex.error, sk.error, ac.error, cb.error].filter(Boolean);
      if (errs.length) throw new Error(errs.map(e => e?.message).join(' · '));
      setProfile(p.data ? p.data as Profile : EMPTY_PROFILE);
      setSettings(s.data ? s.data as SiteSettings : EMPTY_SETTINGS);
      setProjects((pr.data ?? []) as Row[]); setExperience((ex.data ?? []) as Row[]); setSkills((sk.data ?? []) as Row[]);
      setAchievements((ac.data ?? []) as Row[]); setContent((cb.data ?? []) as Row[]);
    } catch (e) { setLoadError(e instanceof Error ? e.message : 'Could not load website content.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return { profile, settings, projects, experience, skills, achievements, content, loading, loadError, refresh };
}

function MediaThumb({ src, alt, className = '' }: { src?: string; alt: string; className?: string }) {
  if (src) return <img className={className} src={src} alt={alt} loading="lazy" />;
  return <div className={cx('media-fallback', className)} aria-label={alt}><Code2 size={28} /><span>PROJECT</span></div>;
}

function VideoEmbed({ url }: { url?: string }) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/i);
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (/\.(mp4|webm|mov)(?:[?#].*)?$/i.test(url)) return <div className="video-frame"><video src={url} controls playsInline preload="metadata" /></div>;
  const embed = yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}` : vimeo ? `https://player.vimeo.com/video/${vimeo[1]}` : '';
  if (embed) return <div className="video-frame"><iframe src={embed} title="Project demonstration" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>;
  return <a className="video-link" href={url} target="_blank" rel="noreferrer"><Play size={15} /> Watch project video <ArrowUpRight size={14} /></a>;
}

function PortfolioSite({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const data = usePortfolioData();
  const t = words[lang]; const rtl = lang === 'ar';
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = rtl ? 'rtl' : 'ltr'; document.title = localize(data.settings as unknown as Row, 'site_title', lang) || data.profile.full_name || 'Portfolio Studio'; }, [lang, rtl, data.settings, data.profile.full_name]);
  const profile = data.profile;
  return <div className={cx('site-shell', rtl && 'rtl')} style={{ '--accent': data.settings.accent_color || '#8daed8' } as CSSProperties}>
    {demo && <div className="preview-banner"><Sparkles size={14} /><span>{t.demoNotice}</span><a href="/admin">{t.openAdmin}</a></div>}
    {data.loadError && <div className="preview-banner warning"><span>Content could not be loaded: {data.loadError}</span></div>}
    <header className="site-nav wrap">
      <a className="wordmark" href="#top" aria-label="Top"><span className="wordmark-mark">{(profile.full_name || 'P').trim().charAt(0).toUpperCase()}</span><span>{profile.full_name || 'Portfolio'}<small>PORTFOLIO</small></span></a>
      <nav className="desktop-nav">
        <a href="#about">{t.navAbout}</a>{data.settings.show_experience && <a href="#experience">{t.navExperience}</a>}{data.settings.show_projects && <a href="#projects">{t.navProjects}</a>}{data.settings.show_skills && <a href="#skills">{t.navSkills}</a>}<a href="#contact">{t.navContact}</a>
      </nav>
      <div className="nav-actions"><button className="lang-switch" onClick={() => setLang(rtl ? 'en' : 'ar')} aria-label="Switch language"><Globe2 size={16} /><span>{rtl ? 'EN' : 'عربي'}</span></button><a className="admin-shortcut" href="#admin" onClick={e => { e.preventDefault(); window.history.pushState({}, '', '/admin'); window.dispatchEvent(new PopStateEvent('popstate')); }}>{t.openAdmin}<ArrowUpRight size={14} /></a></div>
    </header>

    <main id="top">
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" />{t.hello}</div>
          <h1>{profile.headline_en || profile.headline_ar ? localize(profile as unknown as Row, 'headline', lang) : (rtl ? 'مساحتك لعرض أفضل ما تصنعه.' : 'A space for the work you stand behind.')}</h1>
          <p className="hero-role">{localize(profile as unknown as Row, 'role', lang) || (rtl ? 'المسمى الوظيفي يظهر هنا' : 'Your professional title goes here')}</p>
          <p className="hero-intro">{localize(profile as unknown as Row, 'bio', lang) || (rtl ? 'اكتب نبذة قصيرة توضّح خبرتك وما تحب بناءه.' : 'Add a short introduction about your background and the work you care about.')}</p>
          <div className="hero-actions"><a className="button button-primary" href="#projects">{t.explore}<ArrowDownRight size={17} /></a><a className="button button-quiet" href="#contact">{t.contact}<ArrowUpRight size={16} /></a></div>
          <div className="hero-socials">
            {profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer"><Github size={17} /><span>GitHub</span><ArrowUpRight size={12} /></a>}
            {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={17} /><span>LinkedIn</span><ArrowUpRight size={12} /></a>}
            {profile.resume_url && <a href={profile.resume_url} target="_blank" rel="noreferrer"><ExternalLink size={16} /><span>{t.resume}</span></a>}
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          {profile.avatar_url ? <img className="avatar-photo" src={profile.avatar_url} alt={profile.full_name || 'Profile photo'} /> : <div className="avatar-placeholder"><UserRound size={76} strokeWidth={1.15} /><span>YOUR PHOTO</span></div>}
          <div className="hero-floating-card"><span className="floating-icon"><ShieldCheck size={17} /></span><span><b>{rtl ? 'الجودة أولًا' : 'Quality minded'}</b><small>{rtl ? 'دقة · وضوح · ثقة' : 'Care · Clarity · Craft'}</small></span></div>
          <div className="hero-number"><span>01</span><i /></div>
        </div>
        <div className="hero-bottomline"><span>{rtl ? 'الفضول يقود العمل الجيد.' : 'Curiosity leads to better work.'}</span><a href="#about">SCROLL TO EXPLORE <ArrowDownRight size={14} /></a></div>
      </section>

      <section className="section wrap about-section" id="about">
        <div className="section-kicker"><span>01</span><span>{rtl ? 'التعريف' : 'INTRODUCTION'}</span></div>
        <div className="about-grid"><h2>{t.about}<span className="accent-period">.</span></h2><div><p className="large-copy">{localize(profile as unknown as Row, 'bio', lang) || (rtl ? 'هذه المساحة مخصصة لنبذة مهنية واضحة وصادقة.' : 'A concise, honest introduction belongs here.')}</p><div className="about-meta">{(localize(profile as unknown as Row, 'location', lang)) && <span><Globe2 size={15} />{localize(profile as unknown as Row, 'location', lang)}</span>}{profile.email && <a href={`mailto:${profile.email}`}><Mail size={15} />{profile.email}</a>}</div></div></div>
      </section>

      {data.settings.show_projects && <section className="section wrap" id="projects">
        <div className="section-heading"><div><div className="section-kicker"><span>02</span><span>{rtl ? 'نماذج من العمل' : 'SELECTED WORK'}</span></div><h2>{t.selected}<span className="accent-period">.</span></h2><p>{t.projectsIntro}</p></div><span className="section-count">{String(data.projects.length).padStart(2, '0')} / WORKS</span></div>
        {data.loading ? <LoadingLine /> : data.projects.length ? <div className="projects-grid">{data.projects.map((project, i) => <article key={project.id} className={cx('project-card', i === 0 && 'project-featured')}>
          <div className="project-visual"><MediaThumb src={project.image_url} alt={localize(project, 'title', lang)} className="project-image" />{project.featured && <span className="featured-pill"><Sparkles size={12} />{t.featured}</span>}<span className="project-index">{String(i + 1).padStart(2, '0')}</span></div>
          <div className="project-body"><h3>{localize(project, 'title', lang) || 'Untitled project'}</h3><p>{localize(project, 'description', lang)}</p>
            {!!project.tech_stack?.length && <div className="tag-list">{project.tech_stack.map((tech: string) => <span key={tech}>{tech}</span>)}</div>}
            {project.video_url && <VideoEmbed url={project.video_url} />}
            <div className="project-links">{project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer"><Github size={15} />{t.viewCode}<ArrowUpRight size={13} /></a>}{project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer"><ExternalLink size={14} />{t.liveDemo}<ArrowUpRight size={13} /></a>}</div>
          </div>
        </article>)}</div> : <EmptyState text={t.noProjects} />}
      </section>}

      {data.settings.show_experience && <section className="section wrap experience-section" id="experience">
        <div className="section-heading"><div><div className="section-kicker"><span>03</span><span>{rtl ? 'المسيرة' : 'THE JOURNEY'}</span></div><h2>{t.experience}<span className="accent-period">.</span></h2><p>{t.experienceIntro}</p></div></div>
        {data.loading ? <LoadingLine /> : data.experience.length ? <div className="timeline">{data.experience.map((item, i) => <article className="timeline-item" key={item.id}><div className="timeline-marker">{String(i + 1).padStart(2, '0')}</div><div className="timeline-main"><div className="timeline-top"><div><h3>{localize(item, 'role', lang) || 'Role'}</h3><div className="timeline-company">{localize(item, 'company', lang)}{localize(item, 'location', lang) ? ` · ${localize(item, 'location', lang)}` : ''}</div></div><span className="timeline-date">{item.start_date || ''}{item.start_date ? ' — ' : ''}{item.is_current ? t.present : (item.end_date || '')}</span></div><p>{localize(item, 'description', lang)}</p></div></article>)}</div> : <EmptyState text={t.noExperience} />}
      </section>}

      {data.settings.show_skills && <section className="section wrap skills-section" id="skills">
        <div className="section-heading"><div><div className="section-kicker"><span>04</span><span>{rtl ? 'الأدوات' : 'TOOLKIT'}</span></div><h2>{t.skills}<span className="accent-period">.</span></h2></div></div>
        {data.loading ? <LoadingLine /> : data.skills.length ? <div className="skills-grid">{data.skills.map(skill => <div className="skill-item" key={skill.id}><span className="skill-icon"><Code2 size={17} /></span><div className="skill-copy"><b>{localize(skill, 'name', lang)}</b><small>{localize(skill, 'category', lang)}</small></div>{Number(skill.level) > 0 && <span className="skill-level"><i style={{ width: `${Math.min(100, Math.max(0, Number(skill.level)))}%` }} /></span>}</div>)}</div> : <EmptyState text={t.noSkills} />}
      </section>}

      {data.settings.show_achievements && <section className="section wrap" id="achievements">
        <div className="section-heading"><div><div className="section-kicker"><span>05</span><span>{rtl ? 'محطات مهمة' : 'MILESTONES'}</span></div><h2>{t.achievements}<span className="accent-period">.</span></h2><p>{t.achievementsIntro}</p></div></div>
        {data.loading ? <LoadingLine /> : data.achievements.length ? <div className="achievement-grid">{data.achievements.map(item => <article className="achievement-card" key={item.id}><div className="achievement-icon"><Award size={20} /></div><div><h3>{localize(item, 'title', lang)}</h3><span>{localize(item, 'issuer', lang)}{item.date ? ` · ${item.date}` : ''}</span><p>{localize(item, 'description', lang)}</p>{item.credential_url && <a href={item.credential_url} target="_blank" rel="noreferrer">{t.viewCredential}<ArrowUpRight size={13} /></a>}</div></article>)}</div> : <EmptyState text={t.noAchievements} />}
      </section>}

      {data.settings.show_extra_content && data.content.length > 0 && <section className="section wrap extra-section" id="more"><div className="section-kicker"><span>06</span><span>{t.extraContent.toUpperCase()}</span></div><div className="extra-grid">{data.content.map(item => <article key={item.id}><h3>{localize(item, 'title', lang)}</h3><p>{localize(item, 'body', lang)}</p></article>)}</div></section>}

      <section className="contact-section" id="contact"><div className="wrap contact-inner"><div className="section-kicker"><span>07</span><span>{rtl ? 'الخطوة التالية' : 'NEXT STEP'}</span></div><div className="contact-grid"><div><h2>{rtl ? 'لنبنِ شيئًا جيدًا.' : 'Let’s build something thoughtful.'}<span className="accent-period">.</span></h2><p>{t.contactIntro}</p></div><div className="contact-methods">{profile.email && <a href={`mailto:${profile.email}`}><span><Mail size={18} /></span><div><small>{t.email}</small><b>{profile.email}</b></div><ArrowUpRight size={16} /></a>}{profile.phone && <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}><span><Phone size={18} /></span><div><small>{t.phone}</small><b>{profile.phone}</b></div><ArrowUpRight size={16} /></a>}{profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer"><span><Linkedin size={18} /></span><div><small>LinkedIn</small><b>{rtl ? 'تواصل عبر لينكدإن' : 'Connect professionally'}</b></div><ArrowUpRight size={16} /></a>}</div></div><footer className="site-footer"><a className="wordmark footer-mark" href="#top"><span className="wordmark-mark">{(profile.full_name || 'P').trim().charAt(0).toUpperCase()}</span><span>{profile.full_name || 'Portfolio'}<small>PORTFOLIO</small></span></a><span>{t.footer} © {new Date().getFullYear()}</span><div className="footer-social">{profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></a>}{profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>}<button onClick={() => setLang(rtl ? 'en' : 'ar')}>{rtl ? 'English' : 'العربية'}</button></div></footer></div></section>
    </main>
    <AdminAnchor />
  </div>;
}

function AdminAnchor() { return <span id="admin" className="admin-anchor" />; }
function EmptyState({ text }: { text: string }) { return <div className="empty-state"><span><Sparkles size={18} /></span><p>{text}</p></div>; }
function LoadingLine() { return <div className="loading-line"><LoaderCircle size={18} className="spin" /> Loading content…</div>; }

function AdminApp({ lang, onExit }: { lang: Lang; onExit: () => void }) {
  const [session, setSession] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginEmail, setLoginEmail] = useState(''); const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(''); const [loginBusy, setLoginBusy] = useState(false);
  const [activeKey, setActiveKey] = useState('overview');
  const [records, setRecords] = useState<Row[]>([]); const [counts, setCounts] = useState<Record<string, number>>({});
  const [recordBusy, setRecordBusy] = useState(false); const [notice, setNotice] = useState(''); const [error, setError] = useState('');
  const [editing, setEditing] = useState<Row | null>(null); const [form, setForm] = useState<Row>({}); const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState<Row>(EMPTY_PROFILE as unknown as Row); const [settingsForm, setSettingsForm] = useState<Row>(EMPTY_SETTINGS as unknown as Row);
  const [globalSearch, setGlobalSearch] = useState(''); const fileInput = useRef<HTMLInputElement | null>(null); const [uploadKey, setUploadKey] = useState('');
  const rtl = lang === 'ar';

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return; }
    void supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); setAuthReady(true); });
    return () => listener.subscription.unsubscribe();
  }, []);

  const checkAdmin = useCallback(async () => {
    if (!supabase || !session?.user?.id) { setIsAdmin(false); return; }
    const { data, error: adminError } = await supabase.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle();
    setIsAdmin(Boolean(data && !adminError));
    if (adminError) setError(`Unable to verify admin access: ${adminError.message}`);
  }, [session]);
  useEffect(() => { void checkAdmin(); }, [checkAdmin]);

  const activeResource = useMemo(() => resources.find(r => r.key === activeKey), [activeKey]);
  const loadAdminData = useCallback(async () => {
    if (!supabase || !isAdmin) return;
    setRecordBusy(true); setError('');
    try {
      const [profileResult, settingsResult, ...tableResults] = await Promise.all([
        supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
        supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
        ...resources.map(r => supabase!.from(r.table).select('*').order('sort_order', { ascending: true }))
      ]);
      if (profileResult.error) throw profileResult.error; if (settingsResult.error) throw settingsResult.error;
      setProfileForm((profileResult.data || EMPTY_PROFILE) as unknown as Row); setSettingsForm((settingsResult.data || EMPTY_SETTINGS) as unknown as Row);
      const newCounts: Record<string, number> = {};
      tableResults.forEach((result, i) => { if (result.error) throw result.error; newCounts[resources[i].key] = result.data?.length ?? 0; });
      setCounts(newCounts);
      const idx = resources.findIndex(r => r.key === activeKey);
      setRecords(idx >= 0 ? (tableResults[idx].data as Row[]) ?? [] : []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to load admin data.'); }
    finally { setRecordBusy(false); }
  }, [isAdmin, activeKey]);
  useEffect(() => { void loadAdminData(); }, [loadAdminData]);

  const setActive = (key: string) => { setActiveKey(key); setNotice(''); setError(''); setEditing(null); setForm({}); };
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); if (!supabase) return; setLoginBusy(true); setLoginError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (authError) setLoginError(authError.message); setLoginBusy(false);
  };
  const handleLogout = async () => { if (supabase) await supabase.auth.signOut(); setIsAdmin(false); setSession(null); onExit(); };
  const startCreate = () => { setEditing({}); setForm({ is_published: true, is_visible: true, is_current: false, featured: false, sort_order: records.length + 1, level: 0 }); setNotice(''); setError(''); };
  const startEdit = (item: Row) => { setEditing(item); setForm({ ...item, tech_stack: Array.isArray(item.tech_stack) ? item.tech_stack.join(', ') : item.tech_stack || '' }); setNotice(''); setError(''); };
  const convertValue = (field: FieldDef, value: unknown) => {
    if (field.type === 'number') return value === '' || value === null ? null : Number(value);
    if (field.type === 'boolean') return Boolean(value);
    if (field.type === 'list') return String(value || '').split(',').map(s => s.trim()).filter(Boolean);
    if (field.type === 'date') return value === '' || value === null ? null : value;
    return value ?? '';
  };
  const saveResource = async (e: FormEvent) => {
    e.preventDefault(); if (!supabase || !activeResource) return; setSaving(true); setError(''); setNotice('');
    try {
      const payload: Row = {};
      activeResource.fields.forEach(field => { payload[field.key] = convertValue(field, form[field.key]); });
      if (editing?.id) {
        const { error: updateError } = await supabase.from(activeResource.table).update(payload).eq('id', editing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from(activeResource.table).insert(payload);
        if (insertError) throw insertError;
      }
      setEditing(null); setForm({}); setNotice('Changes saved successfully.'); await loadAdminData();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save this item.'); }
    finally { setSaving(false); }
  };
  const saveSingleton = async (e: FormEvent, table: 'profile' | 'site_settings', value: Row) => {
    e.preventDefault(); if (!supabase) return; setSaving(true); setError(''); setNotice('');
    try { const { error: upsertError } = await supabase.from(table).upsert({ ...value, id: 1 }); if (upsertError) throw upsertError; setNotice('Changes saved successfully.'); await loadAdminData(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not save settings.'); }
    finally { setSaving(false); }
  };
  const deleteRecord = async (item: Row) => {
    if (!supabase || !activeResource || !window.confirm(`Delete “${item[activeResource.titleField] || 'this item'}”? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from(activeResource.table).delete().eq('id', item.id);
    if (deleteError) setError(deleteError.message); else { setNotice('Item deleted.'); await loadAdminData(); }
  };
  const uploadFile = async (file?: File) => {
    if (!file || !supabase) return;
    if (file.size > 50 * 1024 * 1024) { setError('File is larger than 50 MB. Please compress it first.'); return; }
    setSaving(true); setError('');
    try {
      const cleanName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
      const path = `${session.user.id}/${Date.now()}-${cleanName}`;
      const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
      if (activeKey === 'profile') setProfileForm(old => ({ ...old, [uploadKey]: data.publicUrl }));
      else if (activeKey === 'settings') setSettingsForm(old => ({ ...old, [uploadKey]: data.publicUrl }));
      else setForm(old => ({ ...old, [uploadKey]: data.publicUrl }));
      setNotice('File uploaded. Save the form to keep this URL.');
    } catch (e) { setError(e instanceof Error ? e.message : 'File upload failed. Check the storage policies.'); }
    finally { setSaving(false); if (fileInput.current) fileInput.current.value = ''; }
  };
  const triggerUpload = (field: FieldDef) => { setUploadKey(field.key); if (fileInput.current) { fileInput.current.accept = field.key === 'video_url' ? 'video/*' : (field.key === 'resume_url' || field.key === 'credential_url') ? 'application/pdf' : 'image/*'; fileInput.current.click(); } };

  if (!authReady) return <AdminLoading />;
  if (!isSupabaseConfigured || !supabase) return <SetupGate lang={lang} onExit={onExit} />;
  if (!session) return <div className="admin-gate" dir={rtl ? 'rtl' : 'ltr'}><a className="back-site" href="/" onClick={e => { e.preventDefault(); onExit(); }}><ArrowLeft size={16} /> Back to website</a><div className="login-card"><div className="login-mark"><LockKeyhole size={23} /></div><span className="admin-eyebrow">PRIVATE WORKSPACE</span><h1>{rtl ? 'مرحبًا بعودتك.' : 'Welcome back.'}</h1><p>{rtl ? 'سجّل الدخول لإدارة محتوى موقعك.' : 'Sign in to manage your portfolio content.'}</p><form onSubmit={handleLogin} className="stack-form"><label>Email address<input autoComplete="username" type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@example.com" /></label><label>Password<input autoComplete="current-password" type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Your password" /></label>{loginError && <div className="form-error">{loginError}</div>}<button className="button button-primary full-width" disabled={loginBusy}>{loginBusy ? <LoaderCircle size={16} className="spin" /> : <LockKeyhole size={16} />} Sign in securely</button></form><div className="login-foot"><ShieldCheck size={15} /> Admin access only. Public registration is disabled.</div></div></div>;
  if (!isAdmin) return <div className="admin-gate"><div className="login-card"><div className="login-mark"><ShieldCheck size={23} /></div><h1>Admin access not enabled</h1><p>You are signed in, but this user is not listed in the database's <code>admins</code> table. Follow the setup guide to grant admin access.</p>{error && <div className="form-error">{error}</div>}<button className="button button-primary full-width" onClick={handleLogout}>Sign out</button></div></div>;

  const renderField = (field: FieldDef, value: Row, setter: (value: Row) => void) => {
    const current = value[field.key]; const controlId = `field-${field.key}`;
    if (field.type === 'boolean') return <label className="toggle-field" key={field.key} htmlFor={controlId}><span><b>{field.label}</b>{field.hint && <small>{field.hint}</small>}</span><input id={controlId} type="checkbox" checked={Boolean(current)} onChange={e => setter({ ...value, [field.key]: e.target.checked })} /><i /></label>;
    return <label className={cx('admin-field', field.type === 'textarea' && 'field-wide')} key={field.key} htmlFor={controlId}><span>{field.label}</span>{field.type === 'textarea' ? <textarea id={controlId} rows={4} value={current ?? ''} onChange={e => setter({ ...value, [field.key]: e.target.value })} placeholder={`Enter ${field.label.toLowerCase()}…`} /> : <div className="field-with-upload"><input id={controlId} type={field.type === 'color' ? 'color' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} value={current ?? ''} onChange={e => setter({ ...value, [field.key]: field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value })} placeholder={field.type === 'list' ? 'Item one, Item two, Item three' : field.type === 'url' ? 'https://' : `Enter ${field.label.toLowerCase()}…`} />{['image_url', 'avatar_url', 'video_url', 'resume_url', 'credential_url'].includes(field.key) && <button type="button" className="upload-button" onClick={() => triggerUpload(field)} title="Upload file"><Upload size={15} /></button>}</div>}{field.hint && <small>{field.hint}</small>}</label>;
  };

  return <div className="admin-layout" dir="ltr">
    <aside className="admin-sidebar"><a href="/" className="admin-brand" onClick={e => { e.preventDefault(); onExit(); }}><span className="wordmark-mark"><LayoutDashboard size={18} /></span><span>Portfolio Studio<small>CONTROL CENTER</small></span></a><div className="sidebar-label">WORKSPACE</div><button className={cx('sidebar-link', activeKey === 'overview' && 'active')} onClick={() => setActive('overview')}><LayoutDashboard size={17} />Overview</button><div className="sidebar-label">CONTENT MANAGER</div>{[{ key: 'profile', label: 'Profile', icon: UserRound }, { key: 'projects', label: 'Projects', icon: Code2 }, { key: 'experience', label: 'Experience', icon: BriefcaseBusiness }, { key: 'skills', label: 'Skills', icon: Wrench }, { key: 'achievements', label: 'Achievements', icon: Award }, { key: 'content', label: 'Page sections', icon: PenLine }].map(item => <button key={item.key} className={cx('sidebar-link', activeKey === item.key && 'active')} onClick={() => setActive(item.key)}><item.icon size={17} />{item.label}{counts[item.key] !== undefined && <span className="sidebar-count">{counts[item.key]}</span>}</button>)}<div className="sidebar-label">CONFIGURATION</div><button className={cx('sidebar-link', activeKey === 'settings' && 'active')} onClick={() => setActive('settings')}><Settings2 size={17} />Site settings</button><div className="sidebar-bottom"><div className="admin-user"><span className="admin-avatar">{String(session.user.email || 'A').charAt(0).toUpperCase()}</span><span><b>{session.user.email}</b><small>Administrator</small></span></div><button onClick={handleLogout} className="logout-link"><LockKeyhole size={15} />Sign out</button></div></aside>
    <main className="admin-main"><header className="admin-topbar"><div><span className="admin-breadcrumb">Workspace <span>/</span> {activeKey === 'overview' ? 'Overview' : activeKey === 'profile' ? 'Profile' : activeKey === 'settings' ? 'Site settings' : activeResource?.label}</span><h1>{activeKey === 'overview' ? 'Overview' : activeKey === 'profile' ? 'Profile settings' : activeKey === 'settings' ? 'Site settings' : activeResource?.label}</h1></div><div className="admin-top-actions"><a href="/" className="visit-site" onClick={e => { e.preventDefault(); onExit(); }}><ExternalLink size={15} />View website</a></div></header>
      {notice && <div className="admin-alert success"><Check size={16} />{notice}<button onClick={() => setNotice('')}><X size={15} /></button></div>}{error && <div className="admin-alert error"><X size={16} />{error}<button onClick={() => setError('')}><X size={15} /></button></div>}
      {activeKey === 'overview' && <div className="admin-content"><div className="dashboard-welcome"><div><span className="admin-eyebrow">YOUR CONTROL CENTER</span><h2>Everything in one place.</h2><p>Keep your portfolio current by updating details, showcasing real projects, and publishing milestones.</p></div><div className="welcome-art"><LayoutDashboard size={54} strokeWidth={1} /><span /><span /></div></div><div className="stats-grid"><div className="stat-card"><span className="stat-icon"><Code2 size={18} /></span><small>Projects</small><strong>{counts.projects ?? 0}</strong><span className="stat-foot">Portfolio items</span></div><div className="stat-card"><span className="stat-icon"><BriefcaseBusiness size={18} /></span><small>Experience</small><strong>{counts.experience ?? 0}</strong><span className="stat-foot">Timeline entries</span></div><div className="stat-card"><span className="stat-icon"><Wrench size={18} /></span><small>Skills</small><strong>{counts.skills ?? 0}</strong><span className="stat-foot">Listed capabilities</span></div><div className="stat-card"><span className="stat-icon"><Award size={18} /></span><small>Achievements</small><strong>{counts.achievements ?? 0}</strong><span className="stat-foot">Milestones</span></div></div><div className="dashboard-lower"><section className="admin-panel"><div className="panel-head"><div><h3>Quick actions</h3><p>Jump into a content area.</p></div><Sparkles size={19} /></div><div className="quick-actions">{resources.map(r => <button key={r.key} onClick={() => setActive(r.key)}><span><r.icon size={17} /></span><div><b>Manage {r.label.toLowerCase()}</b><small>{counts[r.key] ?? 0} items</small></div><ArrowUpRight size={15} /></button>)}</div></section><section className="admin-panel checklist-panel"><div className="panel-head"><div><h3>Launch checklist</h3><p>Before sharing your website.</p></div><ShieldCheck size={20} /></div><div className="checklist"><span><Check size={15} />Create your profile and add a real photo</span><span><Check size={15} />Publish at least one complete project</span><span><Check size={15} />Test the Arabic and English layouts</span><span><Check size={15} />Verify public links and contact details</span><span><Check size={15} />Review what visitors can see</span></div><button className="button button-quiet full-width" onClick={() => setActive('profile')}>Complete profile <ArrowUpRight size={15} /></button></section></div><div className="admin-safe-note"><ShieldCheck size={17} /><div><b>Security built in</b><p>Content editing is guarded by Supabase authentication and row-level security policies. Keep your service-role key private; the browser uses only the public key.</p></div></div></div>}
      {activeKey === 'profile' && <div className="admin-content"><div className="content-toolbar"><div><h2>Public identity</h2><p>These details power the hero, about, social links, and contact section.</p></div></div><form className="admin-panel editor-panel" onSubmit={e => saveSingleton(e, 'profile', profileForm)}><div className="form-section-title"><span>01</span><div><h3>Profile information</h3><p>Write accurate details in both languages.</p></div></div><div className="form-grid">{profileFields.map(f => renderField(f, profileForm, setProfileForm))}</div><input ref={fileInput} hidden type="file" onChange={e => void uploadFile(e.target.files?.[0])} /><div className="form-actions"><span>Save changes to publish them to your website.</span><button className="button button-primary" disabled={saving}>{saving ? <LoaderCircle size={16} className="spin" /> : <Save size={16} />} Save profile</button></div></form></div>}
      {activeKey === 'settings' && <div className="admin-content"><div className="content-toolbar"><div><h2>Site configuration</h2><p>Control the site title, accent color, and which sections appear publicly.</p></div></div><form className="admin-panel editor-panel" onSubmit={e => saveSingleton(e, 'site_settings', settingsForm)}><div className="form-section-title"><span>01</span><div><h3>Appearance & sections</h3><p>Changes take effect when the public site refreshes.</p></div></div><div className="form-grid">{settingFields.map(f => renderField(f, settingsForm, setSettingsForm))}</div><div className="form-actions"><span>Prefer a quiet, high-contrast palette.</span><button className="button button-primary" disabled={saving}>{saving ? <LoaderCircle size={16} className="spin" /> : <Save size={16} />} Save settings</button></div></form></div>}
      {activeResource && <div className="admin-content"><div className="content-toolbar"><div><h2>Manage {activeResource.label.toLowerCase()}</h2><p>Create, edit, publish, reorder, or remove items from your public website.</p></div><button className="button button-primary" onClick={startCreate}><Plus size={16} />Add {activeResource.key === 'content' ? 'section' : activeResource.key === 'experience' ? 'entry' : 'item'}</button></div>{editing !== null && <form className="admin-panel editor-panel" onSubmit={saveResource}><div className="form-section-title"><span>{editing.id ? 'EDIT' : 'NEW'}</span><div><h3>{editing.id ? `Edit ${activeResource.label.toLowerCase().slice(0, -1)}` : `Create ${activeResource.label.toLowerCase().slice(0, -1)}`}</h3><p>Complete the fields you need. Unused optional fields can stay blank.</p></div><button type="button" className="icon-button" onClick={() => setEditing(null)} aria-label="Close editor"><X size={17} /></button></div><div className="form-grid">{activeResource.fields.map(f => renderField(f, form, setForm))}</div><input ref={fileInput} hidden type="file" onChange={e => void uploadFile(e.target.files?.[0])} /><div className="form-actions"><button type="button" className="button button-quiet" onClick={() => setEditing(null)}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? <LoaderCircle size={16} className="spin" /> : <Save size={16} />} Save item</button></div></form>}
        <div className="admin-panel records-panel"><div className="records-head"><div><h3>All {activeResource.label.toLowerCase()}</h3><p>{records.length} total items</p></div><div className="search-box"><span>⌕</span><input value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} placeholder="Search items…" /></div></div>{recordBusy ? <LoadingLine /> : <div className="records-list">{records.filter(item => JSON.stringify(item).toLowerCase().includes(globalSearch.toLowerCase())).map(item => <article className="record-row" key={item.id}><div className="record-thumb">{activeResource.key === 'projects' && item.image_url ? <img src={item.image_url} alt="" /> : <activeResource.icon size={18} />}</div><div className="record-summary"><b>{item[activeResource.titleField] || item.section_key || 'Untitled item'}</b><span>{item[activeResource.key === 'projects' ? 'description_en' : activeResource.key === 'experience' ? 'company_en' : activeResource.key === 'skills' ? 'category_en' : activeResource.key === 'achievements' ? 'issuer_en' : 'section_key'] || 'No secondary details'}</span></div><span className={cx('status-pill', (item[activeResource.publishField || 'is_published'] ?? true) ? 'published' : 'draft')}>{(item[activeResource.publishField || 'is_published'] ?? true) ? 'Published' : 'Hidden'}</span><button className="icon-button" onClick={() => startEdit(item)} aria-label="Edit item"><PenLine size={16} /></button><button className="icon-button danger-button" onClick={() => void deleteRecord(item)} aria-label="Delete item"><Trash2 size={16} /></button></article>)}{records.length === 0 && <EmptyState text="Nothing here yet. Add your first item to get started." />}{records.length > 0 && records.filter(item => JSON.stringify(item).toLowerCase().includes(globalSearch.toLowerCase())).length === 0 && <EmptyState text="No items match your search." />}</div>}</div></div>}
      <footer className="admin-footer"><span>Portfolio Studio · Admin</span><span>Protected by Supabase Auth + RLS</span></footer>
    </main>
  </div>;
}

function AdminLoading() { return <div className="admin-gate"><div className="loading-line"><LoaderCircle size={19} className="spin" /> Preparing secure workspace…</div></div>; }
function SetupGate({ lang, onExit }: { lang: Lang; onExit: () => void }) { return <div className="admin-gate" dir={lang === 'ar' ? 'rtl' : 'ltr'}><a className="back-site" href="/" onClick={e => { e.preventDefault(); onExit(); }}><ArrowLeft size={16} /> Back to website</a><div className="login-card setup-card"><div className="login-mark"><Settings2 size={23} /></div><span className="admin-eyebrow">ONE-TIME SETUP</span><h1>Connect your database.</h1><p>The public preview works without credentials. The secure admin panel becomes available after you connect a Supabase project.</p><ol><li>Create a Supabase project.</li><li>Run <code>supabase/schema.sql</code> in the SQL Editor.</li><li>Copy <code>.env.example</code> to <code>.env.local</code> and add your project URL and public key.</li><li>Create the admin login and grant its ID in <code>public.admins</code>.</li></ol><a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="button button-primary full-width">Open Supabase <ArrowUpRight size={15} /></a><button className="button button-quiet full-width" onClick={onExit}>Return to portfolio preview</button></div></div>; }

export default function App() {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('portfolio-lang') === 'ar' ? 'ar' : 'en'));
  const [path, setPath] = useState(window.location.pathname);
  const setLang = (l: Lang) => { localStorage.setItem('portfolio-lang', l); setLangState(l); };
  useEffect(() => { const onChange = () => setPath(window.location.pathname); window.addEventListener('popstate', onChange); const click = (e: MouseEvent) => { const target = e.target as HTMLElement | null; const a = target?.closest('a'); if (a?.getAttribute('href') === '/admin' || a?.getAttribute('href') === '/') { const href = a.getAttribute('href')!; if (href === '/admin' || (href === '/' && window.location.pathname === '/admin')) { e.preventDefault(); window.history.pushState({}, '', href); setPath(href); } } }; document.addEventListener('click', click); return () => { window.removeEventListener('popstate', onChange); document.removeEventListener('click', click); }; }, []);
  const exitAdmin = () => { window.history.pushState({}, '', '/'); setPath('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return path.startsWith('/admin') ? <AdminApp lang={lang} onExit={exitAdmin} /> : <PortfolioSite lang={lang} setLang={setLang} />;
}
