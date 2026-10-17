// Borno Higher Study — Career Toolkit: Pre-Submission CV Checklist
// Structured categories and verification checkpoints for students prior to submitting applications.

export interface ChecklistItem {
  id: string;
  category: string;
  categoryBn: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  importance: 'CRITICAL' | 'HIGH' | 'RECOMMENDED';
}

export const CV_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'chk-instr-1',
    category: 'Application Compliance',
    categoryBn: 'আবেদন নির্দেশিকা ও নিয়মাবলী',
    titleEn: 'Does the CV strictly follow the destination institution’s instructions?',
    titleBn: 'সিভি কি গন্তব্য প্রতিষ্ঠানের সুনির্দিষ্ট পেজ ও ফরম্যাট নির্দেশিকা মেনে তৈরি?',
    descriptionEn: 'Check page limits (e.g. strict 1-page for US tech, 2-page for UK standard, unlimited for academic PhD), file type (PDF required), and whether a specific template (like Europass for DAAD or Erasmus) was mandated.',
    descriptionBn: 'পেজ লিমিট (যুক্তরাষ্ট্রে ১ পেজ, যুক্তরাজ্যে ২ পেজ, পিএইচডির ক্ষেত্রে আনলিমিটেড), ফাইল টাইপ (পিডিএফ) এবং নির্দিষ্ট ফরম্যাট (যেমন ডাড বা ইরাসমাসের ক্ষেত্রে ইউরোপাস) চেকিং সম্পন্ন করুন।',
    importance: 'CRITICAL'
  },
  {
    id: 'chk-scannable-2',
    category: 'Information Architecture',
    categoryBn: 'তথ্য বিন্যাস ও স্ক্যানেবিলিটি',
    titleEn: 'Is the most relevant information immediately visible in the top third?',
    titleBn: 'সবচেয়ে প্রাসঙ্গিক ডিগ্রি ও গবেষণা তথ্য কি ডকুমেন্টের উপরের অংশে রয়েছে?',
    descriptionEn: 'Reviewers spend an initial 10–20 seconds scanning. Ensure your degree, university name, CGPA, primary research/internship title, and top 4 skills appear without scrolling or turning the page.',
    descriptionBn: 'অ্যাডমিশন অফিসাররা প্রথম ১০–১৫ সেকেন্ডে সিভির মূল অংশগুলো স্ক্যান করেন। নিশ্চিত করুন ডিগ্রি, প্রতিষ্ঠান, সিজিপিএ এবং শীর্ষ টেকনিক্যাল স্কিলগুলো প্রথম পৃষ্ঠার শীর্ষ অংশে সুস্পষ্টভাবে দেখা যাচ্ছে।',
    importance: 'HIGH'
  },
  {
    id: 'chk-dates-3',
    category: 'Factual Accuracy',
    categoryBn: 'তারিখ ও তথ্যের নির্ভুলতা',
    titleEn: 'Are all dates, degree titles, and institution names accurate and consistent?',
    titleBn: 'সব তারিখ, ডিগ্রির পুরো নাম এবং শিক্ষা প্রতিষ্ঠানের বানান কি সঠিক ও সামঞ্জস্যপূর্ণ?',
    descriptionEn: 'Verify reverse chronological order. Align dates consistently (e.g., "Month YYYY – Month YYYY" or "YYYY – YYYY"). Ensure graduation dates match official transcripts exactly.',
    descriptionBn: 'সব তারিখ যেন রিভার্স ক্রোনোলজিক্যাল (সর্বশেষটি শীর্ষে) থাকে। তারিখ ফরম্যাট (যেমন Month YYYY) যেন প্রতিটি সেকশনে অভিন্ন থাকে এবং ট্রান্সক্রিপ্টের সাথে হুবহু মিলে।',
    importance: 'CRITICAL'
  },
  {
    id: 'chk-truth-4',
    category: 'Factual Accuracy',
    categoryBn: 'তথ্যের সততা ও সত্যতা',
    titleEn: 'Are all achievements, metrics, and tools 100% truthful and verifiable?',
    titleBn: 'সকল অর্জন, পরিসংখ্যান এবং টুলস কি শতভাগ সত্য এবং প্রমাণযোগ্য?',
    descriptionEn: 'Never fabricate publications, grades, conference attendance, or project metrics. Interviewers routinely ask deep technical questions about every single claim listed on your CV.',
    descriptionBn: 'সিভিতে উল্লেখিত প্রতিটি পেপার, প্রজেক্ট ও সিজিপিএ সত্য হতে হবে। কোনো তথ্য অতিরঞ্জিত বা কাল্পনিক করবেন না; ইন্টারভিউতে সিভির প্রতিটি পয়েন্ট থেকে প্রশ্ন করা হতে পারে।',
    importance: 'CRITICAL'
  },
  {
    id: 'chk-source-docs-5',
    category: 'Verification & Dossier Alignment',
    categoryBn: 'সার্টিফিকেট ও ট্রান্সক্রিপ্টের সামঞ্জস্য',
    titleEn: 'Are source documents consistent with all claims on the CV?',
    titleBn: 'সার্টিফিকেট, ট্রান্সক্রিপ্ট ও রিকমেন্ডেশন লেটারের সাথে সিভির তথ্য কি হুবহু মিলে?',
    descriptionEn: 'Cross-reference your CV with your official academic transcripts, medium of instruction (MOI) certificates, test score reports (IELTS/GRE), and referee letters.',
    descriptionBn: 'আপনার অফিশিয়াল মার্কশিট, প্রশংসাপত্র, ল্যাঙ্গুয়েজ স্কোর (IELTS/TOEFL) এবং রেফারির পরিচিতির সাথে সিভিতে লেখা প্রতিটি তথ্য ক্রস-চেক করুন।',
    importance: 'HIGH'
  },
  {
    id: 'chk-proofread-6',
    category: 'Typography & Language',
    categoryBn: 'বানান, ব্যাকরণ ও টাইপোগ্রাফি',
    titleEn: 'Is the CV completely free of spelling, grammar, and capitalization errors?',
    titleBn: 'সিভি কি সব ধরনের বানান, ব্যাকরণ ও ক্যাপিটালাইজেশন ভুল থেকে মুক্ত?',
    descriptionEn: 'Check capitalization of technical terms (e.g. "JavaScript" not "Javascript", "PostgreSQL" not "Postgresql", "Python" capitalized). Avoid mixing British and American spelling conventions arbitrarily.',
    descriptionBn: 'টেকনিক্যাল টার্মের সঠিক ক্যাপিটালাইজেশন (যেমন JavaScript, PostgreSQL, React) এবং ব্যাকরণগত নির্ভুলতা নিশ্চিত করুন। ব্রিটিশ বা আমেরিকান স্পেলিংয়ের একটি স্ট্যান্ডার্ড পুরো ডকুমেন্টে বজায় রাখুন।',
    importance: 'CRITICAL'
  },
  {
    id: 'chk-readability-7',
    category: 'Visual Design & Readability',
    categoryBn: 'ডিজাইন ও দৃশ্যমান পাঠযোগ্যতা',
    titleEn: 'Is the format clean and easily readable on screens and when printed in monochrome?',
    titleBn: 'ডিজাইন কি স্ক্রিনে এবং সাদাকালো প্রিন্টেও অত্যন্ত পরিষ্কার ও পাঠযোগ্য?',
    descriptionEn: 'Avoid ultra-light grey text that disappears when printed on budget office printers. Use standard 10–11.5pt body text, adequate line-height, and generous margins (minimum 0.6 inches).',
    descriptionBn: 'খুব হালকা ধূসর ফন্ট পরিহার করুন যা সাদাকালো প্রিন্টারে অস্পষ্ট হয়ে যায়। বডি ফন্ট সাইজ ১০-১১.৫ পয়েন্টের মধ্যে এবং মার্জিন সর্বনিম্ন ০.৬ ইঞ্চি রাখুন।',
    importance: 'HIGH'
  },
  {
    id: 'chk-trim-8',
    category: 'Editorial Pruning',
    categoryBn: 'অপ্রাসঙ্গিক তথ্য বর্জন',
    titleEn: 'Have irrelevant, outdated, or redundant details been pruned?',
    titleBn: 'অপ্রাসঙ্গিক বা পুরোনো হাইস্কুল তথ্য কি বাদ দেওয়া হয়েছে?',
    descriptionEn: 'University students should remove primary/junior school achievements (JSC/PEC). Avoid listing generic software like "Google Chrome" or "WhatsApp" as professional skills.',
    descriptionBn: 'বিশ্ববিদ্যালয় পর্যায়ে পৌঁছানোর পর প্রাথমিক বা জেএসসি স্কুলের বিবরণ বাদ দিন। সাধারণ ইন্টারনেট বা সোশ্যাল মিডিয়া ব্রাউজিংকে পেশাদার টেকনিক্যাল স্কিল হিসেবে লিখবেন না।',
    importance: 'RECOMMENDED'
  },
  {
    id: 'chk-filename-9',
    category: 'Professional Packaging',
    categoryBn: 'পেশাদার ফাইল নামকরণ',
    titleEn: 'Is the exported file named professionally and cleanly?',
    titleBn: 'পিডিএফ ফাইলের নাম কি পেশাদার এবং সহজে সনাক্তযোগ্য?',
    descriptionEn: 'Never submit files named "CV.pdf", "Resume_Final_Updated2.pdf", or "MyDocument.pdf". Use the standard international format: "FirstName_LastName_CV_2026.pdf".',
    descriptionBn: 'কখনোই "CV.pdf" বা "Resume_New_Final.pdf" নামে ফাইল আপলোড করবেন না। আন্তর্জাতিক স্ট্যান্ডার্ড ফরম্যাট ব্যবহার করুন: "FirstName_LastName_CV_2026.pdf"।',
    importance: 'HIGH'
  },
  {
    id: 'chk-pdf-inspect-10',
    category: 'Technical Delivery',
    categoryBn: 'পিডিএফ ফাইল কোয়ালিটি রিভিউ',
    titleEn: 'Has the final exported PDF been inspected on both mobile and desktop?',
    titleBn: 'এক্সপোর্ট করা চূড়ান্ত পিডিএফ কি মোবাইল ও কম্পিউটার উভয় স্ক্রিনে চেক করা হয়েছে?',
    descriptionEn: 'Open the generated PDF in Adobe Acrobat or browser preview. Verify that hyperlinks to your GitHub/LinkedIn work properly, text is selectable (not flattened into an unsearchable image), and no orphan lines appear on a second blank page.',
    descriptionBn: 'পিডিএফ ফাইলটি ওপেন করে প্রতিটি গিটহাব ও লিঙ্কডইন লিঙ্ক কাজ করছে কিনা এবং টেক্সট সিলেক্ট করা যায় কিনা (ইমেজ নয়) তা নিশ্চিত করুন। কোনো বাড়তি ফাঁকা পৃষ্ঠা যেন যোগ না হয়।',
    importance: 'CRITICAL'
  }
];
