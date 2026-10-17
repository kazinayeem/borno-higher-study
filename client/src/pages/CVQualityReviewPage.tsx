import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  FileText,
  Target
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageIntro } from '../components/motion/index';
import { runCVQualityReview } from '../services/api';
import { CVQualityReport } from '../types/index';

export const CVQualityReviewPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [targetOpportunity, setTargetOpportunity] = useState('MASTERS_ADMISSION');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [github, setGithub] = useState('');
  const [educationText, setEducationText] = useState('');
  const [experienceText, setExperienceText] = useState('');
  const [projectsText, setProjectsText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CVQualityReport | null>(null);

  // Quick preset loading for immediate testing
  const loadDemoData = (type: 'WEAK' | 'STRONG') => {
    if (type === 'WEAK') {
      setFullName('Rafiqul Islam');
      setEmail('rafiq123@gmail.com');
      setPhone('01700000000'); // Missing +880
      setLocation(''); // Missing
      setGithub('');
      setEducationText('BSc in CSE from a private university. Passed in 2024.'); // Missing GPA
      setExperienceText('Worked on website using React. Helped professor with some data. Responsible for social media posting.'); // Passive phrasing
      setProjectsText('Made an e-commerce website with HTML and CSS.'); // Missing tech stack & metrics
      setSkillsText('Skills: Hardworking, passionate, punctual, team player, MS Office, programming.'); // Clichés
    } else {
      setFullName('Tahmidur Rahman');
      setEmail('tahmid.rahman@buet.ac.bd');
      setPhone('+880 1711-234567');
      setLocation('Dhaka, Bangladesh');
      setGithub('github.com/tahmid-dev');
      setEducationText('Bachelor of Science in Computer Science and Engineering, BUET (CGPA 3.84 / 4.00, Graduation: October 2025). Coursework: Algorithms, Distributed Systems, Operating Systems.');
      setExperienceText('Software Engineering Intern at Apex Solutions (June 2024 – Dec 2024). Architected backend microservices in Go, reducing latency by 45%. Optimized PostgreSQL queries across 50,000 daily user requests.');
      setProjectsText('Developed real-time admissions notification system in Go, Redis, and Kafka processing 10,000 events/sec.');
      setSkillsText('Languages: Go, TypeScript, Python, C++ | Databases: PostgreSQL, Redis | DevOps: Docker, Git, CI/CD.');
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cvData = {
        personalInfo: {
          fullName,
          email,
          phone,
          location,
          github: github || undefined
        },
        education: educationText
          ? [
              {
                degree: educationText,
                institution: 'Stated Institution',
                grade: educationText.includes('CGPA') || educationText.includes('GPA') ? 'Detected' : undefined,
                graduationDate: educationText.match(/\b20\d\d\b/) ? 'Detected' : undefined
              }
            ]
          : [],
        experience: experienceText
          ? [
              {
                role: 'Stated Experience',
                organization: 'Organization',
                bullets: [experienceText]
              }
            ]
          : [],
        projects: projectsText
          ? [
              {
                title: 'Stated Project',
                description: projectsText,
                bullets: [projectsText]
              }
            ]
          : [],
        skills: skillsText
          ? [
              {
                category: 'General',
                items: [skillsText]
              }
            ]
          : []
      };

      const result = await runCVQualityReview(cvData, targetOpportunity);
      setReport(result);
    } catch (err) {
      console.error('Failed to run review:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#080E1A] text-slate-900 dark:text-slate-100 pb-24 transition-colors">
      {/* Header */}
      <div className="bg-[#0B192C] dark:bg-[#070D18] text-white pt-14 pb-16 border-b border-slate-800">
        <PageIntro className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-teal-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <Zap className="w-4 h-4 text-teal-400" />
            {isBn ? 'রুল-বেসড কোয়ালিটি অডিটর' : 'Deterministic Rule-Based CV Auditor'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-white tracking-tight mb-3">
            {isBn ? 'সিভি কোয়ালিটি ও ফিডব্যাক চেকার' : 'CV Quality, Phrasing & Opportunity Auditor'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {isBn
              ? 'আপনার সিভির টেক্সট যাচাই করুন। আমাদের রুল-বেসড অডিটর মিসিং কন্টাক্ট তথ্য, প্যাসিভ ভার্ব, খালি প্রশংসা এবং লক্ষ্যভিত্তিক সুযোগের অসামঞ্জস্যতা তাৎক্ষণিকভাবে শনাক্ত করবে।'
              : 'Audit your draft for missing contact info, vague verbs, clichéd adjectives, and target alignment without altering your underlying factual claims.'}
          </p>

          <div className="mt-4 p-3 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              {isBn
                ? 'বিজ্ঞপ্তি: এই টুলটি কোনো চাকরির নিশ্চয়তা বা এটিএস পাসের গ্যারান্টি দেয় না। এটি তথ্যের উপস্থাপনাকে উন্নত করার শিক্ষণীয় সহায়িকা।'
                : 'Notice: This rule-based auditor does not guarantee admission or job offers. Suggestions must be verified for factual truthfulness.'}
            </span>
          </div>
        </PageIntro>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 space-y-8">
        
        {/* Input Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isBn ? '১. আবেদনের সুযোগ ও লক্ষ্য নির্বাচন করুন' : '1. Target Opportunity & Academic Focus'}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadDemoData('WEAK')}
                className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-900"
              >
                {isBn ? 'দুর্বল ড্রাফট ডেমো' : 'Load Weak Draft'}
              </button>
              <button
                type="button"
                onClick={() => loadDemoData('STRONG')}
                className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-900"
              >
                {isBn ? 'শক্তিশালী ড্রাফট ডেমো' : 'Load Strong Draft'}
              </button>
            </div>
          </div>

          <form onSubmit={handleReview} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isBn ? 'লক্ষ্যভিত্তিক উচ্চশিক্ষা ক্ষেত্র:' : 'Target Application Objective:'}
              </label>
              <select
                value={targetOpportunity}
                onChange={(e) => setTargetOpportunity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="MASTERS_ADMISSION">Master’s Degree Admission (MSc / MIM / MA)</option>
                <option value="PHD_ADMISSION">Doctoral Admissions (PhD / DPhil / Research Groups)</option>
                <option value="SCHOLARSHIP">Full International Scholarship (Erasmus / Commonwealth / DAAD)</option>
                <option value="TECH_INTERNSHIP">Software Engineering & Tech Internship</option>
                <option value="RESEARCH_ASSISTANTSHIP">University Research Assistantship (Lab Position)</option>
              </select>
            </div>

            {/* Header Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tahmidur Rahman"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Telephone (with Country Code)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +880 1711-234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  City & Country
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Bangladesh"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub / Portfolio URL (Recommended for STEM & Tech)
                </label>
                <input
                  type="text"
                  placeholder="e.g. github.com/username or linkedin.com/in/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Substantive Sections */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Education Record (Degrees, CGPA, Institutions, Dates)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Bachelor of Science in Computer Science, BUET (CGPA 3.84/4.00, Completed Oct 2024)..."
                  value={educationText}
                  onChange={(e) => setEducationText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Work / Internship Experience Bullets
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Software Intern at Apex Solutions. Built backend APIs using Node.js..."
                  value={experienceText}
                  onChange={(e) => setExperienceText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Projects / Research Theses
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Developed low-latency search engine using Go and Redis..."
                  value={projectsText}
                  onChange={(e) => setProjectsText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Technical, Analytical & Language Skills
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Languages: Python, Go, C++ | Tools: Docker, Git | Languages: Bengali (Native), English (IELTS: 7.5)"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{loading ? 'Auditing CV...' : 'Run Comprehensive Rule-Based Audit'}</span>
            </button>
          </form>
        </div>

        {/* Results Report Card */}
        {report && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Audit Verdict & Score
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <div
                    className={`text-4xl font-extrabold font-heading ${
                      report.score >= 85
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : report.score >= 70
                        ? 'text-teal-600 dark:text-teal-400'
                        : report.score >= 50
                        ? 'text-amber-500'
                        : 'text-rose-500'
                    }`}
                  >
                    {report.score} / 100
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                      report.rating === 'EXCELLENT'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : report.rating === 'STRONG'
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                        : report.rating === 'ADEQUATE'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {report.rating}
                  </span>
                </div>
              </div>

              {/* Metrics Summary Badge Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="font-bold text-slate-900 dark:text-white">{report.metrics.actionVerbCount}</div>
                  <div className="text-[10px] text-slate-500">Action Verbs</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="font-bold text-slate-900 dark:text-white">{report.metrics.metricsCount}</div>
                  <div className="text-[10px] text-slate-500">Metrics/Nums</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="font-bold text-slate-900 dark:text-white">{report.metrics.totalSectionsDetected}</div>
                  <div className="text-[10px] text-slate-500">Sections Found</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="font-bold text-slate-900 dark:text-white">{report.metrics.wordCount}</div>
                  <div className="text-[10px] text-slate-500">Words Total</div>
                </div>
              </div>
            </div>

            {/* Target Opportunity Notes */}
            {report.opportunityReadinessNotes.length > 0 && (
              <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40 text-xs">
                <div className="font-bold text-teal-900 dark:text-teal-200 mb-1 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Target Opportunity Alignment ({report.targetOpportunity.replace('_', ' ')})</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  {report.opportunityReadinessNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Categorized Findings */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Detected Observations & Recommended Actions ({report.findings.length})
              </h3>

              {report.findings.map((f) => (
                <div
                  key={f.id}
                  className={`p-4 rounded-xl border text-xs space-y-1 ${
                    f.type === 'CRITICAL'
                      ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                      : f.type === 'WARNING'
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                      : f.type === 'STRENGTH'
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {f.type === 'CRITICAL' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                      {f.type === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {f.type === 'STRENGTH' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      {f.type === 'SUGGESTION' && <Info className="w-4 h-4 text-teal-500" />}
                      <span>{f.title}</span>
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {f.category}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{f.description}</p>
                  {f.suggestedAction && (
                    <p className="font-semibold text-teal-700 dark:text-teal-300 pt-0.5">
                      💡 Suggested Action: {f.suggestedAction}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Next Steps Buttons */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/career-toolkit/cv-builder"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Fix and Format in CV Builder</span>
              </Link>
              <Link
                to="/career-toolkit/cv-checklist"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>Open Pre-Submission Checklist</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
