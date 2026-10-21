export type Lang = 'en' | 'ar';
export type Row = Record<string, any> & { id?: string | number; created_at?: string; updated_at?: string };

export type Profile = {
  id?: number;
  full_name: string;
  role_en: string; role_ar: string;
  headline_en: string; headline_ar: string;
  bio_en: string; bio_ar: string;
  avatar_url: string; email: string; phone: string;
  location_en: string; location_ar: string;
  github_url: string; linkedin_url: string; website_url: string; resume_url: string;
};

export type SiteSettings = {
  id?: number; site_title_en: string; site_title_ar: string;
  accent_color: string; show_projects: boolean; show_experience: boolean;
  show_skills: boolean; show_achievements: boolean; show_extra_content: boolean;
};

export const EMPTY_PROFILE: Profile = {
  id: 1, full_name: '', role_en: '', role_ar: '', headline_en: '', headline_ar: '',
  bio_en: '', bio_ar: '', avatar_url: '', email: '', phone: '', location_en: '', location_ar: '',
  github_url: '', linkedin_url: '', website_url: '', resume_url: ''
};

export const EMPTY_SETTINGS: SiteSettings = {
  id: 1, site_title_en: 'Portfolio', site_title_ar: 'معرض الأعمال', accent_color: '#7c9ac2',
  show_projects: true, show_experience: true, show_skills: true, show_achievements: true, show_extra_content: true
};
