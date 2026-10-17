import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Check,
  Eye,
  Sliders,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { saveCVDraft, getUserCVDrafts } from '../services/api';

type TemplateType = 'academic-editorial' | 'europass-standard' | 'modern-minimal' | 'tech-compact';

interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  graduationDate: string;
  grade: string;
  coursework: string;
}

interface ExperienceItem {
  role: string;
  organization: string;
  location: string;
  period: string;
  bullets: string;
}

interface ProjectItem {
  title: string;
  technologies: string;
  description: string;
  bullets: string;
}

interface PublicationItem {
  citation: string;
  status: string;
}

interface AwardItem {
  title: string;
  issuer: string;
  year: string;
}

interface VolunteeringItem {
  role: string;
  organization: string;
  period: string;
  impact: string;
}

interface LanguageItem {
  language: string;
  proficiency: string;
}

export const CVBuilderPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const previewRef = useRef<HTMLDivElement>(null);

  // Template selector
  const [template, setTemplate] = useState<TemplateType>('academic-editorial');
  const [draftTitle, setDraftTitle] = useState('My Academic CV');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Personal Info
  const [fullName, setFullName] = useState('Tahmidur Rahman');
  const [email, setEmail] = useState('tahmid.rahman@buet.ac.bd');
  const [phone, setPhone] = useState('+880 1711-234567');
  const [location, setLocation] = useState('Dhaka, Bangladesh');
  const [linkedin, setLinkedin] = useState('linkedin.com/in/tahmid-rahman');
  const [github, setGithub] = useState('github.com/tahmid-rahman');
  const [portfolio, setPortfolio] = useState('');
  const [summary, setSummary] = useState(
    'Final-year Computer Science undergraduate with research experience in distributed systems, graph neural networks, and event-driven architectures. Proven software engineering acumen through commercial internships and open-source contributions.'
  );

  // Dynamic Lists
  const [educationList, setEducationList] = useState<EducationItem[]>([
    {
      institution: 'Bangladesh University of Engineering and Technology (BUET)',
      degree: 'Bachelor of Science in Computer Science and Engineering',
      location: 'Dhaka, Bangladesh',
      graduationDate: 'October 2025',
      grade: 'CGPA 3.86 / 4.00 (Dean’s Honor List)',
      coursework: 'Algorithms, Distributed Systems, Operating Systems, Computer Networks'
    }
  ]);

  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([
    {
      role: 'Software Engineering Intern',
      organization: 'Apex Solutions Ltd.',
      location: 'Dhaka, Bangladesh',
      period: 'June 2024 – December 2024',
      bullets:
        'Architected high-throughput backend services in Go, cutting median API latency by 45%.\nOptimized 12 complex PostgreSQL queries, expanding database throughput to 1,500 req/sec.\nAuthored comprehensive unit and integration test suites using Jest, achieving 88% code coverage.'
    }
  ]);

  const [projectList, setProjectList] = useState<ProjectItem[]>([
    {
      title: 'Distributed University Admissions Notification Service',
      technologies: 'Go, Apache Kafka, Redis, PostgreSQL, Docker',
      description: 'Event-driven message pipeline processing 10,000 notifications per second.',
      bullets:
        'Partitioned Kafka message queues for asynchronous delivery to 50,000 concurrent applicants.\nConstructed Redis multi-tier caching layer reducing database read loads by 74%.'
    }
  ]);

  const [skillsText, setSkillsText] = useState(
    'Languages: Go, TypeScript, Python, C++, SQL\nFrameworks: React, Next.js, Node.js, Gin-Gonic, PyTorch\nTools & Cloud: Docker, Kubernetes, Git, AWS (EC2, S3), Redis, PostgreSQL'
  );

  const [publicationList, setPublicationList] = useState<PublicationItem[]>([
    {
      citation:
        'Rahman, T., Hossain, M., & Karim, S. (2024). High-Throughput Event Streaming for Educational Portals. IEEE ICCIT Proceedings.',
      status: 'Published'
    }
  ]);

  const [awardList, setAwardList] = useState<AwardItem[]>([
    {
      title: 'Top 5 Finalist — National University Hackathon',
      issuer: 'ICT Division Bangladesh',
      year: '2024'
    }
  ]);

  const [volunteeringList, setVolunteeringList] = useState<VolunteeringItem[]>([
    {
      role: 'Peer Programming Mentor',
      organization: 'BUET CSE Student Society',
      period: '2023 – 2024',
      impact: 'Conducted weekly data structures tutorials for 40 first-year undergraduate students.'
    }
  ]);

  const [languageList, setLanguageList] = useState<LanguageItem[]>([
    { language: 'Bengali', proficiency: 'Native Speaker' },
    { language: 'English', proficiency: 'C1 Proficient (IELTS Overall: 8.0)' }
  ]);

  // Load any prefilled CV model from CVExamplesPage
  useEffect(() => {
    const prefill = localStorage.getItem('borno_prefill_cv');
    if (prefill) {
      try {
        const data = JSON.parse(prefill);
        if (data.personalInfo) {
          setFullName(data.personalInfo.fullName || '');
          setEmail(data.personalInfo.email || '');
          setPhone(data.personalInfo.phone || '');
          setLocation(data.personalInfo.location || '');
          setLinkedin(data.personalInfo.linkedin || '');
          setGithub(data.personalInfo.github || '');
        }
        if (data.summary) setSummary(data.summary);
        if (data.education && data.education.length > 0) {
          setEducationList(
            data.education.map((e: any) => ({
              institution: e.institution || '',
              degree: e.degree || '',
              location: e.location || '',
              graduationDate: e.graduationDate || '',
              grade: e.grade || '',
              coursework: Array.isArray(e.coursework) ? e.coursework.join(', ') : e.coursework || ''
            }))
          );
        }
        if (data.experience && data.experience.length > 0) {
          setExperienceList(
            data.experience.map((exp: any) => ({
              role: exp.role || '',
              organization: exp.organization || '',
              location: exp.location || '',
              period: exp.period || '',
              bullets: Array.isArray(exp.bullets) ? exp.bullets.join('\n') : exp.bullets || ''
            }))
          );
        }
        localStorage.removeItem('borno_prefill_cv');
      } catch (e) {
        console.warn('Failed to parse prefill CV:', e);
      }
    }
  }, []);

  // Save Draft
  const handleSaveDraft = async () => {
    const payload = {
      title: draftTitle,
      template,
      personalInfo: { fullName, email, phone, location, linkedin, github, portfolio },
      summary,
      education: educationList,
      experience: experienceList,
      projects: projectList,
      skills: skillsText,
      publications: publicationList,
      awards: awardList,
      volunteering: volunteeringList,
      languages: languageList
    };

    try {
      localStorage.setItem('borno_saved_cv_draft', JSON.stringify(payload));
      await saveCVDraft(payload);
      setSaveStatus(isBn ? 'সংরক্ষিত!' : 'Draft Saved!');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (e) {
      // Local fallback
      setSaveStatus(isBn ? 'লোকালি সংরক্ষিত!' : 'Locally Saved!');
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  // Export to PDF via Browser Print Window
  const handlePrint = () => {
    window.print();
  };

  // Add / Remove Helper Functions
  const addEducation = () => {
    setEducationList([
      ...educationList,
      { institution: '', degree: '', location: '', graduationDate: '', grade: '', coursework: '' }
    ]);
  };
  const removeEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperienceList([
      ...experienceList,
      { role: '', organization: '', location: '', period: '', bullets: '' }
    ]);
  };
  const removeExperience = (index: number) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjectList([
      ...projectList,
      { title: '', technologies: '', description: '', bullets: '' }
    ]);
  };
  const removeProject = (index: number) => {
    setProjectList(projectList.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#F4F4F2] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 pb-20">
      
      {/* Top Application Bar */}
      <div className="bg-[#0B192C] text-white py-4 px-4 sm:px-8 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="bg-transparent font-bold text-sm sm:text-base text-white focus:outline-none focus:border-b border-teal-400"
              />
              <div className="text-[11px] text-slate-400">
                {isBn ? 'লাইভ প্রিভিউ ও এক্সপোর্ট স্টুডিও' : 'Live Preview & Formatting Studio'}
              </div>
            </div>
          </div>

          {/* Template Selector Bar */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setTemplate('academic-editorial')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                  template === 'academic-editorial'
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Academic Editorial
              </button>
              <button
                onClick={() => setTemplate('europass-standard')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                  template === 'europass-standard'
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Europass Style
              </button>
              <button
                onClick={() => setTemplate('modern-minimal')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                  template === 'modern-minimal'
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Modern Minimal
              </button>
              <button
                onClick={() => setTemplate('tech-compact')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                  template === 'tech-compact'
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Tech Compact
              </button>
            </div>

            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-teal-400" />
              <span>{saveStatus || (isBn ? 'ড্রাফট সেভ' : 'Save')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBn ? 'পিডিএফ প্রিন্ট' : 'Export / Print PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Editor & Preview Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Editor (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Card 1: Personal & Contact */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                <span>Personal & Contact Information</span>
                <span className="text-[11px] text-teal-600 font-normal">Header Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">Email Address</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">Phone (+880...)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">City & Country</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">LinkedIn URL</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">GitHub / Portfolio URL</label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500">Profile / Academic Summary</label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Card 2: Education */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Education & Degrees</h3>
                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {educationList.map((edu, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2 relative">
                  {educationList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const next = [...educationList];
                          next[idx].institution = e.target.value;
                          setEducationList(next);
                        }}
                        className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500">Degree & Major</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const next = [...educationList];
                          next[idx].degree = e.target.value;
                          setEducationList(next);
                        }}
                        className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500">CGPA / Grade</label>
                      <input
                        type="text"
                        value={edu.grade}
                        onChange={(e) => {
                          const next = [...educationList];
                          next[idx].grade = e.target.value;
                          setEducationList(next);
                        }}
                        className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500">Graduation Month/Year</label>
                      <input
                        type="text"
                        value={edu.graduationDate}
                        onChange={(e) => {
                          const next = [...educationList];
                          next[idx].graduationDate = e.target.value;
                          setEducationList(next);
                        }}
                        className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Card 3: Experience */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Experience & Internships</h3>
                <button
                  type="button"
                  onClick={addExperience}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              {experienceList.map((exp, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2 relative">
                  {experienceList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500">Job Title / Role</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const next = [...experienceList];
                          next[idx].role = e.target.value;
                          setExperienceList(next);
                        }}
                        className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500">Organization</label>
                      <input
                        type="text"
                        value={exp.organization}
                        onChange={(e) => {
                          const next = [...experienceList];
                          next[idx].organization = e.target.value;
                          setExperienceList(next);
                        }}
                        className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">Key Contributions (One per line)</label>
                    <textarea
                      rows={3}
                      value={exp.bullets}
                      onChange={(e) => {
                        const next = [...experienceList];
                        next[idx].bullets = e.target.value;
                        setExperienceList(next);
                      }}
                      className="w-full p-2 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Card 4: Projects */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Academic & Software Projects</h3>
                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {projectList.map((prj, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2 relative">
                  {projectList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500">Project Title</label>
                      <input
                        type="text"
                        value={prj.title}
                        onChange={(e) => {
                          const next = [...projectList];
                          next[idx].title = e.target.value;
                          setProjectList(next);
                        }}
                        className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500">Tech Stack / Tools</label>
                      <input
                        type="text"
                        value={prj.technologies}
                        onChange={(e) => {
                          const next = [...projectList];
                          next[idx].technologies = e.target.value;
                          setProjectList(next);
                        }}
                        className="w-full px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">Bullets / Details</label>
                    <textarea
                      rows={2}
                      value={prj.bullets}
                      onChange={(e) => {
                        const next = [...projectList];
                        next[idx].bullets = e.target.value;
                        setProjectList(next);
                      }}
                      className="w-full p-2 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Card 5: Skills */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Technical & Tool Proficiencies</h3>
              <textarea
                rows={3}
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="Languages: Python, Go, C++&#10;Tools: Docker, Git, Linux&#10;Databases: PostgreSQL, Redis"
                className="w-full p-2.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Right Column: Live Printable Sheet (6 Cols) */}
          <div className="lg:col-span-6 sticky top-20">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-teal-600" />
                Live Document Preview ({template.replace('-', ' ').toUpperCase()})
              </span>
              <span className="text-[11px] text-slate-400">
                A4 Standard Canvas (100% Scale)
              </span>
            </div>

            {/* Printable Document Sheet */}
            <div
              id="cv-printable-area"
              ref={previewRef}
              className={`bg-white text-slate-900 p-4 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200/90 min-h-[780px] max-h-[820px] overflow-y-auto print:m-0 print:p-0 print:border-none print:shadow-none print:overflow-visible ${
                template === 'academic-editorial'
                  ? 'font-serif'
                  : template === 'tech-compact'
                  ? 'font-mono text-[11px]'
                  : 'font-sans'
              }`}
            >
              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-4 mb-5">
                <h1 className="text-2xl font-bold tracking-tight uppercase text-slate-950">
                  {fullName}
                </h1>
                <div className="mt-1.5 text-xs text-slate-600 flex flex-wrap gap-2">
                  <span>{location}</span>
                  <span>•</span>
                  <span>{email}</span>
                  <span>•</span>
                  <span>{phone}</span>
                  {github && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-teal-700">{github}</span>
                    </>
                  )}
                  {linkedin && (
                    <>
                      <span>•</span>
                      <span className="text-slate-700">{linkedin}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Document Summary */}
              {summary && (
                <div className="mb-5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Profile Summary
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">{summary}</p>
                </div>
              )}

              {/* Document Education */}
              {educationList.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Education
                  </h2>
                  <div className="space-y-2.5 font-sans">
                    {educationList.map((edu, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-950">{edu.institution}</div>
                          <div className="italic text-slate-800">{edu.degree}</div>
                          {edu.grade && <div className="text-slate-700">{edu.grade}</div>}
                          {edu.coursework && (
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              Coursework: {edu.coursework}
                            </div>
                          )}
                        </div>
                        <div className="text-right text-slate-600 font-mono text-[11px]">
                          <div>{edu.graduationDate}</div>
                          <div>{edu.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Skills */}
              {skillsText && (
                <div className="mb-5 font-sans">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Technical & Analytical Competencies
                  </h2>
                  <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {skillsText}
                  </div>
                </div>
              )}

              {/* Document Experience */}
              {experienceList.length > 0 && (
                <div className="mb-5 font-sans">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Professional Experience
                  </h2>
                  <div className="space-y-3">
                    {experienceList.map((exp, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-950">
                          <span>{exp.role} — {exp.organization}</span>
                          <span className="font-mono text-slate-600 text-[11px]">{exp.period}</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                          {exp.bullets.split('\n').filter(Boolean).map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Projects */}
              {projectList.length > 0 && (
                <div className="mb-5 font-sans">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Key Projects
                  </h2>
                  <div className="space-y-3">
                    {projectList.map((prj, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-950">
                          <span>{prj.title}</span>
                          {prj.technologies && (
                            <span className="text-[10px] text-teal-800 font-mono">[{prj.technologies}]</span>
                          )}
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                          {prj.bullets.split('\n').filter(Boolean).map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Languages */}
              {languageList.length > 0 && (
                <div className="font-sans">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Languages
                  </h2>
                  <div className="text-xs text-slate-700">
                    {languageList.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
