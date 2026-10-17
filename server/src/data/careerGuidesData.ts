// Borno Higher Study — Career Toolkit: In-Depth Editorial Career & CV Guides
// Fully bilingual (English & Bengali) guides authored with rigorous academic standards.

export interface CareerGuideData {
  slug: string;
  category: string;
  titleEn: string;
  titleBn: string;
  summaryEn: string;
  summaryBn: string;
  author: string;
  lastReviewed: string;
  contentEn: string;
  contentBn: string;
}

export const CAREER_GUIDES_DATA: CareerGuideData[] = [
  {
    slug: 'europass-cv',
    category: 'EUROPASS',
    titleEn: 'The Complete Europass CV Guide: Architecture, Profile Creation & Official Best Practices',
    titleBn: 'ইউরোপাস সিভি পূর্ণাঙ্গ গাইড: প্রোফাইল তৈরি, সেকশন বিন্যাস ও ইউরোপীয় মানদণ্ড',
    summaryEn: 'An authoritative guide explaining what Europass is, when to use it across European universities and Erasmus Mundus programs, how to formulate CEFR languages and DigComp skills, common mistakes to avoid, and when alternative CV formats are preferred.',
    summaryBn: 'ইউরোপাস সিভি কী, ইউরোপের বিশ্ববিদ্যালয় ও ইরাসমাস মুন্ডুস স্কলারশিপে এর গুরুত্ব, সিইএফআর ভাষা দক্ষতা ও ডিজিটাল ফ্রেমওয়ার্ক ব্যবহারের সঠিক নিয়ম এবং কখন অন্য ফরম্যাট ব্যবহার করা উচিত তার বিস্তারিত গাইড।',
    author: 'Borno European Admissions Advisory Panel',
    lastReviewed: 'October 2026',
    contentEn: `### Understanding the Europass Framework

The **Europass Curriculum Vitae** is the European Union’s standardized framework designed to make skills and qualifications clearly and easily understood across all 27 EU member states, EEA countries, and EU candidate nations.

Operated officially by the European Commission, Europass provides an integrated ecosystem consisting of:
- **Europass e-Portfolio**: A secure digital space to record education, work experiences, language proficiencies, and digital competencies.
- **European Qualifications Framework (EQF)**: Standardized mapping of degree levels (Bachelor = EQF 6, Master = EQF 7, Doctorate = EQF 8).
- **Common European Framework of Reference for Languages (CEFR)**: Self-assessment grid spanning levels A1 (Basic) to C2 (Mastery) across Listening, Reading, Spoken Interaction, Spoken Production, and Writing.
- **Digital Competence Framework for Citizens (DigComp)**: Formal taxonomy for technical, data, cybersecurity, and coding skills.

---

### When Should You Use Europass?

Europass is **ideal and often explicitly required** for:
1. **Erasmus Mundus Joint Master Degrees (EMJMD)**: Many consortium programs specifically recommend or require Europass format to standardize review across multi-country university boards.
2. **DAAD German Academic Exchange Service**: Many development and EPOS postgraduate scholarship calls mandate a chronological Europass CV.
3. **Public Sector & University Traineeships in Continental Europe**: Government institutions in Germany, Italy, Spain, France, and Belgium are deeply accustomed to the Europass hierarchy.
4. **European Research Internships**: Cross-border research labs where standardized language grids expedite administrative mobility clearance.

### When Should You Avoid Europass?

Europass is **not universal** and should generally be avoided in these scenarios:
1. **United States & Canadian Industry / Tech Roles**: American recruiters strongly prefer a single-page, high-density, custom-tailored resume. Europass takes up too much vertical space and is viewed as rigid.
2. **United Kingdom Private Sector**: UK employers generally expect a 2-page tailored British CV without standard EU branding banners.
3. **High-Output Postdoctoral Research**: If you have 20+ peer-reviewed journal papers and book chapters, standard academic CV layouts give you far greater typographic flexibility than the Europass online editor.

---

### Step-by-Step: Creating a Flawless Europass Profile

#### 1. Personal Information & Official Contact
- **Full Legal Name**: Must match your passport exactly (critical for Bangladeshi applicants applying for Schengen visas).
- **Nationality & Date of Birth**: Standard and required in European systems to ascertain visa categories and Erasmus partner country quota eligibility.
- **Address & Contact**: Provide telephone with international country code (\`+880\`) and a professional email address.

#### 2. Chronological Work Experience
- List roles in **reverse chronological order**.
- State the formal company name, city, country, and precise date range (Month/Year).
- Summarize duties using active verbs and bullet points. Focus on outcomes rather than passive task listings.

#### 3. Education and Training
- Specify the **EQF level**:
  - Higher Secondary Certificate (HSC) = EQF Level 4
  - Bachelor’s Degree (4-Year Honours) = EQF Level 6
  - Master’s Degree = EQF Level 7
- State your **Cumulative Grade Point Average (CGPA)** along with the institutional grading scale (e.g. *3.84 / 4.00*). Provide the European credit conversion (ECTS) if your university has published an official conversion policy.

#### 4. Language Skills (CEFR Grid)
- **Mother Tongue**: Bengali.
- **Other Languages**: English, German, French, etc.
- Accurately assess your proficiency using the official CEFR scale:
  - **A1–A2**: Basic User
  - **B1–B2**: Independent User (B2 is typical minimum university admission threshold)
  - **C1–C2**: Proficient User (C1 is typical graduate teaching assistantship threshold)
- Reference your official test scores (IELTS 7.5 = C1, TOEFL 100 = C1).

#### 5. Digital Competencies
- Rather than typing "Good with computers", categorize skills according to DigComp areas:
  - *Information and Data Literacy*: SQL, Python Pandas, SPSS.
  - *Communication and Collaboration*: Git, Slack, Zoom, MS Teams.
  - *Digital Content Creation*: LaTeX, HTML/CSS, React, Adobe Suite.
  - *Problem Solving & Programming*: C++, Go, Algorithm Design.

---

### Official Resources & Builder Links

To construct your verified Europass CV using the European Commission’s official engine, visit:
- **Official European Union Europass Portal**: [https://europass.europa.eu/en/create-europass-cv](https://europass.europa.eu/en/create-europass-cv)
- **EURES European Job Mobility Network**: [https://eures.europa.eu/jobseekers/europass_en](https://eures.europa.eu/jobseekers/europass_en)`,
    contentBn: `### ইউরোপাস ফ্রেমওয়ার্ক পরিচিতি

**ইউরোপাস কারিকুলাম ভিটি (Europass CV)** হলো ইউরোপীয় ইউনিয়নের অফিশিয়াল স্ট্যান্ডার্ড ফরম্যাট, যা ইউরোপের ২৭টি সদস্য রাষ্ট্র এবং ইইউ সহযোগী দেশসমূহে শিক্ষার্থীদের যোগ্যতা ও দক্ষতা সমানভাবে মূল্যায়নের জন্য তৈরি করা হয়েছে।

ইউরোপীয় কমিশন পরিচালিত এই সিস্টেমে রয়েছে:
- **ইউরোপাস ই-পোর্টফোলিও**: নিরাপদ ডিজিটাল প্ল্যাটফর্মে শিক্ষা ও কাজের বিবরণ সংরক্ষণ।
- **ইউরোপিয়ান কোয়ালিফিকেশনস ফ্রেমওয়ার্ক (EQF)**: ডিগ্রির মানদণ্ড নির্ধারণ (ব্যাচেলর = EQF 6, মাস্টার্স = EQF 7, পিএইচডি = EQF 8)।
- **সিইএফআর ভাষা দক্ষতা গ্রিড (CEFR)**: A1 থেকে C2 পর্যন্ত আন্তর্জাতিক ভাষার মানদণ্ড।
- **ডিজিটাল কম্পিটেন্স ফ্রেমওয়ার্ক (DigComp)**: আইটি ও প্রোগ্রামিং দক্ষতার স্বীকৃত শ্রেণীকরণ।

---

### কখন ইউরোপাস সিভি ব্যবহার করবেন?

১. **ইরাসমাস মুন্ডুস জয়েন্ট মাস্টার্স (EMJMD)**: অধিকাংশ কনসোর্টিয়াম আবেদনকারীদের জন্য ইউরোপাস ফরম্যাট নির্দিষ্ট করে দেয়।
২. **জার্মান ডাড (DAAD) স্কলারশিপ**: উন্নয়নমূলক পোস্টগ্র্যাজুয়েট প্রোগ্রামে ইউরোপাস ক্রোনোলজিক্যাল সিভি বাধ্যতামূলক।
৩. **ইউরোপীয় মহাদেশীয় বিশ্ববিদ্যালয়**: জার্মানি, ইতালি, স্পেন, ফ্রান্স ও বেলজিয়ামের অধিকাংশ সরকারি প্রতিষ্ঠানে এটি অত্যন্ত সমাদৃত।

### কখন ইউরোপাস সিভি ব্যবহার করবেন না?

১. **যুক্তরাষ্ট্র ও কানাডা**: উত্তর আমেরিকার টেক ও করপোরেট কোম্পানিগুলো ১ পৃষ্ঠার কাস্টম আমেরিকান রেজ্যিউমে পছন্দ করে। ইউরোপাসের দীর্ঘ লেআউট সেখানে অগ্রহণযোগ্য হতে পারে।
২. **যুক্তরাজ্যের বেসরকারি চাকরি**: ব্রিটিশ কোম্পানিগুলো সাধারণত ২ পৃষ্ঠার স্ট্যান্ডার্ড ব্রিটিশ ফরম্যাট চায়।

---

### অফিসিয়াল ইউরোপাস পোর্টালে সিভি তৈরির নিয়ম

ইউরোপীয় ইউনিয়নের অফিসিয়াল পোর্টালে সরাসরি সিভি তৈরি করতে ভিজিট করুন:
- **অফিশিয়াল ইউরোপাস বিল্ডার**: [https://europass.europa.eu/en/create-europass-cv](https://europass.europa.eu/en/create-europass-cv)`
  },
  {
    slug: 'cv-writing-guide',
    category: 'CV_WRITING_GUIDE',
    titleEn: 'Comprehensive International CV Writing Guide: Principles, Section Hierarchy & Global Standards',
    titleBn: 'আন্তর্জাতিক সিভি তৈরির পূর্ণাঙ্গ গাইড: মূলনীতি, সেকশন কাঠামো ও বিশ্বমানের স্ট্যান্ডার্ড',
    summaryEn: 'A masterclass on building a world-class academic and professional CV for global study and fellowship opportunities, covering font typography, margin hierarchy, action verbs, and factual substantiation.',
    summaryBn: 'বিদেশে উচ্চশিক্ষা, স্কলারশিপ ও রিসার্চ ফেলোশিপের জন্য একটি বিশ্বমানের সিভি লেখার পদ্ধতি, সেকশন বিন্যাস, অ্যাকশন ভার্ব ব্যবহারের কৌশল ও তথ্য উপস্থাপনের নিয়মাবলী।',
    author: 'Borno Senior Editorial Directorate',
    lastReviewed: 'October 2026',
    contentEn: `### 1. The Core Philosophy of an Editorial-Grade CV

A Curriculum Vitae (CV)—literally the "course of one’s life"—is not a casual list of past activities. In international higher education, it serves as an **empirical, scholarly dossier** demonstrating intellectual trajectory, academic discipline, and professional readiness.

#### The Golden Rules of Academic CV Writing
1. **Factuality Over Flattery**: Never use subjective adjectives ("highly motivated", "visionary", "passionate"). Let your published papers, GPA, code repositories, and quantifiable projects speak for your motivation.
2. **Reverse Chronological Discipline**: Always display your most recent degree or appointment first. Evaluators must see your current intellectual capacity immediately.
3. **No Unsubstantiated Acronyms**: Spell out institutional abbreviations on first use (e.g. *Bangladesh University of Engineering and Technology (BUET)*; *International Centre for Diarrhoeal Disease Research, Bangladesh (icddr,b)*).
4. **Consistent Typography**: Use maximum two font families (e.g., Inter for sans-serif or Garamond/Merriweather for editorial serif). Set body text between 10pt and 11.5pt with at least 0.65-inch margins.

---

### 2. Standard Academic CV Section Hierarchy

An internationally competitive CV is arranged in this logical order:

| Order | Section Name | Key Contents |
| :--- | :--- | :--- |
| **1** | **Contact Information** | Full legal name, institutional email, phone with country code, city/country, LinkedIn, GitHub/ORCID. |
| **2** | **Research Interests / Summary** | 3–4 core scientific/academic domains. Optional for undergraduate resumes; vital for graduate CVs. |
| **3** | **Education** | Degrees in reverse chronological order, institution, graduation date, GPA, thesis title, and faculty advisor. |
| **4** | **Peer-Reviewed Publications** | Refereed journal papers and book chapters in standard APA/IEEE citation style with candidate's name bolded. |
| **5** | **Research Experience** | Appointments as Graduate Research Assistant, lab protocols, statistical tools, sample sizes. |
| **6** | **Teaching Experience** | Undergraduate tutoring, guest lecturing, lab demonstration, pedagogical workshops. |
| **7** | **Honors, Awards & Grants** | University merit scholarships, Dean's list, national Olympiad medals, competitive research travel grants. |
| **8** | **Academic Presentations** | Oral conference presentations and competitive poster sessions. |
| **9** | **Technical & Lab Skills** | Wet-lab instrumentation, programming languages, simulation software, statistical packages. |
| **10** | **Languages** | Native language and second languages with verified test scores (IELTS/TOEFL) or CEFR levels. |
| **11** | **Referees** | 2–3 faculty professors with full titles, department addresses, and institutional email addresses. |`,
    contentBn: `### ১. আন্তর্জাতিক মানের সিভির মূল দর্শন

একটি কারিকুলাম ভিটি (সিভি) হলো আপনার শিক্ষাজীবন ও গবেষণার একটি আনুষ্ঠানিক দালিলিক রূপ। আন্তর্জাতিক উচ্চশিক্ষায় এটি কোনো সাধারণ তথ্যের তালিকা নয়, বরং আপনার বুদ্ধিবৃত্তিক যোগ্যতা ও দক্ষতার সুনির্দিষ্ট প্রমাণপত্র।

#### সিভি লেখার ৪টি সুবর্ণ নিয়ম
১. **ফাঁকা প্রশংসা বাদ দিন**: "Hardworking", "passionate" বা "motivated" এর মতো শব্দ সিভিতে ব্যবহার করবেন না। আপনার পাবলিকেশন, সিজিপিএ এবং প্রজেক্টের ফলাফলই আপনার যোগ্যতার প্রমাণ দেবে।
২. **রিভার্স ক্রোনোলজিক্যাল ক্রম**: সর্বদা সর্বশেষ ডিগ্রি বা অভিজ্ঞতা সবার উপরে রাখুন।
৩. **অপরিচিত সংক্ষিপ্ত রূপ পরিহার করুন**: প্রতিষ্ঠানের পুরো নাম প্রথমে উল্লেখ করুন (যেমন: Bangladesh University of Engineering and Technology - BUET)।
৪. **টাইপোগ্রাফির শৃঙ্খলা**: পুরো সিভিতে সর্বোচ্চ একটি বা দুটি পরিচ্ছন্ন ফন্ট ব্যবহার করুন। বডি ফন্ট সাইজ ১০ থেকে ১১.৫ পয়েন্টের মধ্যে রাখুন।`
  },
  {
    slug: 'academic-cv',
    category: 'ACADEMIC',
    titleEn: 'The Academic CV: Structure, Publications, Research Appointments & Dossier Guidelines',
    titleBn: 'অ্যাকাডেমিক সিভি: গবেষণা অভিজ্ঞতা, পেপারস ও পিএইচডি অ্যাপ্লিকেশনের নিয়মাবলী',
    summaryEn: 'Comprehensive guidance on structuring an academic CV for graduate school admissions, research assistantships, and postdoctoral fellowships across North American and European universities.',
    summaryBn: 'আন্তর্জাতিক পোস্টগ্র্যাজুয়েট ও পিএইচডি ভর্তির জন্য অ্যাকাডেমিক সিভি প্রস্তুতের পূর্ণাঙ্গ নিয়মাবলী, গবেষণা অভিজ্ঞতা ও প্রকাশনা বিন্যাসের পদ্ধতি।',
    author: 'Borno Academic Research Council',
    lastReviewed: 'October 2026',
    contentEn: `### Purpose of an Academic CV

Unlike industry resumes that are strictly constrained to 1 or 2 pages, an **Academic CV has no arbitrary page limit**. It is an exhaustive record of your scholarly trajectory. For an undergraduate applying to an MSc, it is typically 2 pages; for a PhD applicant, 3–4 pages; and for senior faculty, it can span 15+ pages.

### Crucial Sections for Academic Candidates

#### 1. Education
- List institution, location, degree title, completion date, and CGPA.
- Always include your **Thesis or Capstone Title** and the name of your **Faculty Supervisor/Adviser**.

#### 2. Publications (The Currency of Academia)
Format every citation in standard APA or IEEE style. Always **bold your own name** so reviewers can immediately identify your authorship order:
- *Example*: **Rahman, T.**, Hossain, M. A., & Karim, S. (2025). Novel Deep Graph Architectures for Drug Target Interaction Prediction. *Bioinformatics*, 41(3), 120–131.
- Clearly separate *Peer-Reviewed Journal Articles*, *Conference Proceedings*, and *Manuscripts in Review*. Never claim a paper is published if it is only in draft form.

#### 3. Research Experience
For every research appointment (e.g. Undergraduate Research Assistant):
- State the Laboratory or Department name and Principal Investigator (PI).
- Describe the experimental methodology, computational pipeline, and key findings.`,
    contentBn: `### অ্যাকাডেমিক সিভির উদ্দেশ্য ও পরিধি

কর্পোরেট রিজিউমির মতো অ্যাকাডেমিক সিভির কোনো কৃত্রিম পেজ লিমিট নেই। একজন মাস্টার্স প্রার্থীর ক্ষেত্রে এটি ২ পেজ এবং পিএইচডি প্রার্থীর ক্ষেত্রে ৩-৪ পেজ হতে পারে। 

এতে আপনার শিক্ষাগত ডিগ্রি, থিসিস সুপারভাইজারের নাম, ল্যাবরেটরি রিসার্চের পদ্ধতি, পিয়ার-রিভিউড পাবলিকেশন এবং টিচিং অ্যাসিস্ট্যান্টশিপের তথ্য অত্যন্ত সুস্পষ্টভাবে উপস্থাপন করতে হয়।`
  },
  {
    slug: 'research-cv',
    category: 'RESEARCH',
    titleEn: 'The Scientific & Research CV: Laboratory Instrumentation, Computational Pipelines & Methodologies',
    titleBn: 'সায়েন্টিফিক ও রিসার্চ সিভি: ল্যাব ইনস্ট্রুমেন্টেশন, কম্পিউটেশনাল টুলস ও মেথডোলজি',
    summaryEn: 'How STEM and biomedical applicants should articulate laboratory protocols, experimental equipment, computational pipelines, and scientific data reproducibility.',
    summaryBn: 'বিজ্ঞান, প্রকৌশল ও বায়োমেডিকেল শিক্ষার্থীদের ল্যাব টেকনিক, বৈজ্ঞানিক যন্ত্রপাতি এবং গবেষণা মেথডোলজি সিভিতে যথাযথভাবে উপস্থাপনের পদ্ধতি।',
    author: 'Borno STEM & Biomedical Review Board',
    lastReviewed: 'October 2026',
    contentEn: `### Articulating Scientific Competency

In experimental and computational research, prospective professors evaluate your CV to answer one critical question: *Can this student step into my laboratory on day one and safely, competently execute research?*

To answer yes, your CV must detail:
- **Experimental Instrumentation**: Explicitly name instruments you have personally calibrated and operated (e.g., HPLC, FESEM, XRD, PCR thermocyclers, rotary evaporators).
- **Computational Pipelines & Reproducibility**: Slurm job scheduling, Nextflow/Snakemake workflows, Docker containers, Python/R statistical analysis.
- **Safety Accreditations**: Biosafety Level 2 (BSL-2) training, Good Laboratory Practice (GLP), Radiation Safety, or Animal Ethics certifications.`,
    contentBn: `### ল্যাবরেটরি দক্ষতা তুলে ধরার কৌশল

বিজ্ঞান ও চিকিৎসা গবেষণায় অধ্যাপক বা ল্যাব ডিরেক্টররা দেখতে চান আপনি ল্যাবে কাজ করতে কতটা দক্ষ। সিভিতে আপনার সরাসরি পরিচালিত ইনস্ট্রুমেন্টেশন (যেমন: HPLC, XRD, PCR), কম্পিউটেশনাল সফটওয়্যার এবং ল্যাব সেফটি সার্টিফিকেশনের তথ্য স্পষ্টভাবে উল্লেখ করুন।`
  },
  {
    slug: 'scholarship-cv',
    category: 'SCHOLARSHIP',
    titleEn: 'The Prestigious Scholarship CV: Erasmus Mundus, Commonwealth, DAAD & Fulbright Standards',
    titleBn: 'স্কলারশিপ সিভি গাইড: ইরাসমাস মুন্ডুস, কমনওয়েলথ, ডাড ও ফুলব্রাইট স্ট্যান্ডার্ড',
    summaryEn: 'Tactical guidance on balancing academic rigor with civic leadership, community impact, cultural ambassadorship, and sustainable development goals.',
    summaryBn: 'আন্তর্জাতিক মর্যাদাপূর্ণ স্কলারশিপের সিভিতে মেধা, সামাজিক নেতৃত্ব ও টেকসই উন্নয়ন লক্ষ্যের সামঞ্জস্য রেখে সিভি তৈরির পূর্ণাঙ্গ গাইডলাইন।',
    author: 'Borno International Scholarship Directorate',
    lastReviewed: 'October 2026',
    contentEn: `### What Scholarship Committees Evaluate

International scholarship committees (such as the UK Foreign Office for Chevening, the European Commission for Erasmus Mundus, and the US Department of State for Fulbright) are not hiring employees. They are investing public funds into future leaders who will return to their home countries and drive socioeconomic progress.

Your scholarship CV must therefore demonstrate:
1. **Academic Excellence**: High CGPA, departmental class rank, dean's honors list, and academic prizes.
2. **Community Leadership & Social Impact**: Proven initiative outside the classroom (e.g. founding educational clubs, crisis relief efforts, youth advocacy).
3. **Alignment with Sustainable Development Goals (SDGs)**: Clearly connect your academic field to pressing challenges in Bangladesh (e.g. clean water, renewable energy, public health, climate resilience).
4. **Intercultural Competency**: Ability to thrive in multicultural environments, demonstrated through language proficiencies, international youth delegations, or cross-border volunteer initiatives.`,
    contentBn: `### স্কলারশিপ কমিটি কী বিবেচনা করে?

আন্তর্জাতিক স্কলারশিপ প্রদানকারী সংস্থাগুলো কেবল ভালো রেজাল্ট দেখে না। তারা এমন তরুণ নেতৃত্ব খোঁজে যারা নিজ দেশে ফিরে আর্থসামাজিক উন্নয়নে ভূমিকা রাখবে। তাই সিভিতে একাডেমিক সাফল্যের পাশাপাশি সামাজিক দায়বদ্ধতা, ভলান্টিয়ারিং এবং জাতিসংঘের টেকসই উন্নয়ন লক্ষ্যমাত্রার (SDGs) সাথে কাজের যোগসূত্র ফুটিয়ে তুলুন।`
  },
  {
    slug: 'student-resume',
    category: 'STUDENT',
    titleEn: 'The Student & Entry-Level Resume: Translating Coursework, Projects & Part-Time Roles into Impact',
    titleBn: 'স্টুডেন্ট রেজ্যিউমে গাইড: সেমিস্টার প্রজেক্ট ও পার্ট-টাইম কাজকে প্রফেশনাল অর্জনে রূপান্তরের কৌশল',
    summaryEn: 'A practical guide for undergraduates and recent graduates with limited formal work experience on constructing high-impact 1-page professional resumes.',
    summaryBn: 'সীমিত চাকরির অভিজ্ঞতা থাকা সত্ত্বেও কীভাবে সেমিস্টার প্রজেক্ট, টার্ম পেপার এবং ক্যাম্পাস লিডারশিপ দিয়ে ১ পৃষ্ঠার প্রফেশনাল রিজিউমি তৈরি করতে হয়।',
    author: 'Borno Career Advisory Board',
    lastReviewed: 'October 2026',
    contentEn: `### The Challenge of Limited Formal Experience

Undergraduate students often worry: *"I have never held a corporate job. What do I put on my resume?"*

The solution is to recognize that university education itself involves substantial professional work if framed correctly:
- **Academic Capstones & Term Papers**: An extensive term paper analyzing economic policies or a full-stack database software project is genuine engineering and research work.
- **Campus Club Responsibilities**: Managing logistics for a 500-person event or securing corporate sponsorship proves event planning, budgeting, and negotiation.
- **Part-Time Work & Tutoring**: Tutoring high school students demonstrates communication, pedagogy, patience, and time management.

#### Formatting Rules for Student Resumes
- **Strictly 1 Page**: Do not let an entry-level resume spill over to a second page with 3 lines.
- **Education at the Top**: While you are a student or recent graduate, your degree and university name belong immediately below your contact header.`,
    contentBn: `### সীমিত অভিজ্ঞতায় সেরা রেজ্যিউমে তৈরির উপায়

অভিজ্ঞতা না থাকা সত্ত্বেও বিশ্ববিদ্যালয়ের অ্যাকাডেমিক প্রজেক্ট, সেমিস্টার পেপার এবং ক্লাব অ্যাক্টিভিটিকে প্রফেশনাল অর্জনের মতো করে উপস্থাপন করা যায়। আন্ডারগ্র্যাজুয়েট ও ফ্রেশারদের জন্য রেজ্যিউমে সর্বদা ১ পৃষ্ঠার মধ্যে সীমাবদ্ধ রাখা আন্তর্জাতিকভাবে বাঞ্ছনীয়।`
  },
  {
    slug: 'cover-letter',
    category: 'COVER_LETTER',
    titleEn: 'The Academic & Fellowship Cover Letter: Persuasive Structure, Research Pitch & Common Pitfalls',
    titleBn: 'অ্যাকাডেমিক ও ফেলোশিপ কভার লেটার: কাঠামো, গবেষণার যুক্তি উপস্থাপন ও ভুল এড়ানোর উপায়',
    summaryEn: 'How to write a targeted, compelling 1-page cover letter for international graduate applications, research lab assistantships, and industrial placements.',
    summaryBn: 'বিদেশে মাস্টার্স, পিএইচডি ও ল্যাব পজিশনে আবেদনের জন্য তথ্যবহুল ও আকর্ষণীয় ১ পৃষ্ঠার কভার লেটার লেখার নিয়মাবলী।',
    author: 'Borno Editorial Board',
    lastReviewed: 'October 2026',
    contentEn: `### The Function of a Cover Letter

A cover letter is not a narrative rehash of your CV. It is an argument connecting your past achievements directly to the prospective university department, professor, or scholarship mission.

#### Standard 4-Paragraph Cover Letter Architecture:
1. **Paragraph 1: The Specific Application**: State the exact program/position, institutional name, and your overarching scholarly motivation.
2. **Paragraph 2: Academic & Technical Substantiation**: Highlight your strongest thesis finding or project contribution directly relevant to their syllabus.
3. **Paragraph 3: Institutional Alignment**: Explain *why this specific university*. Mention faculty research papers, lab equipment, or unique curricular specializations.
4. **Paragraph 4: Conclusion & Professional Sign-Off**: Reiterate enthusiasm, state availability for an interview, and express professional appreciation.`,
    contentBn: `### কভার লেটারের ভূমিকা ও গুরুত্ব

কভার লেটার কেবল সিভির পুনরাবৃত্তি নয়; এটি হলো আপনার যোগ্যতার সাথে নির্দিষ্ট বিশ্ববিদ্যালয় বা গবেষণা পদের প্রাসঙ্গিকতা প্রমাণের একটি যুক্তিপূর্ণ চিঠি। এটি সাধারণত ১ পৃষ্ঠার মধ্যে ৪টি সুস্পষ্ট অনুচ্ছেদে সমাপ্ত করতে হয়।`
  },
  {
    slug: 'personal-statement',
    category: 'PERSONAL_STATEMENT',
    titleEn: 'The Statement of Purpose (SOP) & Personal Statement: Narrative Crafting & Scholarly Rigor',
    titleBn: 'স্টেটমেন্ট অব পারপাস (SOP) ও পার্সোনাল স্টেটমেন্ট: তথ্যভিত্তিক ব্যক্তিগত রচনা ও লেখার কৌশল',
    summaryEn: 'Comprehensive guide to crafting an authentic, academically grounded Statement of Purpose (SOP) for international master’s and doctoral admissions.',
    summaryBn: 'আন্তর্জাতিক উচ্চশিক্ষায় মাস্টার্স ও পিএইচডি ভর্তির জন্য বিশ্বাসযোগ্য ও অনুপ্রেরণাদায়ী স্টেটমেন্ট অব পারপাস (SOP) রচনার সম্পূর্ণ গাইড।',
    author: 'Borno Editorial Directorate',
    lastReviewed: 'October 2026',
    contentEn: `### Demystifying the Statement of Purpose (SOP)

A Statement of Purpose is an intellectual autobiography. Admissions committees read hundreds of essays; they immediately discount clichéd openings such as *"Ever since I was a child, I have always loved science"*.

#### Winning SOP Guidelines
- **Start with an Intellectual Spark**: Begin with a concrete academic question, a challenging undergraduate engineering problem, or a real-world research gap that captivated your curiosity.
- **Show, Don’t Tell**: Instead of saying *"I am deeply passionate about economics"*, explain how analyzing rural microcredit repayment data in Hathazari revealed structural market inefficiencies that you wish to study further.
- **Specific Department Fit**: Dedicate at least 25% of the essay to explaining why their faculty, curriculum, and research facilities (naming specific labs and professors) are the exact right environment for your goals.`,
    contentBn: `### স্টেটমেন্ট অব পারপাস (SOP) লেখার কৌশল

এসওপি হলো আপনার উচ্চশিক্ষা ও গবেষণার লক্ষ্যের যৌক্তিক ব্যাখ্যা। "ছোটবেলা থেকেই আমার বিজ্ঞানের প্রতি ভালোবাসা ছিল"—এ জাতীয় মামুলি কথা বাদ দিয়ে বাস্তব কোনো গবেষণা অভিজ্ঞতা বা অ্যাকাডেমিক কৌতূহল দিয়ে রচনা শুরু করুন। সংশ্লিষ্ট বিশ্ববিদ্যালয়ের অধ্যাপক ও ল্যাবরেটরির কাজের সাথে আপনার আগ্রহের মিল তুলে ধরুন।`
  }
];

export const TOTAL_CAREER_GUIDES = CAREER_GUIDES_DATA.length;
