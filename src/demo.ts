import type { Profile, SiteSettings } from './types';

// Clearly marked, fictional examples used only when Supabase has not been configured.
export const DEMO_PROFILE: Profile = {
  id: 1,
  full_name: 'Your Name',
  role_en: 'Software Quality & Automation Engineer',
  role_ar: 'مهندس جودة برمجيات وأتمتة',
  headline_en: 'Reliable software. Thoughtful testing. Practical automation.',
  headline_ar: 'برمجيات موثوقة، واختبارات مدروسة، وأتمتة عملية.',
  bio_en: 'Replace this sample with a genuine introduction about your background, the problems you enjoy solving, and the value you bring to a team. No professional claims have been assumed.',
  bio_ar: 'استبدل النص التجريبي بنبذة حقيقية عن خلفيتك، والمشكلات التي تحب حلها، والقيمة التي تضيفها لفريق العمل. لم نفترض أي خبرات مهنية تخصك.',
  avatar_url: '', email: 'hello@example.com', phone: '+20 100 000 0000',
  location_en: 'Egypt · Open to remote collaboration', location_ar: 'مصر · متاح للتعاون عن بُعد',
  github_url: 'https://github.com/', linkedin_url: 'https://www.linkedin.com/', website_url: '', resume_url: ''
};
export const DEMO_SETTINGS: SiteSettings = {
  id: 1, site_title_en: 'Your Name — Portfolio', site_title_ar: 'اسمك — معرض الأعمال', accent_color: '#8daed8',
  show_projects: true, show_experience: true, show_skills: true, show_achievements: true, show_extra_content: true
};
export const DEMO_PROJECTS = [
  { id: 'demo-1', title_en: 'API Automation Framework · Sample', title_ar: 'إطار أتمتة واجهات API · مثال تجريبي', description_en: 'A sample project card. Replace this content with an actual project, a concise problem statement, the approach, and measurable results where available.', description_ar: 'بطاقة مشروع تجريبية. استبدلها بمشروع نفذته فعلًا مع توضيح المشكلة والحل والنتيجة إن توفرت.', tech_stack: ['Java', 'Rest Assured', 'JUnit'], image_url: '', video_url: '', github_url: '', demo_url: '', featured: true, is_published: true, sort_order: 1 },
  { id: 'demo-2', title_en: 'Document Assistant · Sample', title_ar: 'مساعد مستندات · مثال تجريبي', description_en: 'Use this space for a short live demonstration video or an overview of a real technical project.', description_ar: 'استخدم هذه المساحة لفيديو قصير يوضح تشغيل مشروع حقيقي أو لشرح فكرته.', tech_stack: ['Python', 'RAG', 'LLM'], image_url: '', video_url: '', github_url: '', demo_url: '', featured: false, is_published: true, sort_order: 2 }
];
export const DEMO_EXPERIENCE = [
  { id: 'demo-exp-1', role_en: 'Add a role or learning milestone', role_ar: 'أضف وظيفة أو محطة تعلم', company_en: 'Organization / Personal Learning', company_ar: 'جهة العمل / التعلم الشخصي', location_en: 'Location (optional)', location_ar: 'الموقع (اختياري)', start_date: '', end_date: '', is_current: false, description_en: 'This is a placeholder, not a claim of employment. Replace it with an accurate description or delete it.', description_ar: 'هذا نص تجريبي وليس ادعاءً بخبرة وظيفية. استبدله بوصف دقيق أو احذفه.', is_published: true, sort_order: 1 }
];
export const DEMO_SKILLS = [
  { id: 'demo-skill-1', name_en: 'Test Automation (sample)', name_ar: 'أتمتة الاختبارات (مثال)', category_en: 'Testing', category_ar: 'الاختبار', level: 0, is_published: true, sort_order: 1 },
  { id: 'demo-skill-2', name_en: 'API Testing (sample)', name_ar: 'اختبار API (مثال)', category_en: 'Testing', category_ar: 'الاختبار', level: 0, is_published: true, sort_order: 2 },
  { id: 'demo-skill-3', name_en: 'Python (sample)', name_ar: 'Python (مثال)', category_en: 'Programming', category_ar: 'البرمجة', level: 0, is_published: true, sort_order: 3 }
];
export const DEMO_ACHIEVEMENTS = [
  { id: 'demo-ach-1', title_en: 'Add a verified certification or achievement', title_ar: 'أضف شهادة أو إنجازًا موثقًا', issuer_en: 'Issuing organization', issuer_ar: 'الجهة المانحة', date: '', description_en: 'Delete this sample or replace it with an achievement you can verify.', description_ar: 'احذف هذا المثال أو استبدله بإنجاز حقيقي يمكنك توثيقه.', credential_url: '', image_url: '', is_published: true, sort_order: 1 }
];
export const DEMO_CONTENT = [
  { id: 'demo-content-1', section_key: 'approach', title_en: 'How I work', title_ar: 'منهجي في العمل', body_en: 'Describe your real working principles, how you communicate, and how you approach quality. This text is only a placeholder.', body_ar: 'اكتب مبادئك الحقيقية في العمل وطريقتك في التواصل وضمان الجودة. هذا النص للتجربة فقط.', is_visible: true, sort_order: 1 }
];
