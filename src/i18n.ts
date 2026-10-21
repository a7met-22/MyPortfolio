import type { Lang } from './types';
export const words = {
  en: {
    navAbout: 'About', navExperience: 'Experience', navProjects: 'Projects', navSkills: 'Skills', navContact: 'Contact',
    hello: 'PERSONAL PORTFOLIO', selected: 'Selected work', projectsIntro: 'A few projects, experiments, and things built with care.', about: 'A little about me',
    experience: 'Experience & learning', experienceIntro: 'A timeline of roles, learning, and professional growth.', skills: 'Tools & capabilities', achievements: 'Achievements', achievementsIntro: 'Certifications, milestones, and recognitions worth sharing.', contact: 'Let’s connect', contactIntro: 'Have a role, project, or thoughtful question in mind? Get in touch.',
    viewCode: 'View code', liveDemo: 'Live demo', playVideo: 'Watch demo', noProjects: 'Projects will appear here once they are published.', noExperience: 'Experience entries will appear here when added.', noSkills: 'Skills will appear here when added.', noAchievements: 'Achievements will appear here when added.', demoNotice: 'Preview mode: these are sample entries. Connect the database and replace them with your own information.',
    location: 'Based in', email: 'Email', phone: 'Phone', openAdmin: 'Admin sign in', footer: 'Designed with care. Built to evolve.', featured: 'Featured', present: 'Present', viewCredential: 'View credential', explore: 'Explore projects', resume: 'View résumé', extraContent: 'More', basedOn: 'Based in', allRights: 'All rights reserved.'
  },
  ar: {
    navAbout: 'نبذة عني', navExperience: 'الخبرات', navProjects: 'المشاريع', navSkills: 'المهارات', navContact: 'تواصل معي',
    hello: 'الموقع الشخصي', selected: 'أعمال مختارة', projectsIntro: 'مجموعة من المشاريع والتجارب التي تستحق العرض.', about: 'نبذة عني',
    experience: 'الخبرات والتعلّم', experienceIntro: 'محطات مهنية وتعليمية ونقاط تطور في المسيرة.', skills: 'الأدوات والمهارات', achievements: 'الإنجازات', achievementsIntro: 'الشهادات والمحطات والإنجازات التي تستحق المشاركة.', contact: 'لنتواصل معًا', contactIntro: 'لديك فرصة عمل أو مشروع أو سؤال؟ يسعدني تواصلك.',
    viewCode: 'عرض الكود', liveDemo: 'التجربة المباشرة', playVideo: 'مشاهدة العرض', noProjects: 'ستظهر المشاريع هنا بعد نشرها من لوحة التحكم.', noExperience: 'ستظهر الخبرات هنا عند إضافتها.', noSkills: 'ستظهر المهارات هنا عند إضافتها.', noAchievements: 'ستظهر الإنجازات هنا عند إضافتها.', demoNotice: 'وضع المعاينة: هذه بيانات تجريبية. اربط قاعدة البيانات واستبدلها بمعلوماتك الحقيقية.',
    location: 'الموقع', email: 'البريد الإلكتروني', phone: 'الهاتف', openAdmin: 'دخول لوحة التحكم', footer: 'تصميم متقن وقابل للتطوير.', featured: 'مميز', present: 'حتى الآن', viewCredential: 'عرض الشهادة', explore: 'استكشف المشاريع', resume: 'عرض السيرة الذاتية', extraContent: 'المزيد', basedOn: 'الموقع', allRights: 'جميع الحقوق محفوظة.'
  }
} satisfies Record<Lang, Record<string, string>>;
