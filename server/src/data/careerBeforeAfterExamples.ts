// Borno Higher Study — Career Toolkit: Before-and-After Educational Examples
// Teaches students how to transform vague or passive descriptions into factual, substantiated, and impactful achievements.

export interface BeforeAfterExample {
  id: string;
  category: string;
  categoryBn: string;
  context: string;
  contextBn: string;
  weakText: string;
  weakCritique: string;
  improvedText: string;
  improvedExplanation: string;
  ruleOfThumb: string;
}

export const BEFORE_AFTER_EXAMPLES: BeforeAfterExample[] = [
  {
    id: 'ba-project-1',
    category: 'Academic Project Description',
    categoryBn: 'একাডেমিক প্রজেক্ট ডেসক্রিপশন',
    context: 'Computer Science student describing a university web application project',
    contextBn: 'কম্পিউটার সায়েন্স শিক্ষার্থীর ওয়েব অ্যাপ্লিকেশন প্রজেক্টের বর্ণনা',
    weakText: 'Worked on a website using React and did some backend with Node.',
    weakCritique: 'Lacks technical specificity, architecture details, candidate contribution, purpose, or outcome. Sounds passive and generic.',
    improvedText: 'Developed a responsive university directory using React, TypeScript, and Tailwind CSS; built RESTful microservices in Node.js indexing 1,000+ degree programs with sub-100ms search latency.',
    improvedExplanation: 'Specifies exact frontend/backend stack, architecture style (RESTful microservices), quantitative scale (1,000+ programs), and measurable performance (sub-100ms latency). Only use this if you genuinely achieved these parameters.',
    ruleOfThumb: 'Always include: Action Verb + Exact Tech Stack + System Scope/Scale + Verifiable Outcome.'
  },
  {
    id: 'ba-research-1',
    category: 'Research Experience',
    categoryBn: 'গবেষণার অভিজ্ঞতা',
    context: 'Biomedical science student describing undergraduate lab work',
    contextBn: 'বায়োমেডিকেল সাইন্স শিক্ষার্থীর ল্যাবরেটরি গবেষণার বর্ণনা',
    weakText: 'Helped professor in the lab doing PCR and looking at cells.',
    weakCritique: 'Vague role ("helped"), unspecific protocol names, no hypothesis context, and zero indication of findings or data volume.',
    improvedText: 'Conducted quantitative PCR (qPCR) assays across 72 bacterial isolate samples under faculty supervision, analyzing antibiotic resistance gene expression profiles using GraphPad Prism.',
    improvedExplanation: 'Replaces passive "helped" with "conducted", explicitly names assay type (qPCR), specifies sample size (72 isolates), and cites analysis software (GraphPad Prism).',
    ruleOfThumb: 'Detail the scientific technique, the sample size or experimental condition, and the software used for data analysis.'
  },
  {
    id: 'ba-profile-1',
    category: 'Academic Profile Summary',
    categoryBn: 'একাডেমিক প্রোফাইল সামারি',
    context: 'Graduating engineering senior applying for European MSc admission',
    contextBn: 'ইউরোপীয় মাস্টার্স ভর্তির জন্য ইঞ্জিনিয়ারিং শিক্ষার্থীর হেডার সামারি',
    weakText: 'Hardworking and passionate engineering student looking for good opportunities to study abroad and learn new things.',
    weakCritique: 'Contains empty subjective adjectives ("hardworking", "passionate"), self-centered tone ("looking for good opportunities"), and no academic identity or technical domain.',
    improvedText: 'Final-year Mechanical Engineering undergraduate (CGPA 3.82/4.00) with specialization in computational fluid dynamics (Ansys Fluent) and thermal modeling. Seeking postgraduate research training in sustainable aerodynamic turbine design.',
    improvedExplanation: 'Clearly declares degree status, verified GPA, technical sub-discipline, key simulation tools, and intended scholarly direction.',
    ruleOfThumb: 'Replace self-praising personality adjectives with verifiable academic credentials and research specializations.'
  },
  {
    id: 'ba-internship-1',
    category: 'Internship Responsibilities',
    categoryBn: 'ইন্টার্নশিপ দায়িত্ব ও অর্জন',
    context: 'Business student completing a commercial marketing internship',
    contextBn: 'মার্কেটিং ইন্টার্নশিপ সম্পন্ন করা বিজনেস শিক্ষার্থীর অভিজ্ঞতা',
    weakText: 'Responsible for social media marketing, posting on Facebook, and making reports.',
    weakCritique: 'Uses passive duty-based phrasing ("responsible for"), fails to show creativity, scale, or business impact.',
    improvedText: 'Managed editorial calendar and content distribution across Facebook and LinkedIn for 3 flagship consumer brands, increasing organic monthly engagement by 28% and compiling weekly KPI dashboards for senior brand managers.',
    improvedExplanation: 'Focuses on ownership ("managed editorial calendar"), names specific platforms and brand categories, and gives measurable percentage growth (28%).',
    ruleOfThumb: 'Convert passive "responsible for X" into active verbs ("Spearheaded", "Directed", "Executed") paired with measurable business impact.'
  },
  {
    id: 'ba-leadership-1',
    category: 'Leadership & Student Club Roles',
    categoryBn: 'নেতৃত্ব ও ক্লাব অ্যাক্টিভিটি',
    context: 'Student describing leadership in a university debate or cultural club',
    contextBn: 'বিশ্ববিদ্যালয় ডিবেটিং বা কালচারাল ক্লাবের নেতৃত্ব বর্ণনা',
    weakText: 'Organized debate events as club president and had meetings with members.',
    weakCritique: 'Trivializes the effort required to coordinate major events; misses attendance numbers, budget management, and institutional sponsorship.',
    improvedText: 'Elected President of 140-member university debating society; directed the 12th National Inter-College Championship hosting 32 institutional teams, securing BDT 350,000 in corporate sponsorship and managing a 20-member organizing committee.',
    improvedExplanation: 'States elected mandate, club membership size, tournament team count, sponsorship revenue secured, and team scale managed.',
    ruleOfThumb: 'Leadership is demonstrated through people managed, budgets administered, and events successfully executed.'
  },
  {
    id: 'ba-skills-1',
    category: 'Technical & Professional Skills Matrix',
    categoryBn: 'টেকনিক্যাল ও প্রফেশনাল স্কিলস উপস্থাপন',
    context: 'Presenting software and analytical tools',
    contextBn: 'সফটওয়্যার ও অ্যানালিটিক্যাল টুলস উপস্থাপন',
    weakText: 'Skills: Good communication, Teamwork, MS Office, Programming, Hard worker, Punctual.',
    weakCritique: 'Merges non-provable buzzwords ("teamwork", "punctual") with generic catch-alls ("programming", "MS Office") without taxonomy or context.',
    improvedText: 'Languages: Python, SQL (PostgreSQL), C++ | Frameworks: PyTorch, Scikit-learn, FastAPI | Developer Tools: Git, Docker, Linux, Postman | Data & Reporting: Power BI, Advanced Excel (Power Query, VBA).',
    improvedExplanation: 'Separates proficiencies into logical categories (Languages, Frameworks, Tools, Data), removes subjective clichés, and names industry-standard systems.',
    ruleOfThumb: 'Group technical tools into scannable domains. Show soft skills through concrete work bullets rather than bulleted skill lists.'
  },
  {
    id: 'ba-scholarship-1',
    category: 'Scholarship-Focused Introduction',
    categoryBn: 'স্কলারশিপ ওরিয়েন্টেড প্রোফাইল ভূমিকা',
    context: 'Applying for Erasmus Mundus or Commonwealth Scholarship',
    contextBn: 'ইরাসমাস মুন্ডুস বা কমনওয়েলথ স্কলারশিপের সিভি সামারি',
    weakText: 'I want to win this scholarship because it is my dream to study in Europe and get an international degree to help my future career.',
    weakCritique: 'Personal desire without intellectual alignment or public benefit; does not connect with the grantor’s international development mandate.',
    improvedText: 'Environmental Science researcher with First Class Honours and 2 years of grassroots youth leadership in coastal salinity mitigation. Seeking Erasmus Mundus funding in Climate Change Adaptation to develop community-based saline agriculture models in southwestern Bangladesh.',
    improvedExplanation: 'Articulates academic standing, field leadership, alignment with the specific consortium program, and the socio-economic mission for Bangladesh upon return.',
    ruleOfThumb: 'Scholarship boards fund global ambassadors and problem-solvers, not merely deserving students.'
  }
];
