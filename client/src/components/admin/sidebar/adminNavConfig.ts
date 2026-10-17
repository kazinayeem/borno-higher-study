import {
  LayoutDashboard,
  Sparkles,
  Briefcase,
  PenSquare,
  Globe,
  GraduationCap,
  TrendingUp,
  Award,
  FileCheck2,
  Calendar,
  Compass,
  Flag,
  Link2,
  Users,
  FileLock2,
  FileSpreadsheet,
  LucideIcon,
} from 'lucide-react';

export interface AdminNavItem {
  id: string;
  label: string;
  labelBn: string;
  icon: LucideIcon;
  tab?: string;
  href?: string;
  roles?: ('SUPER_ADMIN' | 'ADMIN' | 'DATA_EDITOR' | 'DATA_REVIEWER' | 'MODERATOR')[];
  badgeKey?: 'applications' | 'pendingPosts' | 'docQueue';
  description: string;
  descriptionBn: string;
}

export interface AdminNavGroup {
  id: string;
  title: string;
  titleBn: string;
  roles?: ('SUPER_ADMIN' | 'ADMIN' | 'DATA_EDITOR' | 'DATA_REVIEWER' | 'MODERATOR')[];
  defaultExpanded?: boolean;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: 'main',
    title: 'Main',
    titleBn: 'প্রধান',
    defaultExpanded: true,
    items: [
      {
        id: 'overview',
        label: 'Overview & Statistics',
        labelBn: 'ওভারভিউ ও পরিসংখ্যান',
        icon: LayoutDashboard,
        tab: 'overview',
        description: 'System overview, dataset metrics, ingestion runs & audit logs',
        descriptionBn: 'সিস্টেম সামগ্রিক অবস্থা, মেট্রিক্স, পাইপলাইন রান ও অডিট লগ',
      },
    ],
  },
  {
    id: 'content_publishing',
    title: 'Content & Publishing',
    titleBn: 'বিষয়বস্তু ও প্রকাশনা',
    defaultExpanded: true,
    items: [
      {
        id: 'content',
        label: 'Editorial Content Studio',
        labelBn: 'এডিটরিয়াল কন্টেন্ট স্টুডিও',
        icon: Sparkles,
        tab: 'content',
        description: 'Publish and curate 100+ articles, research papers & comparison guides',
        descriptionBn: '১০০+ শিক্ষামূলক আর্টিকেল, গবেষণা পত্র ও তুলনামূলক গাইড পরিচালনা',
      },
      {
        id: 'career-toolkit',
        label: 'Career Toolkit & CV',
        labelBn: 'ক্যারিয়ার টুলকিট ও সিভি',
        icon: Briefcase,
        tab: 'career-toolkit',
        description: '52 Research records, CV models, Europass templates & cover letters',
        descriptionBn: '৫২টি গবেষণালব্ধ সিভি মডেল, ইউরোপাস ও কভার লেটার গাইডলাইন',
      },
      {
        id: 'posts',
        label: 'Community Moderation',
        labelBn: 'কমিউনিটি মডারেশন',
        icon: PenSquare,
        tab: 'posts',
        badgeKey: 'pendingPosts',
        description: 'Review and approve pending student questions and peer advice',
        descriptionBn: 'শিক্ষার্থীদের প্রশ্ন ও পরামর্শ যাচাই এবং অনুমোদন কিউ',
      },
    ],
  },
  {
    id: 'education_data',
    title: 'Education Data',
    titleBn: 'শিক্ষা ডেটা',
    defaultExpanded: true,
    items: [
      {
        id: 'coverage',
        label: 'Country & Registries',
        labelBn: 'দেশ ও শিক্ষা প্রতিষ্ঠান',
        icon: Globe,
        tab: 'coverage',
        description: 'Global university coverage, WHED directories & national registries',
        descriptionBn: 'বৈশ্বিক বিশ্ববিদ্যালয় কভারেজ, WHED ডিরেক্টরি ও জাতীয় তালিকা',
      },
      {
        id: 'academic',
        label: 'Academic Requirements',
        labelBn: 'একাডেমিক প্রয়োজনীয়তা',
        icon: GraduationCap,
        tab: 'academic',
        description: 'Country grade scales, GPA equivalencies & subject prerequisites',
        descriptionBn: 'জিপিএ সমমান রূপান্তর, গ্রেডিং স্কেল ও বিষয়ভিত্তিক শর্তাবলী',
      },
      {
        id: 'work-guide',
        label: 'Work & Career Guide',
        labelBn: 'কাজের নিয়ম ও মজুরি',
        icon: TrendingUp,
        tab: 'work-guide',
        description: 'Minimum wages, student work regulations & post-study graduate routes',
        descriptionBn: 'সংবিধিবদ্ধ ন্যূনতম মজুরি, কাজের বৈধ সময়সীমা ও গ্র্যাজুয়েট রুট',
      },
      {
        id: 'english-tests',
        label: 'English Tests & Policies',
        labelBn: 'ইংরেজি টেস্ট ও নীতিমালা',
        icon: Award,
        tab: 'english-tests',
        description: '7 English tests, Bangladesh test fee matrix & university policies',
        descriptionBn: '৭টি ইংরেজি পরীক্ষা, বাংলাদেশ ফি এবং বিশ্ববিদ্যালয় শর্তাবলী',
      },
      {
        id: 'moi',
        label: 'MOI & Language Waivers',
        labelBn: 'এমওআই ও ভাষা ছাড়',
        icon: FileCheck2,
        tab: 'moi',
        description: 'Medium of instruction acceptance policies & conditional waivers',
        descriptionBn: 'ইংরেজি মাধ্যমের সনদ গ্রহণযোগ্যতা ও শর্তসাপেক্ষ ছাড় নীতিমালা',
      },
      {
        id: 'deadlines',
        label: 'Intakes & Deadlines',
        labelBn: 'ইনটেক ও ডেডলাইন',
        icon: Calendar,
        tab: 'deadlines',
        description: 'Application intake cycles, deadlines & document submission windows',
        descriptionBn: 'ভর্তি আবেদন সেশন, ডেডলাইন ও নথি জমার সময়সূচি',
      },
    ],
  },
  {
    id: 'immigration_research',
    title: 'Immigration & Research',
    titleBn: 'ভিসা ও তথ্য যাচাই',
    defaultExpanded: false,
    items: [
      {
        id: 'visa',
        label: 'Visa Intelligence',
        labelBn: 'ভিসা পরিসংখ্যান ও সেন্টার',
        icon: Compass,
        tab: 'visa',
        description: 'Global visa approval rates, embassy/VFS/TLS centres & fees in Dhaka',
        descriptionBn: 'বৈশ্বিক ভিসা মঞ্জুরির হার, ঢাকায় আবেদন সেন্টার ও প্রসেসিং ফি',
      },
      {
        id: 'reports',
        label: 'Factual Reports Queue',
        labelBn: 'তথ্য সংশোধন রিপোর্ট',
        icon: Flag,
        tab: 'reports',
        description: 'Review student-reported factual discrepancies and update logs',
        descriptionBn: 'শিক্ষার্থীদের রিপোর্ট করা তথ্য যাচাই ও ডেটাবেজ সংশোধন কিউ',
      },
      {
        id: 'link-health',
        label: 'Link Health & Repairs',
        labelBn: 'লিংক হেলথ ও মেরামত',
        icon: Link2,
        tab: 'link-health',
        description: 'Automated 404 detection and broken link remediation studio',
        descriptionBn: 'স্বয়ংক্রিয় লিংক অডিট, ৪০৪ ত্রুটি শনাক্তকরণ ও প্রতিস্থাপন',
      },
    ],
  },
  {
    id: 'people_access',
    title: 'People & Access',
    titleBn: 'ব্যবহারকারী ও এক্সেস',
    defaultExpanded: false,
    items: [
      {
        id: 'contributors',
        label: 'Contributor Applications',
        labelBn: 'কন্ট্রিবিউটর আবেদন',
        icon: Users,
        tab: 'contributors',
        badgeKey: 'applications',
        description: 'Review student alumni and verified contributor applications',
        descriptionBn: 'যাচাইকৃত শিক্ষার্থী কন্ট্রিবিউটর আবেদন পর্যালোচনা ও অনুমোদন',
      },
    ],
  },
  {
    id: 'documents_finance',
    title: 'Documents & Finance',
    titleBn: 'নথিপত্র ও অর্থায়ন',
    roles: ['SUPER_ADMIN'],
    defaultExpanded: false,
    items: [
      {
        id: 'documents',
        label: 'Financial Documents',
        labelBn: 'আর্থিক নথি যাচাই',
        icon: FileLock2,
        tab: 'documents',
        badgeKey: 'docQueue',
        roles: ['SUPER_ADMIN'],
        description: 'Confidential bank statements, solvency certificates & asset review',
        descriptionBn: 'গোপনীয় ব্যাংক স্টেটমেন্ট ও আর্থিক স্বচ্ছলতা সনদ যাচাই কিউ',
      },
    ],
  },
  {
    id: 'system_pipelines',
    title: 'System & Pipelines',
    titleBn: 'সিস্টেম ও পাইপলাইন',
    defaultExpanded: false,
    items: [
      {
        id: 'verification',
        label: 'CSV & Ingestion Pipeline',
        labelBn: 'সিএসভি ও ইনজেশন পাইপলাইন',
        icon: FileSpreadsheet,
        href: '/admin/verification',
        description: 'Bulk CSV dataset import, duplicate entity detection & verification flags',
        descriptionBn: 'বাল্ক সিএসভি ফাইল আপলোড, ডুপ্লিকেট শনাক্তকরণ ও ভেরিফিকেশন ফ্ল্যাগ',
      },
    ],
  },
];

/**
 * Finds the matching navigation item by active tab or route href
 */
export function findActiveNavItem(
  currentTab: string | null,
  currentPathname: string
): { group: AdminNavGroup; item: AdminNavItem } | null {
  for (const group of ADMIN_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href && currentPathname === item.href) {
        return { group, item };
      }
      if (item.tab && currentTab === item.tab) {
        return { group, item };
      }
    }
  }

  // Fallback to overview if on /super-admin/dashboard or /admin without specific tab
  if (
    (currentPathname === '/super-admin/dashboard' || currentPathname === '/admin') &&
    (!currentTab || currentTab === 'overview')
  ) {
    const mainGroup = ADMIN_NAV_GROUPS[0];
    const overviewItem = mainGroup.items[0];
    return { group: mainGroup, item: overviewItem };
  }

  return null;
}
