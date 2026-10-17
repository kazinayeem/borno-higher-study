import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageIntro, StaggerGroup } from '../components/motion/index';
import { getCVExamples } from '../services/api';
import { CVExampleItem } from '../types/index';

export const CVExamplesPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [examples, setExamples] = useState<CVExampleItem[]>([]);
  const [selectedExample, setSelectedExample] = useState<CVExampleItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterField, setFilterField] = useState('ALL');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'RATIONALE'>('CONTENT');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getCVExamples();
        setExamples(res.examples || []);
        if (res.examples && res.examples.length > 0) {
          setSelectedExample(res.examples[0]);
        }
      } catch (e) {
        console.error('Failed to load CV examples:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredExamples = examples.filter((ex) => {
    const matchesField = filterField === 'ALL' || ex.field.toLowerCase().includes(filterField.toLowerCase());
    const matchesSearch =
      !search ||
      ex.title.toLowerCase().includes(search.toLowerCase()) ||
      ex.field.toLowerCase().includes(search.toLowerCase()) ||
      ex.careerStage.toLowerCase().includes(search.toLowerCase());
    return matchesField && matchesSearch;
  });

  const handleCopyFormattedText = () => {
    if (!selectedExample) return;
    const jsonStr = JSON.stringify(selectedExample.fullContent, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadInBuilder = () => {
    if (!selectedExample) return;
    // Store in localStorage for the builder to pre-populate
    localStorage.setItem('borno_prefill_cv', JSON.stringify({
      title: `${selectedExample.title} (Draft)`,
      template: 'academic-editorial',
      personalInfo: selectedExample.fullContent.personalInfo,
      education: selectedExample.fullContent.education,
      experience: selectedExample.fullContent.experience || [],
      research: selectedExample.fullContent.research || [],
      projects: selectedExample.fullContent.projects || [],
      skills: selectedExample.fullContent.skills || [],
      publications: selectedExample.fullContent.publications || [],
      awards: selectedExample.fullContent.awards || [],
      volunteering: selectedExample.fullContent.volunteering || [],
      languages: selectedExample.fullContent.languages || []
    }));
    navigate('/career-toolkit/cv-builder');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#080E1A] text-slate-900 dark:text-slate-100 pb-24 transition-colors">
      {/* Header */}
      <div className="bg-[#0B192C] dark:bg-[#070D18] text-white pt-14 pb-16 border-b border-slate-800">
        <PageIntro className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-teal-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            {isBn ? '১২টি অরিজিনাল নির্দেশনামূলক সিভি' : '12 Original Illustrative CV Models'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-white tracking-tight mb-3">
            {isBn
              ? 'বাস্তবধর্মী সিভি উদাহরণ ও সেকশন কাঠামোর বিশ্লেষণ'
              : 'Annotated Sample CVs Across Fields & Academic Stages'}
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
            {isBn
              ? 'হাইস্কুল স্নাতক থেকে শুরু করে কম্পিউটার সায়েন্স, ইঞ্জিনিয়ারিং, লাইফ সায়েন্স, পিএইচডি ও ফুল-ফান্ডেড স্কলারশিপের জন্য ১২টি মৌলিক মডেল। প্রতিটি সেকশন কেন এই ক্রমে সাজানো হয়েছে তার যৌক্তিক ব্যাখ্যা নিচে দেওয়া হলো।'
              : 'Examine 12 original, clearly labelled illustrative models designed for international admissions. Each sample includes a rigorous explanation of why sections are arranged in their specific order.'}
          </p>

          {/* Legal Notice */}
          <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2 text-xs text-slate-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isBn
                ? 'আইনি ঘোষণা: সকল নাম, যোগাযোগ তথ্য ও অর্জন শিক্ষণীয় মডেল হিসেবে কাল্পনিক। কোনো কাল্পনিক তথ্যকে প্রকৃত অর্জন হিসেবে উপস্থাপন করা হয়নি।'
                : 'Educational Disclaimer: All names, contact details, and achievements are clearly labelled as illustrative models. Fictional examples are provided strictly for structural guidance.'}
            </span>
          </div>
        </PageIntro>
      </div>

      {/* Main Split Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Example Selector & Filters (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  {isBn ? 'ফিল্টার ও সার্চ' : 'Filters & Search'}
                </span>
                <span className="text-xs text-teal-600 dark:text-teal-400 font-bold">
                  {filteredExamples.length} {isBn ? 'টি স্যাম্পল' : 'Models'}
                </span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={isBn ? 'মডেল খুঁজুন...' : 'Search discipline or stage...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <select
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">{isBn ? 'সকল ডিসিপ্লিন' : 'All Disciplines'}</option>
                <option value="Computer Science">Computer Science & AI</option>
                <option value="Engineering">Mechanical / Electrical Engineering</option>
                <option value="Pharmacy">Pharmacy & Life Sciences</option>
                <option value="Business">Business & Management</option>
                <option value="Scholarship">Scholarship (Erasmus/Commonwealth)</option>
                <option value="Research">Early-Career Research & Labs</option>
              </select>
            </div>

            {/* List of 12 Models */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredExamples.map((ex, idx) => {
                const isSelected = selectedExample?.slug === ex.slug;
                return (
                  <button
                    key={ex.slug}
                    onClick={() => setSelectedExample(ex)}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 text-teal-950 dark:text-teal-100 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        #{idx + 1} • {ex.careerStage}
                      </span>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                    </div>
                    <span className="font-bold text-sm leading-snug text-slate-900 dark:text-white">
                      {isBn && ex.titleBn ? ex.titleBn : ex.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {ex.field}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Document Inspector (8 Cols) */}
          <div className="lg:col-span-8">
            {selectedExample ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
                
                {/* Document Top Bar */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                        ILLUSTRATIVE MODEL
                      </span>
                      <span className="text-xs text-slate-500">
                        Target: {selectedExample.targetAudience}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {isBn && selectedExample.titleBn ? selectedExample.titleBn : selectedExample.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyFormattedText}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                    <button
                      onClick={handleLoadInBuilder}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isBn ? 'এই ফরম্যাটে সিভি বানান' : 'Load into CV Builder'}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Tabs: Document Content vs Architectural Rationale */}
                <div className="px-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-6 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('CONTENT')}
                    className={`py-3 border-b-2 transition-colors ${
                      activeTab === 'CONTENT'
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {isBn ? 'সিভির পূর্ণাঙ্গ টেক্সট প্রিভিউ' : 'Full CV Document View'}
                  </button>
                  <button
                    onClick={() => setActiveTab('RATIONALE')}
                    className={`py-3 border-b-2 transition-colors ${
                      activeTab === 'RATIONALE'
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {isBn ? 'সেকশন কাঠামোর বিশ্লেষণ (কেন এই ক্রম?)' : 'Architectural Section Rationale'}
                  </button>
                </div>

                {/* Tab 1: Full Document Rendering */}
                {activeTab === 'CONTENT' && (
                  <div className="p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200 text-xs leading-relaxed max-h-[720px] overflow-y-auto font-sans">
                    {/* Header */}
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-4 text-center sm:text-left">
                      <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                        {selectedExample.fullContent.personalInfo.fullName}
                      </h1>
                      <div className="mt-1 text-slate-500 dark:text-slate-400 flex flex-wrap gap-2 justify-center sm:justify-start">
                        <span>{selectedExample.fullContent.personalInfo.location}</span>
                        <span>•</span>
                        <span>{selectedExample.fullContent.personalInfo.email}</span>
                        <span>•</span>
                        <span>{selectedExample.fullContent.personalInfo.phone}</span>
                        {selectedExample.fullContent.personalInfo.github && (
                          <>
                            <span>•</span>
                            <span className="text-teal-600 dark:text-teal-400 font-mono">
                              {selectedExample.fullContent.personalInfo.github}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {selectedExample.fullContent.summary && (
                      <div>
                        <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
                          Academic & Professional Profile
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300">
                          {selectedExample.fullContent.summary}
                        </p>
                      </div>
                    )}

                    {/* Education */}
                    <div>
                      <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
                        Education
                      </h3>
                      <div className="space-y-3">
                        {selectedExample.fullContent.education.map((edu, i) => (
                          <div key={i} className="flex flex-col sm:flex-row justify-between gap-1">
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{edu.institution}</div>
                              <div className="text-slate-700 dark:text-slate-300 italic">{edu.degree}</div>
                              {edu.grade && <div className="text-slate-600 dark:text-slate-400 font-medium">{edu.grade}</div>}
                              {edu.honors && <div className="text-teal-700 dark:text-teal-400">{edu.honors}</div>}
                              {edu.coursework && (
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                  <strong>Key Modules:</strong> {edu.coursework.join(', ')}
                                </div>
                              )}
                            </div>
                            <div className="text-right text-slate-500 font-mono shrink-0">
                              <div>{edu.graduationDate}</div>
                              <div>{edu.location}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technical Skills */}
                    {selectedExample.fullContent.skills && (
                      <div>
                        <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
                          Technical & Analytical Skills
                        </h3>
                        <div className="space-y-1">
                          {selectedExample.fullContent.skills.map((s, i) => (
                            <div key={i}>
                              <strong>{s.category}:</strong> {s.items.join(', ')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Research Projects */}
                    {selectedExample.fullContent.research && selectedExample.fullContent.research.length > 0 && (
                      <div>
                        <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
                          Research Experience & Theses
                        </h3>
                        <div className="space-y-3">
                          {selectedExample.fullContent.research.map((r, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                                <span>{r.projectTitle}</span>
                                <span className="text-slate-500 font-mono">{r.period}</span>
                              </div>
                              <div className="italic text-teal-600 dark:text-teal-400">{r.role} — {r.institution}</div>
                              <p className="text-slate-600 dark:text-slate-400"><strong>Methodology:</strong> {r.methodology}</p>
                              <ul className="list-disc pl-4 space-y-0.5">
                                {r.outcomes.map((out, oi) => (
                                  <li key={oi}>{out}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {selectedExample.fullContent.projects && selectedExample.fullContent.projects.length > 0 && (
                      <div>
                        <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
                          Engineering & Software Projects
                        </h3>
                        <div className="space-y-3">
                          {selectedExample.fullContent.projects.map((p, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                                <span>{p.title}</span>
                                {p.technologies && (
                                  <span className="text-[10px] text-teal-700 dark:text-teal-300 font-mono">
                                    [{p.technologies.join(', ')}]
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-600 dark:text-slate-400">{p.description}</p>
                              <ul className="list-disc pl-4 space-y-0.5">
                                {p.bullets.map((b, bi) => (
                                  <li key={bi}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Publications */}
                    {selectedExample.fullContent.publications && selectedExample.fullContent.publications.length > 0 && (
                      <div>
                        <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
                          Peer-Reviewed Publications
                        </h3>
                        <div className="space-y-2">
                          {selectedExample.fullContent.publications.map((pub, i) => (
                            <div key={i} className="space-y-0.5">
                              <p className="text-slate-800 dark:text-slate-200">{pub.citation}</p>
                              <div className="text-[10px] text-teal-600 font-semibold">[{pub.status}]</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {selectedExample.fullContent.experience && selectedExample.fullContent.experience.length > 0 && (
                      <div>
                        <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
                          Professional & Internship Experience
                        </h3>
                        <div className="space-y-3">
                          {selectedExample.fullContent.experience.map((exp, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                                <span>{exp.role} — {exp.organization}</span>
                                <span className="text-slate-500 font-mono">{exp.period}</span>
                              </div>
                              <ul className="list-disc pl-4 space-y-0.5">
                                {exp.bullets.map((b, bi) => (
                                  <li key={bi}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Awards */}
                    {selectedExample.fullContent.awards && selectedExample.fullContent.awards.length > 0 && (
                      <div>
                        <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
                          Honors & Distinctions
                        </h3>
                        <ul className="space-y-1">
                          {selectedExample.fullContent.awards.map((aw, i) => (
                            <li key={i} className="flex justify-between">
                              <span><strong>{aw.title}</strong> — {aw.issuer}</span>
                              <span className="text-slate-500 font-mono">{aw.year}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Volunteering */}
                    {selectedExample.fullContent.volunteering && selectedExample.fullContent.volunteering.length > 0 && (
                      <div>
                        <h3 className="font-bold uppercase tracking-wider text-[11px] text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
                          Leadership & Community Service
                        </h3>
                        <div className="space-y-2">
                          {selectedExample.fullContent.volunteering.map((v, i) => (
                            <div key={i}>
                              <div className="flex justify-between font-bold">
                                <span>{v.role} ({v.organization})</span>
                                <span className="text-slate-500 font-mono">{v.period}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-400">{v.impact}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Architectural Rationale */}
                {activeTab === 'RATIONALE' && (
                  <div className="p-6 sm:p-8 space-y-6 text-xs max-h-[720px] overflow-y-auto">
                    <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40 text-teal-950 dark:text-teal-200">
                      <h4 className="font-bold text-sm mb-1">{isBn ? 'এই মডেলের আর্কিটেকচারাল যুক্তি' : 'Strategic Architecture Rationale'}</h4>
                      <p className="leading-relaxed">
                        {isBn && selectedExample.rationaleBn ? selectedExample.rationaleBn : selectedExample.rationaleEn}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                        {isBn ? 'সেকশন বিন্যাস ক্রম ও উদ্দেশ্য' : 'Ordered Section Breakdown & Tactical Purpose'}
                      </h4>
                      <div className="space-y-3">
                        {selectedExample.sectionBreakdown.map((sb) => (
                          <div
                            key={sb.order}
                            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-start gap-3"
                          >
                            <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                              {sb.order}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white text-xs mb-0.5">
                                {sb.sectionName}
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                                {sb.purpose}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-500">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>Select a sample CV from the list on the left to inspect its structure and rationale.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
