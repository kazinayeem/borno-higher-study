// Borno Higher Study — Career Toolkit: 12 Original Illustrative CV Examples
// All names, contact details, and achievements are clearly labelled as illustrative/fictional models.

export interface CVExampleData {
  slug: string;
  title: string;
  titleBn: string;
  targetAudience: string;
  field: string;
  careerStage: string;
  isIllustrative: boolean;
  rationaleEn: string;
  rationaleBn: string;
  sectionBreakdown: {
    sectionName: string;
    order: number;
    purpose: string;
  }[];
  fullContent: {
    personalInfo: {
      fullName: string;
      email: string;
      phone: string;
      location: string;
      linkedin?: string;
      github?: string;
      portfolio?: string;
    };
    summary: string;
    education: {
      institution: string;
      degree: string;
      location: string;
      graduationDate: string;
      grade?: string;
      honors?: string;
      coursework?: string[];
    }[];
    experience?: {
      role: string;
      organization: string;
      location: string;
      period: string;
      bullets: string[];
    }[];
    research?: {
      projectTitle: string;
      role: string;
      institution: string;
      period: string;
      methodology: string;
      outcomes: string[];
    }[];
    projects?: {
      title: string;
      technologies?: string[];
      description: string;
      link?: string;
      bullets: string[];
    }[];
    skills?: {
      category: string;
      items: string[];
    }[];
    publications?: {
      citation: string;
      status: string;
      doi?: string;
    }[];
    awards?: {
      title: string;
      issuer: string;
      year: string;
      amount?: string;
    }[];
    volunteering?: {
      role: string;
      organization: string;
      period: string;
      impact: string;
    }[];
    languages?: {
      language: string;
      proficiency: string;
    }[];
    certifications?: {
      name: string;
      issuer: string;
      year: string;
    }[];
  };
}

export const CAREER_EXAMPLE_CVS: CVExampleData[] = [
  {
    slug: 'high-school-bachelors-applicant',
    title: 'High-School Graduate Applying for an International Bachelor’s Degree',
    titleBn: 'আন্তর্জাতিক ব্যাচেলর ডিগ্রির জন্য উচ্চ-মাধ্যমিক উত্তীর্ণ শিক্ষার্থীর সিভিস্যাম্পল',
    targetAudience: 'International Undergraduate Admissions Committees (US, Canada, Europe, Australia)',
    field: 'General STEM & Liberal Arts',
    careerStage: 'High School Senior / Pre-University Graduate',
    isIllustrative: true,
    rationaleEn: 'When applying for a bachelor’s degree abroad with zero formal full-time employment, the CV must lead with rigorous secondary academic qualifications (HSC/A-Levels), standardized language scores, extracurricular leadership, Olympiad participation, and community involvement.',
    rationaleBn: 'উচ্চ মাধ্যমিকের পর বিদেশে ব্যাচেলর ভর্তির ক্ষেত্রে কোনো দীর্ঘ চাকরির অভিজ্ঞতা থাকে না। তাই একাডেমিক ফলাফল (এইচএসসি/এ লেভেল), ইংরেজি দক্ষতা স্কোর, অলিম্পিয়াড বা বিতর্ক কার্যক্রম এবং সামাজিক নেতৃত্বের প্রমাণ শীর্ষে রাখা উচিত।',
    sectionBreakdown: [
      { sectionName: 'Contact & Portfolio', order: 1, purpose: 'Essential verified contact channels and academic GitHub/Blog link if applicable.' },
      { sectionName: 'Academic Profile', order: 2, purpose: 'Brief 3-sentence summary of intended field of study and intellectual curiosity.' },
      { sectionName: 'Education', order: 3, purpose: 'SSC and HSC / O & A Level scores, school names, GPA, and science/humanities group.' },
      { sectionName: 'Standardized Tests', order: 4, purpose: 'Official IELTS/TOEFL and SAT scores verifying language readiness.' },
      { sectionName: 'Academic Competitions & Olympiads', order: 5, purpose: 'Demonstrates national or regional intellectual rigor outside the classroom.' },
      { sectionName: 'Leadership & Extracurriculars', order: 6, purpose: 'Shows club leadership, school prefect roles, and teamwork capability.' },
      { sectionName: 'Volunteering & Community Service', order: 7, purpose: 'Demonstrates civic responsibility and empathy.' },
      { sectionName: 'Skills & Languages', order: 8, purpose: 'Basic programming, writing, and language proficiencies.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Tahmidur Rahman [Illustrative Model]',
        email: 'tahmid.rahman.example@borno.org',
        phone: '+880 1700-000001 (Fictional)',
        location: 'Dhaka, Bangladesh',
        linkedin: 'linkedin.com/in/illustrative-tahmid',
        github: 'github.com/illustrative-tahmid'
      },
      summary: 'Disciplined Science Group higher secondary graduate with GPA 5.00/5.00 seeking undergraduate admission in Computer Science. Proven mathematical problem-solving through National Math Olympiad regional distinction and active community volunteering.',
      education: [
        {
          institution: 'Notre Dame College, Dhaka',
          degree: 'Higher Secondary Certificate (HSC) — Science Group',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'August 2025',
          grade: 'GPA 5.00 / 5.00 (Golden A+)',
          coursework: ['Higher Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'ICT']
        },
        {
          institution: 'Government Laboratory High School, Dhaka',
          degree: 'Secondary School Certificate (SSC) — Science Group',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'May 2023',
          grade: 'GPA 5.00 / 5.00'
        }
      ],
      awards: [
        { title: 'Regional First Runner-Up — Bangladesh Mathematical Olympiad (BdMO)', issuer: 'BdMO Committee', year: '2024' },
        { title: 'Divisional Champion — National Children Science Congress', issuer: 'Society for the Popularization of Science Bangladesh (SPSB)', year: '2023' },
        { title: 'Dhaka Education Board Talentpool Merit Scholarship', issuer: 'Secondary and Higher Education Board, Dhaka', year: '2023' }
      ],
      volunteering: [
        {
          role: 'Volunteer Peer Tutor (Mathematics & Science)',
          organization: 'Underprivileged Children’s Educational Programs (UCEP Bangladesh)',
          period: 'July 2024 – June 2025',
          impact: 'Conducted weekly remedial tutoring in algebra and foundational geometry for 25 high school students from low-income families.'
        },
        {
          role: 'Vice President of Logistics',
          organization: 'Notre Dame Science Club',
          period: 'September 2023 – August 2024',
          impact: 'Coordinated workshop logistics and project exhibits for over 1,200 visiting school participants during the 32nd NDSC Science Fair.'
        }
      ],
      skills: [
        { category: 'Technical & Computational', items: ['Python (Basics)', 'Scratch', 'LaTeX (Document formatting)', 'MS Excel'] },
        { category: 'Languages', items: ['Bengali (Native)', 'English (Fluent, IELTS Overall: 7.5)'] }
      ]
    }
  },
  {
    slug: 'undergraduate-limited-experience',
    title: 'Undergraduate Student with Limited Formal Professional Experience',
    titleBn: 'সীমিত প্রাতিষ্ঠানিক চাকরির অভিজ্ঞতা সম্পন্ন আন্ডারগ্র্যাজুয়েট শিক্ষার্থীর সিভিস্যাম্পল',
    targetAudience: 'University Summer Research Grants, On-Campus Work-Study, and Initial Internships',
    field: 'Social Sciences & Humanities',
    careerStage: 'University 2nd Year Undergraduate',
    isIllustrative: true,
    rationaleEn: 'When an undergraduate has not yet held a corporate or formal internship, the CV shifts focus onto substantial university course term papers, academic class projects, campus society responsibilities, and transferable organizational skills.',
    rationaleBn: 'কর্পোরেট ইন্টার্নশিপের অভিজ্ঞতা না থাকলে সিভিতে সেমিস্টার ভিত্তিক অ্যাকাডেমিক টার্ম পেপার, ক্লাস প্রেজেন্টেশন, ক্লাব অ্যাক্টিভিটি ও সফট স্কিলসকে কার্যকরভাবে হাইলাইট করতে হয়।',
    sectionBreakdown: [
      { sectionName: 'Header', order: 1, purpose: 'University email, phone, and professional LinkedIn profile.' },
      { sectionName: 'Education', order: 2, purpose: 'Bachelor’s degree, current CGPA, relevant completed modules.' },
      { sectionName: 'Academic Term Projects', order: 3, purpose: 'Primary substantive evidence of analytical and writing capabilities.' },
      { sectionName: 'Campus Leadership & Activities', order: 4, purpose: 'Shows reliability, event coordination, and peer leadership.' },
      { sectionName: 'Part-Time / Campus Employment', order: 5, purpose: 'Highlights work ethic, customer support, and reliability.' },
      { sectionName: 'Core Competencies & Languages', order: 6, purpose: 'Software, research tools, and language proficiencies.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Nusrat Jahan [Illustrative Model]',
        email: 'nusrat.jahan.example@borno.org',
        phone: '+880 1800-000002 (Fictional)',
        location: 'Chittagong, Bangladesh',
        linkedin: 'linkedin.com/in/illustrative-nusrat'
      },
      summary: 'Second-year Economics undergraduate with a strong academic foundation (CGPA 3.82/4.00) in microeconomics and quantitative analysis. Proven research aptitude through independent term paper analyzing rural microcredit repayment dynamics in southeastern Bangladesh.',
      education: [
        {
          institution: 'University of Chittagong',
          degree: 'Bachelor of Social Sciences (BSS) in Economics',
          location: 'Chittagong, Bangladesh',
          graduationDate: 'Expected November 2027',
          grade: 'CGPA 3.82 / 4.00 (Dean’s Honor List: 1st Year)',
          coursework: ['Principles of Microeconomics', 'Intermediate Macroeconomics', 'Introductory Statistics for Economists', 'Mathematics for Economics', 'Development Studies']
        }
      ],
      projects: [
        {
          title: 'Empirical Term Study: Microfinance Lending Patterns in Hathazari Upazila',
          technologies: ['SPSS', 'MS Excel', 'Field Survey Interviews'],
          description: 'Conducted primary field survey among 45 female microcredit borrowers to evaluate financial literacy barriers.',
          bullets: [
            'Designed a 20-question structured survey administered across 3 villages in Hathazari under faculty guidance.',
            'Analyzed survey responses using SPSS, identifying a statistically significant correlation between baseline numeracy training and on-time weekly repayments.',
            'Presented findings in a 15-page academic term paper receiving highest departmental grade (A+).'
          ]
        }
      ],
      experience: [
        {
          role: 'Departmental Peer Study Group Leader',
          organization: 'Economics Department Study Circle',
          location: 'University of Chittagong',
          period: 'January 2025 – Present',
          bullets: [
            'Organize bi-weekly calculus and statistical problem-solving sessions for 18 first-year undergraduate students.',
            'Created supplementary formula reference sheets distributed to over 80 classmates ahead of midterm assessments.'
          ]
        }
      ],
      volunteering: [
        {
          role: 'Sub-Editor — Departmental Annual Magazine',
          organization: 'Chittagong University Economics Alumni & Student Forum',
          period: 'August 2024 – Present',
          impact: 'Proofread and fact-checked 14 student articles and faculty essays for publication; managed contributor deadlines.'
        }
      ],
      skills: [
        { category: 'Data Analysis & Quantitative', items: ['SPSS', 'Microsoft Excel (Pivot Tables, Regression Toolpak)', 'Qualitative Survey Design'] },
        { category: 'Languages', items: ['Bengali (Native)', 'English (Professional Working Proficiency, IELTS: 7.0)'] }
      ]
    }
  },
  {
    slug: 'computer-science-software-engineering',
    title: 'Computer Science & Software Engineering Technical Resume',
    titleBn: 'কম্পিউটার সায়েন্স ও সফটওয়্যার ইঞ্জিনিয়ারিং প্রফেশনাল টেকনিক্যাল রিজিউমি',
    targetAudience: 'Global Tech Firms, Software Engineering Internships, and US/European MSc in CS Admissions',
    field: 'Computer Science, Systems & AI',
    careerStage: 'Final Year BSc in CS / Software Engineer Applicant',
    isIllustrative: true,
    rationaleEn: 'Technical software engineering resumes must prioritize concrete engineering contributions, exact tech stacks per project, verifiable GitHub/live URLs, algorithmic rigor, and measurable latency/throughput/scaling impacts.',
    rationaleBn: 'সফটওয়্যার ইঞ্জিনিয়ারিং রিজিউমিতে প্রকল্পের টেক স্ট্যাক, গিটহাব রিপোজিটরি লিংক, অ্যালগরিদমিক দক্ষতা এবং সিস্টেমে পারফরম্যান্স বা লেটেন্সি উন্নতির পরিমাপযোগ্য ডেটা তুলে ধরতে হয়।',
    sectionBreakdown: [
      { sectionName: 'Header', order: 1, purpose: 'Name, GitHub, LeetCode / Codeforces profile, LinkedIn, and personal portfolio site.' },
      { sectionName: 'Technical Skills Matrix', order: 2, purpose: 'Languages, Frameworks, Cloud/DevOps, Database, and Developer Tools placed at the top for instant technical screening.' },
      { sectionName: 'Software Engineering Projects', order: 3, purpose: 'Deep technical descriptions of distributed, full-stack, or machine learning projects with architecture details.' },
      { sectionName: 'Professional / Internship Experience', order: 4, purpose: 'Software internships, industry responsibilities, and system performance metrics.' },
      { sectionName: 'Education & Honors', order: 5, purpose: 'BSc Computer Science, core CS algorithms coursework, and hackathon victories.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Arifur Rahman [Illustrative Model]',
        email: 'arifur.rahman.cs.example@borno.org',
        phone: '+880 1711-000003 (Fictional)',
        location: 'Dhaka, Bangladesh',
        linkedin: 'linkedin.com/in/illustrative-arifur',
        github: 'github.com/illustrative-arifur',
        portfolio: 'arifur-dev.example.com'
      },
      summary: 'Final-year Computer Science undergraduate with experience building scalable backend microservices, caching layers, and real-time distributed pipelines using Go, TypeScript, and PostgreSQL. Solved 450+ algorithmic problems across LeetCode and Codeforces.',
      skills: [
        { category: 'Languages', items: ['Go (Golang)', 'TypeScript / JavaScript', 'Python', 'C++', 'SQL'] },
        { category: 'Frameworks & Libraries', items: ['Node.js (Express/Fastify)', 'React 19', 'Next.js', 'Gin-Gonic', 'gRPC', 'Tailwind CSS'] },
        { category: 'Infrastructure & Databases', items: ['PostgreSQL', 'Redis', 'Docker', 'Kubernetes (Basics)', 'AWS (S3, EC2, CloudFront)', 'Kafka'] },
        { category: 'Developer Tools & Practices', items: ['Git / GitHub Actions (CI/CD)', 'Jest', 'Postman', 'Linux (Ubuntu/Debian)', 'System Design'] }
      ],
      projects: [
        {
          title: 'Distributed Real-Time Admissions Notification Service',
          technologies: ['Go', 'Apache Kafka', 'Redis', 'Docker', 'PostgreSQL'],
          description: 'High-throughput event-driven microservice dispatching instant status updates to 50,000+ simulated concurrent applicants.',
          bullets: [
            'Architected asynchronous message ingestion pipeline using Apache Kafka topic partitioning, processing 12,000 events/sec with sub-40ms latency.',
            'Implemented a multi-tier caching strategy via Redis Cluster, cutting database read loads on university profile endpoints by 74%.',
            'Configured automated CI/CD pipeline with GitHub Actions executing unit tests and publishing multi-arch Docker images to AWS ECR.'
          ]
        },
        {
          title: 'Global University Admission Portal & Equivalent Search Engine',
          technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Vite', 'REST API'],
          description: 'Accessible full-stack web application with responsive search indexing 1,000+ degree programs across 25 destination countries.',
          bullets: [
            'Engineered client-side search engine featuring debounced fuzzy filtering, enabling instant search across 10,000+ database records.',
            'Built responsive, bilingual interface supporting English and Bengali with full dark-mode compatibility and ARIA accessibility standards.'
          ]
        }
      ],
      experience: [
        {
          role: 'Software Engineering Intern',
          organization: 'Apex Solutions Ltd. (Fictional Software Agency)',
          location: 'Dhaka, Bangladesh',
          period: 'June 2024 – December 2024',
          bullets: [
            'Contributed to customer-facing FinTech API in Node.js/TypeScript serving 150,000 daily financial transaction queries.',
            'Optimized 12 complex PostgreSQL reporting queries with composite indexes and CTEs, reducing median query execution time from 1.8s to 190ms.',
            'Wrote comprehensive integration test suites using Jest and Supertest, expanding test coverage across payment gateway modules from 52% to 88%.'
          ]
        }
      ],
      education: [
        {
          institution: 'Bangladesh University of Engineering and Technology (BUET)',
          degree: 'Bachelor of Science in Computer Science and Engineering (CSE)',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'Expected October 2025',
          grade: 'CGPA 3.86 / 4.00 (Dean’s Merit Award)',
          coursework: ['Data Structures & Algorithms', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Compiler Design', 'Distributed Systems']
        }
      ],
      awards: [
        { title: 'Top 5 Finalist — National University Hackathon 2024', issuer: 'ICT Division, Bangladesh', year: '2024' },
        { title: 'Candidate Master Rank (1900+ Rating)', issuer: 'Codeforces Competitive Programming', year: '2024' }
      ]
    }
  },
  {
    slug: 'mechanical-electrical-engineering',
    title: 'Engineering Student Technical CV (Mechanical & Electrical)',
    titleBn: 'ইঞ্জিনিয়ারিং শিক্ষার্থীর টেকনিক্যাল সিভি (মেকানিক্যাল ও ইলেকট্রিক্যাল)',
    targetAudience: 'Industrial Manufacturing, Aerospace, Robotics, and European Engineering Master’s Admissions',
    field: 'Mechanical & Electrical Engineering',
    careerStage: 'Final Year BEng / BSc in Engineering',
    isIllustrative: true,
    rationaleEn: 'Engineering CVs require precision: CAD/FEA simulation software, physical laboratory testing, adherence to engineering standards (ISO, ASME, IEEE), hardware microcontrollers, and measurable safety/efficiency improvements.',
    rationaleBn: 'ইঞ্জিনিয়ারিং সিভিতে CAD/FEA সিমুলেশন সফটওয়্যার, ল্যাব টেস্টিং, স্ট্যান্ডার্ডস (ISO, ASME, IEEE) এবং হার্ডওয়্যার ও সার্কিট ডিজাইনের অভিজ্ঞতা সুনির্দিষ্টভাবে উল্লেখ করতে হয়।',
    sectionBreakdown: [
      { sectionName: 'Header', order: 1, purpose: 'Contact information, LinkedIn, and CAD portfolio link.' },
      { sectionName: 'Education', order: 2, purpose: 'Degree in Mechanical/Electrical Engineering, key engineering mechanics/electronics coursework.' },
      { sectionName: 'Technical & Engineering Proficiencies', order: 3, purpose: 'CAD, FEA, circuit design tools, manufacturing methods, programming languages.' },
      { sectionName: 'Engineering Capstone & Design Projects', order: 4, purpose: 'Multi-disciplinary design projects with clear physical parameters and testing metrics.' },
      { sectionName: 'Industrial Training & Plant Experience', order: 5, purpose: 'Factory or power plant internships demonstrating hands-on safety and maintenance protocols.' },
      { sectionName: 'Professional Memberships & Certifications', order: 6, purpose: 'IEEE, ASME, or national engineer association student memberships.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Farhan Kabir [Illustrative Model]',
        email: 'farhan.kabir.eng.example@borno.org',
        phone: '+880 1911-000004 (Fictional)',
        location: 'Gazipur, Bangladesh',
        linkedin: 'linkedin.com/in/illustrative-farhan',
        portfolio: 'farhan-cad-portfolio.example.com'
      },
      summary: 'Final-year Mechanical Engineering undergraduate specializing in thermo-fluid simulation and finite element analysis (FEA). Experienced in SolidWorks CAD, Ansys Fluent CFD, and rapid 3D prototyping for industrial energy systems.',
      education: [
        {
          institution: 'Islamic University of Technology (IUT), OIC',
          degree: 'Bachelor of Science in Mechanical Engineering (ME)',
          location: 'Board Bazar, Gazipur, Bangladesh',
          graduationDate: 'Expected November 2025',
          grade: 'CGPA 3.78 / 4.00 (First Class with Honours)',
          coursework: ['Fluid Dynamics', 'Heat Transfer', 'Finite Element Analysis', 'Machine Design', 'Control Systems', 'Renewable Energy Engineering']
        }
      ],
      skills: [
        { category: 'CAD & Simulation Tools', items: ['SolidWorks (CSWA Certified)', 'Ansys Fluent (CFD)', 'Ansys Mechanical (FEA)', 'AutoCAD 2024', 'MATLAB / Simulink'] },
        { category: 'Manufacturing & Hardware', items: ['3D Printing (FDM/SLA)', 'CNC Machining (G-Code)', 'Arduino Microcontrollers', 'Welding & Lathe Operation'] },
        { category: 'Programming & Data', items: ['Python (NumPy, SciPy for engineering analysis)', 'C++', 'LaTeX'] }
      ],
      projects: [
        {
          title: 'Design and Aerodynamic Optimization of a Low-Reynolds-Number Savonius Wind Turbine',
          technologies: ['SolidWorks', 'Ansys Fluent CFD', 'Wind Tunnel Testing'],
          description: 'Year-long undergraduate senior capstone project aimed at enhancing low-wind-speed power generation for coastal Bangladesh.',
          bullets: [
            'Engineered a novel helical blade profile in SolidWorks, reducing rotational torque fluctuations by 28% compared to standard semicircular designs.',
            'Conducted 2D and 3D turbulent CFD simulations in Ansys Fluent across Reynolds numbers 50,000–150,000 using k-omega SST models.',
            'Constructed a 1:5 scale physical prototype using PETG 3D printing and verified power coefficients in the departmental subsonic wind tunnel.'
          ]
        }
      ],
      experience: [
        {
          role: 'Industrial Engineering Trainee',
          organization: 'Summit Power Generation Facility (Fictional Plant Placement)',
          location: 'Narayanganj, Bangladesh',
          period: 'May 2024 – July 2024',
          bullets: [
            'Completed 8-week intensive industrial placement inspecting 120MW heavy fuel oil (HFO) reciprocating engines and auxiliary steam boilers.',
            'Monitored turbine vibration signatures and thermodynamic heat rate charts alongside licensed plant operations engineers.',
            'Compiled comprehensive 45-page plant safety and maintenance report compliant with OSHA and Bangladesh environmental safety standards.'
          ]
        }
      ],
      certifications: [
        { name: 'Certified SolidWorks Associate (CSWA) in Mechanical Design', issuer: 'Dassault Systèmes', year: '2024' },
        { name: 'Six Sigma White Belt Certification', issuer: 'Council for Six Sigma Certification', year: '2023' }
      ]
    }
  },
  {
    slug: 'business-management-student',
    title: 'Business & Management Student Strategic Resume',
    titleBn: 'বিজনেস ও ম্যানেজমেন্ট শিক্ষার্থীর স্ট্র্যাটেজিক প্রফেশনাল রিজিউমি',
    targetAudience: 'Management Consulting, FMCG Brand Management, Corporate Finance, and Global MBA/MIM Admissions',
    field: 'Business Administration, Finance & Marketing',
    careerStage: 'Final Year BBA / Early Career Professional',
    isIllustrative: true,
    rationaleEn: 'Business and finance resumes must strictly demonstrate quantitative business impact, revenue generation, cost reduction, market growth, stakeholder management, and cross-functional leadership using the STAR formula.',
    rationaleBn: 'বিজনেস ও ফাইন্যান্স রিজিউমিতে রাজস্ব বৃদ্ধি, ক্লায়েন্ট ম্যানেজমেন্ট, বাজার বিস্তার এবং ব্যবসায়িক বিশ্লেষণের প্রমাণ ডেটাসহ STAR ফরম্যাটে উপস্থাপন করা আবশ্যক।',
    sectionBreakdown: [
      { sectionName: 'Header', order: 1, purpose: 'Professional contact information and curated LinkedIn profile.' },
      { sectionName: 'Executive Profile', order: 2, purpose: 'Punchy 3-line statement of commercial acumen and analytical skill.' },
      { sectionName: 'Education', order: 3, purpose: 'BBA/BCom degree, CGPA, major in Finance/Marketing, and business case distinctions.' },
      { sectionName: 'Corporate & Internship Experience', order: 4, purpose: 'High-impact business experience with revenue/metric outcomes.' },
      { sectionName: 'National Business Competitions & Case Solving', order: 5, purpose: 'Extracurricular proof of commercial problem-solving under pressure.' },
      { sectionName: 'Leadership & Extracurricular Roles', order: 6, purpose: 'Demonstrates executive presence, event management, and team building.' },
      { sectionName: 'Analytical Tools & Languages', order: 7, purpose: 'Power BI, Advanced Excel, SQL, and languages.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Zubair Hossain [Illustrative Model]',
        email: 'zubair.hossain.biz.example@borno.org',
        phone: '+880 1811-000005 (Fictional)',
        location: 'Dhaka, Bangladesh',
        linkedin: 'linkedin.com/in/illustrative-zubair'
      },
      summary: 'Results-driven BBA graduate majoring in Finance & Marketing. Demonstrated track record in financial modeling, consumer market analysis, and revenue optimization through FMCG internship and national business case competition wins.',
      education: [
        {
          institution: 'Institute of Business Administration (IBA), University of Dhaka',
          degree: 'Bachelor of Business Administration (BBA)',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'December 2024',
          grade: 'CGPA 3.75 / 4.00 (Dean’s Honor List)',
          coursework: ['Corporate Finance', 'Financial Statement Analysis', 'Brand Management', 'Consumer Behavior', 'Supply Chain Management', 'Business Analytics']
        }
      ],
      experience: [
        {
          role: 'Brand & Market Activation Intern',
          organization: 'Unilever Bangladesh (Fictional Traineeship Model)',
          location: 'Dhaka, Bangladesh',
          period: 'June 2024 – November 2024',
          bullets: [
            'Spearheaded trade marketing analytics across 18 retail distribution clusters in Chittagong Division, analyzing sales velocity data for 4 core personal care brands.',
            'Designed digital campaign dashboard in Power BI consolidating POS data, reducing weekly reporting turnaround time by 5 hours.',
            'Formulated point-of-sale promotional strategy that contributed to a 14% quarter-over-quarter volume uplift across pilot modern-trade retail outlets.'
          ]
        }
      ],
      awards: [
        { title: 'National Champion — Battle of Minds Business Case Competition 2024', issuer: 'National Inter-University Case League', year: '2024' },
        { title: 'First Runner-Up — Brandstorm Marketing Championship', issuer: 'L’Oréal Academic Partnership Bangladesh', year: '2023' }
      ],
      volunteering: [
        {
          role: 'President',
          organization: 'IBA Communication and Career Club',
          period: 'January 2023 – January 2024',
          impact: 'Led executive board of 15 students to organize the National Career Conclave 2023, attracting 42 corporate hiring partners and 1,800 student attendees.'
        }
      ],
      skills: [
        { category: 'Financial & Business Analytics', items: ['Financial DCF Modeling', 'Microsoft Excel (Advanced: VLOOKUP, INDEX/MATCH, Monte Carlo)', 'Power BI', 'Tableau', 'SQL (Basics)'] },
        { category: 'Languages', items: ['Bengali (Native)', 'English (Bilingual / C2 Proficiency, IELTS: 8.0)'] }
      ]
    }
  },
  {
    slug: 'pharmacy-life-sciences-student',
    title: 'Pharmacy & Life Sciences Research CV',
    titleBn: 'ফার্মেসি ও লাইফ সায়েন্সেস রিসার্চ কারিকুলাম ভিটি (সিভি)',
    targetAudience: 'Global Pharmaceutical Companies, Clinical Trial Units, and International MSc/PhD in Pharmacology Admissions',
    field: 'Pharmacy, Pharmacology & Biotechnology',
    careerStage: 'Bachelor of Pharmacy (BPharm) Graduate',
    isIllustrative: true,
    rationaleEn: 'Pharmacy and life sciences CVs must clearly document wet-lab instrumentation proficiencies (HPLC, UV-Vis, PCR), laboratory safety accreditations, clinical trial ethics, pharmaceutical formulation expertise, and scientific thesis investigations.',
    rationaleBn: 'ফার্মেসি ও বায়োমেডিকেল সিভিতে গবেষণাগার বিশ্লেষণ যন্ত্র (HPLC, UV-Vis, PCR), গুড ল্যাবরেটরি প্র্যাকটিস (GLP), ওষুধ ফর্মুলেশন ও থিসিস রিসার্চের তথ্য সুস্পষ্টভাবে তুলে ধরা আবশ্যক।',
    sectionBreakdown: [
      { sectionName: 'Header', order: 1, purpose: 'Contact details, Pharmacy Council of Bangladesh registration status (if applicable), and LinkedIn.' },
      { sectionName: 'Academic Qualifications', order: 2, purpose: 'BPharm (Professional 4-Year Degree), class standing, key pharmacology coursework.' },
      { sectionName: 'Laboratory & Analytical Instrumentation Skills', order: 3, purpose: 'Essential wet-lab techniques placed upfront for lab manager review.' },
      { sectionName: 'Undergraduate Research Thesis', order: 4, purpose: 'Details experimental drug extraction, in vitro assays, and statistical analysis.' },
      { sectionName: 'Hospital & Industrial Pharmacy Placements', order: 5, purpose: 'Mandatory clinical hospital rotation and pharma factory quality control exposure.' },
      { sectionName: 'Conferences & Poster Presentations', order: 6, purpose: 'Scientific abstracts presented at pharmacology symposiums.' },
      { sectionName: 'Certifications & Referees', order: 7, purpose: 'GLP, GCP, biosafety training, and supervising professors.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Sadia Afreen, BPharm [Illustrative Model]',
        email: 'sadia.afreen.pharm.example@borno.org',
        phone: '+880 1722-000006 (Fictional)',
        location: 'Dhaka, Bangladesh',
        linkedin: 'linkedin.com/in/illustrative-sadia'
      },
      summary: 'Bachelor of Pharmacy (BPharm) graduate with extensive wet-laboratory experience in phytochemistry, High-Performance Liquid Chromatography (HPLC), and in vitro antioxidant assays. Seeking postgraduate research admission in Drug Discovery and Molecular Pharmacology.',
      education: [
        {
          institution: 'Faculty of Pharmacy, University of Dhaka',
          degree: 'Bachelor of Pharmacy (BPharm) Professional',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'January 2025',
          grade: 'CGPA 3.84 / 4.00 (3rd in class of 85)',
          coursework: ['Advanced Pharmacology', 'Medicinal Chemistry', 'Biopharmaceutics & Pharmacokinetics', 'Pharmaceutical Microbiology', 'Quality Assurance & Regulatory Affairs']
        }
      ],
      skills: [
        { category: 'Instrumentation & Laboratory Techniques', items: ['High-Performance Liquid Chromatography (HPLC)', 'UV-Vis Spectrophotometry', 'Rotary Evaporation', 'Thin Layer Chromatography (TLC)', 'Bacterial Cell Culture', 'In Vitro DPPH Assay'] },
        { category: 'Regulatory Standards & Software', items: ['Good Laboratory Practice (GLP)', 'Good Clinical Practice (GCP)', 'GraphPad Prism (Biostatistics)', 'ChemDraw', 'EndNote'] }
      ],
      research: [
        {
          projectTitle: 'Evaluation of In Vitro Antioxidant, Thrombolytic, and Cytotoxic Activities of Ethanolic Bark Extract of Terminalia arjuna',
          role: 'Undergraduate Thesis Researcher (Supervisor: Prof. Dr. M. Karim)',
          institution: 'University of Dhaka Phytochemical Research Laboratory',
          period: 'September 2023 – October 2024',
          methodology: 'Cold extraction of plant bark using 80% ethanol; quantification of total phenolic content via Folin-Ciocalteu assay; clot lysis thrombolytic evaluation on human venous blood samples; brine shrimp lethality bioassay for preliminary cytotoxicity.',
          outcomes: [
            'Determined IC50 of 42.6 µg/mL for DPPH radical scavenging activity compared to ascorbic acid standard (IC50 18.2 µg/mL).',
            'Observed 56.4% clot lysis in thrombolytic assay, demonstrating statistically significant activity (p < 0.01) relative to streptokinase control.',
            'Manuscript currently finalized for submission to the Bangladesh Journal of Pharmacology.'
          ]
        }
      ],
      experience: [
        {
          role: 'Industrial Quality Control Trainee',
          organization: 'Square Pharmaceuticals Ltd. (Fictional Training Placement)',
          location: 'Pabna, Bangladesh',
          period: 'July 2024 – August 2024',
          bullets: [
            'Completed 4-week mandatory industrial rotation participating in dissolution testing, tablet friability, and raw material assay verification under cGMP guidelines.',
            'Observed automated sterile injectable filling lines and cleanroom airflow monitoring protocols.'
          ]
        },
        {
          role: 'Hospital Pharmacy Intern',
          organization: 'Dhaka Medical College Hospital',
          location: 'Dhaka, Bangladesh',
          period: 'January 2024 – February 2024',
          bullets: [
            'Shadowed senior clinical pharmacists reviewing in-patient prescription charts for adverse drug interactions and dosage calculations in the nephrology ward.'
          ]
        }
      ]
    }
  },
  {
    slug: 'scholarship-cv-erasmus-commonwealth',
    title: 'Prestigious Scholarship CV (Erasmus Mundus / Commonwealth / DAAD)',
    titleBn: 'মর্যাদাপূর্ণ স্কলারশিপ সিভিস্যাম্পল (ইরাসমাস মুন্ডুস, কমনওয়েলথ ও ডাড)',
    targetAudience: 'International Scholarship Selection Panels (Erasmus Mundus Joint Masters, Commonwealth, DAAD, Fulbright)',
    field: 'Interdisciplinary Development & Environmental Science',
    careerStage: 'Bachelor’s Graduate applying for Full International Funding',
    isIllustrative: true,
    rationaleEn: 'Scholarship CVs must balance top academic performance (CGPA/Dean’s list) with profound civic leadership, community impact, intercultural adaptability, and a clear vision for socioeconomic contribution back to Bangladesh.',
    rationaleBn: 'স্কলারশিপ সিভিতে অসাধারণ অ্যাকাডেমিক রেজাল্টের পাশাপাশি নেতৃত্ব, কমিউনিটি ভলান্টিয়ারিং, আন্তঃসাংস্কৃতিক অভিজ্ঞতা এবং নিজ দেশের উন্নয়নে অবদানের সুনির্দিষ্ট রূপরেখা থাকতে হয়।',
    sectionBreakdown: [
      { sectionName: 'Header & Citizenship', order: 1, purpose: 'Full name, nationality (vital for partner country scholarship quotas), and contact details.' },
      { sectionName: 'Scholarship Candidate Profile', order: 2, purpose: 'Concise summary articulating alignment with the scholarship’s global mission.' },
      { sectionName: 'Higher Education & Distinctions', order: 3, purpose: 'Degree, CGPA, institutional rank, thesis title, and ECTS equivalency.' },
      { sectionName: 'Academic Honors & Prestigious Awards', order: 4, purpose: 'Government and university merit awards proving academic distinction.' },
      { sectionName: 'Research & Sustainable Development Initiatives', order: 5, purpose: 'Projects directly tackling UN Sustainable Development Goals (SDGs).' },
      { sectionName: 'Leadership & Community Development Impact', order: 6, purpose: 'Substantive civic contributions demonstrating leadership potential.' },
      { sectionName: 'Global Languages & Intercultural Competencies', order: 7, purpose: 'English proficiency scores and foreign languages demonstrating mobility readiness.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Anika Tabassum [Illustrative Model]',
        email: 'anika.tabassum.scholar.example@borno.org',
        phone: '+880 1733-000007 (Fictional)',
        location: 'Sylhet, Bangladesh (Nationality: Bangladeshi)',
        linkedin: 'linkedin.com/in/illustrative-anika'
      },
      summary: 'Academic gold medalist with a First Class Honours degree in Environmental Science and 3 years of community leadership in climate resilience. Seeking Erasmus Mundus / Commonwealth funding to pioneer sustainable coastal saline management frameworks in South Asia.',
      education: [
        {
          institution: 'Shahjalal University of Science and Technology (SUST)',
          degree: 'Bachelor of Science (BSc Honours) in Environmental Science',
          location: 'Sylhet, Bangladesh',
          graduationDate: 'November 2024',
          grade: 'CGPA 3.92 / 4.00 (Class Rank: 1st out of 60 | Prime Minister Gold Medal Nominee)',
          coursework: ['Climate Change Vulnerability & Adaptation', 'GIS & Remote Sensing', 'Water Resource Management', 'Environmental Impact Assessment (EIA)']
        }
      ],
      awards: [
        { title: 'Vice-Chancellor Academic Excellence Award', issuer: 'Shahjalal University of Science and Technology', year: '2024' },
        { title: 'National Youth Climate Leadership Fellowship', issuer: 'Ministry of Environment, Forest and Climate Change', year: '2023', amount: 'BDT 50,000 stipend' }
      ],
      research: [
        {
          projectTitle: 'Assessing Soil Salinity Intrusion Dynamics in Khulna Coastal Belt Using Sentinel-2 Satellite Imagery',
          role: 'Principal Student Investigator',
          institution: 'SUST Geoinformatics Laboratory',
          period: 'January 2024 – October 2024',
          methodology: 'Processed 5 years of multi-spectral Sentinel-2 satellite data in QGIS and Google Earth Engine; correlated normalized difference salinity index (NDSI) with 60 ground-truth soil moisture samples.',
          outcomes: [
            'Mapped spatial progression of seasonal salinity shifts affecting 14,000 hectares of agricultural land.',
            'Presented findings at the 4th International Conference on Climate Change and Water Resources (ICCCWR 2024).'
          ]
        }
      ],
      volunteering: [
        {
          role: 'Founder & Team Lead',
          organization: 'Clean Surma Coastal Initiative (Student NGO)',
          period: 'March 2022 – Present',
          impact: 'Mobilized over 300 student volunteers across 12 riverside cleanups, diverting 4.2 tons of single-use plastic waste; organized climate education workshops for 600 rural schoolchildren.'
        }
      ],
      skills: [
        { category: 'Technical & Geoinformatics', items: ['QGIS', 'ArcGIS Pro', 'Google Earth Engine', 'R for Environmental Data', 'Water Sampling Kits'] },
        { category: 'Languages', items: ['Bengali (Native)', 'English (Fluent, IELTS Overall: 8.0 — L:8.5, R:8.5, W:7.5, S:7.5)', 'French (A2 Elementary)'] }
      ]
    }
  },
  {
    slug: 'graduate-applying-for-msc',
    title: 'Graduate Applying for an International Master of Science (MSc)',
    titleBn: 'বিদেশে মাস্টার্স অব সায়েন্স (MSc) ভর্তির জন্য স্ট্যান্ডার্ড গ্র্যাজুয়েট সিভি',
    targetAudience: 'European (Germany, Sweden, Netherlands, UK) and Canadian MSc Admissions Boards',
    field: 'Data Science & Information Systems',
    careerStage: 'BSc Graduate with 1 Year Post-Grad Experience',
    isIllustrative: true,
    rationaleEn: 'When applying for an MSc, the admissions committee wants to see mathematical and foundational course prerequisites, bachelor’s thesis scope, research assistantships, and clarity on how the MSc will bridge prior study with career goals.',
    rationaleBn: 'মাস্টার্স ভর্তিতে অ্যাডমিশন কমিটি ব্যাচেলর ডিগ্রির প্রাসঙ্গিক কোর্সওয়ার্ক, থিসিস টপিক, ল্যাব রিসার্চ অ্যাসিস্ট্যান্টশিপ ও ভবিষ্যৎ গবেষণার লক্ষ্য গভীরভাবে পর্যবেক্ষণ করে।',
    sectionBreakdown: [
      { sectionName: 'Header', order: 1, purpose: 'Contact details, GitHub, and academic web profile.' },
      { sectionName: 'Academic Profile', order: 2, purpose: 'Focused declaration of quantitative interests for MSc entry.' },
      { sectionName: 'Education & Prerequisites', order: 3, purpose: 'BSc degree with breakdown of linear algebra, calculus, and algorithms grades.' },
      { sectionName: 'Bachelor’s Thesis & Research', order: 4, purpose: 'Detailed breakdown of undergraduate thesis topic, supervisor, and empirical results.' },
      { sectionName: 'Relevant Technical Experience', order: 5, purpose: 'Post-graduate industry work as a data analyst or junior researcher.' },
      { sectionName: 'Technical Toolset & Languages', order: 6, purpose: 'Python, R, SQL, Machine Learning libraries, and English certification.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Mehedi Hasan [Illustrative Model]',
        email: 'mehedi.hasan.msc.example@borno.org',
        phone: '+880 1744-000008 (Fictional)',
        location: 'Dhaka, Bangladesh',
        linkedin: 'linkedin.com/in/illustrative-mehedi',
        github: 'github.com/illustrative-mehedi'
      },
      summary: 'Computer Science and Statistics graduate with 14 months of professional experience in predictive machine learning models. Seeking admission to MSc in Data Science to conduct advanced research in graph neural networks and scalable causal inference.',
      education: [
        {
          institution: 'East West University (EWU)',
          degree: 'Bachelor of Science in Computer Science & Engineering',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'August 2024',
          grade: 'CGPA 3.81 / 4.00 (Magna Cum Laude)',
          coursework: ['Multivariate Calculus (A)', 'Linear Algebra (A)', 'Probability & Statistics (A+)', 'Machine Learning (A)', 'Algorithms (A)', 'Database Systems (A)']
        }
      ],
      research: [
        {
          projectTitle: 'Graph Convolutional Networks for Fraud Detection in Mobile Financial Services',
          role: 'Undergraduate Thesis Researcher',
          institution: 'EWU Machine Intelligence Lab',
          period: 'September 2023 – July 2024',
          methodology: 'Constructed heterogeneous transaction graphs from 200,000 anonymized financial logs; implemented GCN and GraphSAGE models in PyTorch Geometric.',
          outcomes: [
            'Achieved ROC-AUC of 0.942, outperforming traditional XGBoost baselines by 8.4% on imbalanced illicit transaction patterns.',
            'Co-authored paper presented at the 2024 International Conference on Computer and Information Technology (ICCIT).'
          ]
        }
      ],
      experience: [
        {
          role: 'Junior Data Analyst',
          organization: 'Pathao Tech Solutions (Fictional Analytics Unit)',
          location: 'Dhaka, Bangladesh',
          period: 'August 2024 – Present',
          bullets: [
            'Develop automated feature engineering pipelines in SQL and Python predicting rider churn probability with 82% precision.',
            'Build weekly executive metrics reports in Metabase tracking driver retention across 3 metropolitan regions.'
          ]
        }
      ],
      skills: [
        { category: 'Programming & ML Frameworks', items: ['Python (PyTorch, Scikit-learn, Pandas, NumPy)', 'SQL (PostgreSQL, BigQuery)', 'R', 'Git'] },
        { category: 'Languages', items: ['Bengali (Native)', 'English (C1, IELTS Overall: 7.5 — L:8.0, R:8.0, W:7.0, S:7.0)'] }
      ]
    }
  },
  {
    slug: 'graduate-applying-for-phd',
    title: 'Graduate Applying for a Doctoral Degree (PhD / DPhil)',
    titleBn: 'আন্তর্জাতিক ডক্টরেট (PhD / DPhil) প্রোগ্রামে ভর্তির জন্য সম্পূর্ণ অ্যাকাডেমিক সিভি',
    targetAudience: 'Doctoral Admissions Committees, Potential PhD Supervisors, and Research Councils',
    field: 'Materials Science, Physics & Nanotechnology',
    careerStage: 'Master of Science Graduate / Prospective Doctoral Candidate',
    isIllustrative: true,
    rationaleEn: 'A PhD application CV is an exhaustive scholarly record. It places publications, research methodologies, external research grants, peer reviews, laboratory techniques, and thesis defense outcomes before all other sections.',
    rationaleBn: 'পিএইচডি ভর্তির সিভিতে রিসার্চ পেপারস, কনফারেন্স প্রেজেন্টেশন, মাস্টার্স থিসিসের ফলাফল, ল্যাব ইনস্ট্রুমেন্টেশন ও অধ্যাপকদের রেফারেন্স সর্বোচ্চ গুরুত্ব পায়।',
    sectionBreakdown: [
      { sectionName: 'Header & Identifiers', order: 1, purpose: 'Full name, institutional address, email, ORCID ID, and Google Scholar profile.' },
      { sectionName: 'Research Interests', order: 2, purpose: '3–4 precise scientific areas of doctoral inquiry.' },
      { sectionName: 'Education', order: 3, purpose: 'MSc and BSc degrees with explicit thesis titles and supervisory committees.' },
      { sectionName: 'Peer-Reviewed Publications', order: 4, purpose: 'Refereed journal articles formatted in IEEE/APA with candidate name bolded.' },
      { sectionName: 'Manuscripts In Review / Preparation', order: 5, purpose: 'Documenting ongoing pipeline of scientific works.' },
      { sectionName: 'Research Appointments & Lab Experience', order: 6, purpose: 'Full-time Research Assistantship and cleanroom/spectroscopy roles.' },
      { sectionName: 'Conference Presentations', order: 7, purpose: 'Oral presentations and peer-reviewed poster sessions.' },
      { sectionName: 'Teaching & Mentoring', order: 8, purpose: 'Undergraduate laboratory tutoring and TA experience.' },
      { sectionName: 'Grants & Travel Fellowships', order: 9, purpose: 'Funded competitive travel grants and research awards.' },
      { sectionName: 'Academic Referees', order: 10, purpose: 'Three tenure-track professors with complete institutional contact details.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Dr. (cand.) Kazi Nazmul Huda [Illustrative Model]',
        email: 'kazi.huda.phd.example@borno.org',
        phone: '+880 1755-000009 (Fictional)',
        location: 'Dhaka, Bangladesh',
        linkedin: 'linkedin.com/in/illustrative-kazi-huda',
        portfolio: 'orcid.org/0000-0002-0000-0001 (Illustrative)'
      },
      summary: 'Research Interests: 2D Van der Waals Heterostructures, Perovskite Photovoltaics, Optoelectronic Device Fabrication, Density Functional Theory (DFT) Simulations.',
      education: [
        {
          institution: 'Bangladesh University of Engineering and Technology (BUET)',
          degree: 'Master of Science in Materials and Metallurgical Engineering (MSc Engg)',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'Defended October 2024',
          grade: 'CGPA 3.90 / 4.00',
          honors: 'Thesis: "Interface Engineering in Carbon-Based Perovskite Solar Cells for Enhanced Ambient Stability"'
        },
        {
          institution: 'BUET',
          degree: 'Bachelor of Science in Materials and Metallurgical Engineering',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'February 2022',
          grade: 'CGPA 3.84 / 4.00'
        }
      ],
      publications: [
        {
          citation: 'Huda, K. N., Rahman, M. A., & Karim, S. (2024). Enhanced Photovoltaic Performance and Moisture Resilience in Hybrid Perovskite Solar Cells via 2D Ti3C2Tx MXene Interlayers. Journal of Materials Chemistry A, 12(18), 10450-10462.',
          status: 'Published',
          doi: '10.1039/D4TA00000X (Illustrative)'
        },
        {
          citation: 'Huda, K. N., & Rahman, M. A. (2024). First-Principles Investigation of Electronic Band Alignments in MoS2/Perovskite Interfaces. Physical Review B, Submitted & Under Peer Review.',
          status: 'Under Review'
        }
      ],
      research: [
        {
          projectTitle: 'Graduate Research Assistant — Nanomaterials Energy Laboratory',
          role: 'Lead Graduate Researcher (PI: Prof. Dr. M. A. Rahman)',
          institution: 'BUET Department of Materials Science',
          period: 'March 2022 – Present',
          methodology: 'Fabricated solution-processed perovskite thin films in nitrogen glovebox; characterized film morphology via Field-Emission Scanning Electron Microscopy (FESEM), X-Ray Diffraction (XRD), and steady-state photoluminescence (PL).',
          outcomes: [
            'Increased solar cell power conversion efficiency (PCE) from 16.2% to 19.8% with 85% stability retention after 1,000 hours in 60% relative humidity.',
            'Managed lab safety protocols and calibrated solar simulator instrumentation for 8 master’s and undergraduate student researchers.'
          ]
        }
      ],
      skills: [
        { category: 'Characterization & Cleanroom Instrumentation', items: ['XRD (Rigaku SmartLab)', 'FESEM (JEOL)', 'UV-Vis-NIR Spectrophotometer', 'Solar Simulator (Oriel Class AAA)', 'Spin Coater', 'Thermal Evaporator'] },
        { category: 'Computational & DFT Modeling', items: ['Quantum ESPRESSO', 'VASP (Basics)', 'OriginPro 2024', 'Python for Scientific Computing'] }
      ]
    }
  },
  {
    slug: 'early-career-research-applicant',
    title: 'Early-Career Research Assistant / Research Fellow CV',
    titleBn: 'প্রারম্ভিক গবেষক বা রিসার্চ অ্যাসিস্ট্যান্ট পদের আন্তর্জাতিক সিভি',
    targetAudience: 'International Research Institutes (Max Planck, CNRS, RIKEN), University Research Labs, and Postdoctoral Units',
    field: 'Genomics, Bioinformatics & Computational Biology',
    careerStage: 'Master’s Graduate seeking Research Officer / Lab Assistant Roles',
    isIllustrative: true,
    rationaleEn: 'Early-career researchers must demonstrate immediate laboratory and computational independence: proficiency in high-throughput sequencing pipelines, statistical genomics, data reproducibility, lab notebooks, and adherence to laboratory ethics.',
    rationaleBn: 'গবেষক পদের সিভিতে জিনোমিক্স ও বায়োইনফরমেটিক্স পাইপলাইন, ল্যাবরেটরি টুলস, তথ্য বিশ্লেষণ ও ল্যাব কোলাবোরেশনের অভিজ্ঞতা সুনির্দিষ্টভাবে দেখাতে হয়।',
    sectionBreakdown: [
      { sectionName: 'Header', order: 1, purpose: 'Contact details, GitHub, and academic publications profile.' },
      { sectionName: 'Research Summary', order: 2, purpose: 'Overview of computational biology and molecular genomics proficiencies.' },
      { sectionName: 'Education', order: 3, purpose: 'MSc in Bioinformatics / Biotechnology, BSc in Genetic Engineering.' },
      { sectionName: 'Core Research Methodologies & Pipelines', order: 4, purpose: 'NGS pipelines, RNA-Seq analysis, variant calling, Linux cluster experience.' },
      { sectionName: 'Research Appointments', order: 5, purpose: 'Previous laboratory and research positions detailing technical workflows.' },
      { sectionName: 'Publications & Scientific Manuscripts', order: 6, purpose: 'Refereed articles and open-source data repositories.' },
      { sectionName: 'Technical Skills & Certifications', order: 7, purpose: 'Bash, Python, R (Bioconductor), Docker, and scientific computing packages.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Farzana Yasmin, MSc [Illustrative Model]',
        email: 'farzana.yasmin.research.example@borno.org',
        phone: '+880 1766-000010 (Fictional)',
        location: 'Dhaka, Bangladesh',
        linkedin: 'linkedin.com/in/illustrative-farzana',
        github: 'github.com/illustrative-farzana'
      },
      summary: 'Bioinformatics and computational genomics researcher with 2 years of experience analyzing Next-Generation Sequencing (NGS) data, differential gene expression (RNA-Seq), and antimicrobial resistance (AMR) mutation profiles on Linux high-performance clusters.',
      education: [
        {
          institution: 'University of Dhaka',
          degree: 'Master of Science in Genetic Engineering and Biotechnology (GEB)',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'July 2024',
          grade: 'CGPA 3.88 / 4.00 (First Class 2nd Position)',
          honors: 'Thesis: "Whole-Genome Sequencing and Phylogenetic Characterization of Multi-Drug Resistant Klebsiella pneumoniae Strains in Tertiary Hospitals"'
        },
        {
          institution: 'University of Dhaka',
          degree: 'Bachelor of Science in Genetic Engineering and Biotechnology',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'November 2022',
          grade: 'CGPA 3.82 / 4.00'
        }
      ],
      skills: [
        { category: 'Bioinformatics Pipelines', items: ['RNA-Seq (FastQC, STAR, DESeq2)', 'Variant Calling (GATK, BWA, SAMtools)', 'Phylogenomics (MEGA, IQ-TREE)', 'Metagenomics (QIIME 2)'] },
        { category: 'Computational & Scripting', items: ['Linux / Bash Scripting', 'Python (BioPython, Pandas)', 'R (Bioconductor, ggplot2)', 'Git / GitHub', 'HPC Slurm Workflows'] }
      ],
      research: [
        {
          projectTitle: 'Research Associate — Genomic Surveillance of Enteric Pathogens',
          role: 'Full-Time Research Officer',
          institution: 'International Centre for Diarrhoeal Disease Research, Bangladesh (icddr,b)',
          period: 'September 2024 – Present',
          methodology: 'Processed Illumina NovaSeq paired-end whole-genome sequence data from 350 clinical isolates; performed de novo assembly using SPAdes and annotated resistance determinants via CARD and ResFinder databases.',
          outcomes: [
            'Identified novel plasmid-mediated colistin resistance (mcr-1) gene variants in pediatric inpatient samples.',
            'Co-authored 1 peer-reviewed research paper in Frontiers in Cellular and Infection Microbiology.'
          ]
        }
      ]
    }
  },
  {
    slug: 'internship-and-project-experience',
    title: 'Applicant with Extensive Internships & Commercial Projects',
    titleBn: 'ইন্টার্নশিপ ও বাণিজ্যিক প্রকল্পভিত্তিক প্রফেশনাল রেজ্যিউমে',
    targetAudience: 'Global Technology Companies, High-Growth Startups, and Fast-Track Graduate Schemes',
    field: 'Full-Stack Web Development & Cloud Systems',
    careerStage: 'Early Career Professional / Recent Graduate',
    isIllustrative: true,
    rationaleEn: 'When an applicant has multiple completed internships and live client products, the CV shifts focus onto real-world customer deliverables, agile workflows, production deployments, and team collaboration across engineering teams.',
    rationaleBn: 'বাণিজ্যিক প্রকল্প ও ইন্টার্নশিপ থাকলে সিভিতে লাইভ ইউজার ট্রাফিক, ক্লাউড ডিপ্লয়মেন্ট, এজাইল টিমওয়ার্ক এবং প্রাতিষ্ঠানিক অর্জনের বাস্তব তথ্য তুলে ধরতে হয়।',
    sectionBreakdown: [
      { sectionName: 'Header', order: 1, purpose: 'Contact details, GitHub, LinkedIn, and personal portfolio with live project demos.' },
      { sectionName: 'Summary of Capabilities', order: 2, purpose: '3-line summary emphasizing product velocity and production engineering.' },
      { sectionName: 'Professional & Internship Experience', order: 3, purpose: 'Detailed roles at commercial software agencies and startup products.' },
      { sectionName: 'Commercial & Open Source Projects', order: 4, purpose: 'Production web apps with live URLs and user count metrics.' },
      { sectionName: 'Education', order: 5, purpose: 'BSc in Information Technology / Software Engineering.' },
      { sectionName: 'Technical Skills Matrix', order: 6, purpose: 'Full-stack framework and DevOps skills.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Shafiqul Islam [Illustrative Model]',
        email: 'shafiq.islam.dev.example@borno.org',
        phone: '+880 1777-000011 (Fictional)',
        location: 'Dhaka, Bangladesh',
        linkedin: 'linkedin.com/in/illustrative-shafiq',
        github: 'github.com/illustrative-shafiq',
        portfolio: 'shafiq-works.example.com'
      },
      summary: 'Full-stack software engineer with 2 completed commercial internships and 4 production web applications deployed to AWS. Skilled in React, Next.js, TypeScript, PostgreSQL, and containerized Docker CI/CD pipelines.',
      experience: [
        {
          role: 'Full-Stack Software Engineering Intern',
          organization: 'Brain Station 23 (Fictional Commercial Model)',
          location: 'Dhaka, Bangladesh',
          period: 'January 2024 – June 2024',
          bullets: [
            'Built responsive client portal using React and Tailwind CSS for a Scandinavian telecommunications client serving 80,000 monthly active users.',
            'Refactored legacy REST microservices to GraphQL, reducing average network payload sizes across mobile clients by 38%.',
            'Collaborated in daily 2-week Agile sprints with distributed engineering teams based in Oslo and Dhaka.'
          ]
        },
        {
          role: 'Frontend Engineering Intern',
          organization: 'Kite Games Studio (Fictional Mobile Tech Unit)',
          location: 'Dhaka, Bangladesh',
          period: 'June 2023 – November 2023',
          bullets: [
            'Developed in-app analytical event tracking dashboard using Next.js and Chart.js monitoring game retention across 2M downloads.',
            'Improved web vitals Core Web Vitals score from 68 to 94 through code splitting, dynamic imports, and WebP image optimizations.'
          ]
        }
      ],
      projects: [
        {
          title: 'Borno Higher Study Interactive Admissions Assistant',
          technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Vite'],
          description: 'High-performance interactive web application delivering tuition calculators, visa guides, and requirement matrices for Bangladeshi students.',
          bullets: [
            'Implemented custom GSAP timelines with ScrollTrigger for silky editorial reveals without layout thrashing.',
            'Ensured full bilingual internationalization supporting English and Bengali with WCAG AAA contrast accessibility.'
          ]
        }
      ],
      education: [
        {
          institution: 'United International University (UIU)',
          degree: 'Bachelor of Science in Computer Science and Engineering',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'December 2024',
          grade: 'CGPA 3.74 / 4.00'
        }
      ],
      skills: [
        { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'GSAP'] },
        { category: 'Backend & Cloud', items: ['Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'Docker', 'AWS (EC2, S3, RDS)'] }
      ]
    }
  },
  {
    slug: 'volunteering-and-leadership-experience',
    title: 'Applicant with Strong Volunteering, Advocacy & Leadership Background',
    titleBn: 'সামাজিক নেতৃত্ব, যুব কূটনীতি ও ভলান্টিয়ারিংভিত্তিক সিভিস্যাম্পল',
    targetAudience: 'Global NGOs, United Nations Youth Fellowships, Social Enterprise Grants, and Development Master’s Programs',
    field: 'International Relations, Public Policy & Social Work',
    careerStage: 'Graduating Senior / Social Impact Leader',
    isIllustrative: true,
    rationaleEn: 'When the applicant’s core strength is social entrepreneurship, Model UN, or community advocacy, the CV highlights fundraising totals, community reach, volunteer management, policy dialogue, and international youth delegation roles.',
    rationaleBn: 'সামাজিক উদ্যোগ, যুব কূটনীতি ও সমাজসেবায় অভিজ্ঞ প্রার্থীর সিভিতে ফান্ডরেইজিং, কমিউনিটি প্রকল্প, আন্তর্জাতিক সম্মেলন ও স্বেচ্ছাসেবক পরিচালনার বাস্তব পরিসংখ্যান তুলে ধরতে হয়।',
    sectionBreakdown: [
      { sectionName: 'Header', order: 1, purpose: 'Contact details, LinkedIn, and links to public advocacy reports.' },
      { sectionName: 'Leadership & Social Impact Profile', order: 2, purpose: 'Statement of civic commitment and public policy experience.' },
      { sectionName: 'Civic Leadership & Non-Profit Involvements', order: 3, purpose: 'Substantive leadership roles with quantifiable community outreach numbers.' },
      { sectionName: 'Youth Diplomacy & Model United Nations', order: 4, purpose: 'International diplomatic conferences and award-winning debate delegations.' },
      { sectionName: 'Higher Education', order: 5, purpose: 'BSS in International Relations / Public Administration, CGPA, honors.' },
      { sectionName: 'Grants, Fellowships & Recognition', order: 6, purpose: 'External funding, youth delegate credentials, and civic awards.' },
      { sectionName: 'Languages & Facilitation Competencies', order: 7, purpose: 'Public speaking, workshop facilitation, and multi-language fluency.' }
    ],
    fullContent: {
      personalInfo: {
        fullName: 'Rubayet Hasan [Illustrative Model]',
        email: 'rubayet.hasan.lead.example@borno.org',
        phone: '+880 1788-000012 (Fictional)',
        location: 'Dhaka, Bangladesh',
        linkedin: 'linkedin.com/in/illustrative-rubayet'
      },
      summary: 'Civic innovator and youth delegate with 4 years of non-profit leadership experience in youth literacy and flood relief logistics. Raised over BDT 1,200,000 in philanthropic aid and represented Bangladesh at 3 international youth diplomacy forums.',
      volunteering: [
        {
          role: 'Executive Director & Co-Founder',
          organization: 'Alo Shikkha Foundation (Student Non-Profit)',
          period: 'September 2022 – Present',
          impact: 'Lead 65 active volunteer educators operating 3 weekend learning centers in Kurigram and Sunamganj; provided foundational literacy and hygiene kits to over 1,400 underprivileged children; raised BDT 850,000 in crowdsourced emergency relief during the 2024 Sylhet-Feni floods.'
        },
        {
          role: 'Secretary General',
          organization: 'Dhaka University Model United Nations Association (DUMUNA)',
          period: 'June 2023 – July 2024',
          impact: 'Directed international conference hosting 450 national and foreign delegates across 8 simulated UN committees; oversaw BDT 1.5M budget, corporate sponsorships, and diplomatic embassy partnerships.'
        }
      ],
      education: [
        {
          institution: 'Department of International Relations, University of Dhaka',
          degree: 'Bachelor of Social Sciences (BSS) in International Relations',
          location: 'Dhaka, Bangladesh',
          graduationDate: 'November 2024',
          grade: 'CGPA 3.78 / 4.00 (First Class)',
          coursework: ['Foreign Policy Analysis', 'International Law & Human Rights', 'Global Governance & International Organizations', 'Conflict Resolution & Peace Studies']
        }
      ],
      awards: [
        { title: 'Best Delegate Award (UN Human Rights Council)', issuer: 'Harvard National Model United Nations (HNMUN Asia)', year: '2023' },
        { title: 'National Youth Volunteer of the Year Recognition', issuer: 'Department of Youth Development, Bangladesh', year: '2024' }
      ],
      skills: [
        { category: 'Advocacy & Facilitation', items: ['Grant Writing & Philanthropic Fundraising', 'Stakeholder & Embassy Relations', 'Crisis Response Logistics', 'Public Speaking'] },
        { category: 'Languages', items: ['Bengali (Native)', 'English (Bilingual / C2, IELTS: 8.0)', 'Urdu (Conversational)'] }
      ]
    }
  }
];

export const TOTAL_EXAMPLE_CVS = CAREER_EXAMPLE_CVS.length;
