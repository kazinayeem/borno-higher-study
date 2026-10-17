import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  School,
  Globe,
  Award,
  Layers,
  FileCheck2,
  Info,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';
import {
  evaluateAcademicEligibility,
  getCountries,
  getUniversities,
  getAcademicRequirements,
} from '../services/api';
import { AcademicReportCorrectionModal } from '../components/common/AcademicReportCorrectionModal';
import { PageIntro } from '../components/motion/index.js';
import {
  StudentEligibilityAssessmentResult,
  AssessmentCriterion,
  Country,
  University,
  AcademicRequirementItem,
} from '../types';

export const EligibilityCheckerPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Form State
  const [targetCountryCode, setTargetCountryCode] = useState(searchParams.get('country') || 'GB');
  const [universityId, setUniversityId] = useState(searchParams.get('universityId') || '');
  const [degreeLevel, setDegreeLevel] = useState<'BACHELOR' | 'MASTER' | 'PHD' | 'FOUNDATION' | 'DIPLOMA'>(
    (searchParams.get('degree') as any) || 'MASTER'
  );
  const [programName, setProgramName] = useState(searchParams.get('program') || '');

  // Academic Results State
  const [sscGpa, setSscGpa] = useState<number | ''>(5.0);
  const [sscScale, setSscScale] = useState<number>(5.0);

  const [hscGpa, setHscGpa] = useState<number | ''>(4.85);
  const [hscScale, setHscScale] = useState<number>(5.0);
  const [hscStream, setHscStream] = useState<'SCIENCE' | 'COMMERCE' | 'HUMANITIES' | 'OTHER'>('SCIENCE');

  // Prerequisite Subject Grades
  const [subjectGrades, setSubjectGrades] = useState<
    Array<{ subjectName: string; gradeLetter: string; gradeNumeric: number }>
  >([
    { subjectName: 'Mathematics', gradeLetter: 'A+', gradeNumeric: 5.0 },
    { subjectName: 'Physics', gradeLetter: 'A', gradeNumeric: 4.0 },
  ]);

  // Higher Degree State
  const [bachelorDegreeTitle, setBachelorDegreeTitle] = useState('BSc in Computer Science and Engineering');
  const [bachelorCgpa, setBachelorCgpa] = useState<number | ''>(3.65);
  const [bachelorScale, setBachelorScale] = useState<number>(4.0);

  const [masterDegreeTitle, setMasterDegreeTitle] = useState('');
  const [masterCgpa, setMasterCgpa] = useState<number | ''>('');
  const [masterScale, setMasterScale] = useState<number>(4.0);

  const [hasResearchProposal, setHasResearchProposal] = useState(false);
  const [workExperienceMonths, setWorkExperienceMonths] = useState<number | ''>(12);
  const [englishStatus, setEnglishStatus] = useState('IELTS 7.5 (R:7.5, W:7.0, L:8.0, S:7.0)');

  // Data Selectors
  const [countries, setCountries] = useState<Country[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [benchmarkRequirements, setBenchmarkRequirements] = useState<AcademicRequirementItem[]>([]);

  // Assessment Output & Processing
  const [evaluating, setEvaluating] = useState(false);
  const [assessment, setAssessment] = useState<StudentEligibilityAssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Correction Modal
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);

  // Load Reference Data
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [cRes, uRes, reqRes] = await Promise.all([
          getCountries(),
          getUniversities(),
          getAcademicRequirements({ limit: 50 }),
        ]);
        setCountries(cRes.countries || []);
        setUniversities(uRes.universities || []);
        setBenchmarkRequirements(reqRes.requirements || []);

        if (!universityId && uRes.universities?.length > 0) {
          // Default to an institution in target country
          const matchedUni = uRes.universities.find(
            (u) => u.countryName.toLowerCase().includes('united kingdom') || u.countrySlug === 'united-kingdom'
          );
          if (matchedUni) setUniversityId(matchedUni.id);
        }
      } catch (err) {
        console.error('Failed to load initial directory data:', err);
      }
    }
    loadInitialData();
  }, []);

  // Filter universities by country
  const filteredUniversities = universities.filter((u) => {
    if (!targetCountryCode) return true;
    const countryObj = countries.find((c) => c.code === targetCountryCode);
    if (!countryObj) return true;
    return (
      u.countrySlug === countryObj.slug ||
      u.countryName.toLowerCase() === countryObj.name.toLowerCase()
    );
  });

  // Handle Assessment Calculation
  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setEvaluating(true);
    setError(null);

    const selectedUni = universities.find((u) => u.id === universityId);

    try {
      const payload = {
        targetCountryCode,
        universityId: universityId || undefined,
        universityName: selectedUni?.name,
        programName: programName || undefined,
        degreeLevel,
        sscGpa: sscGpa !== '' ? Number(sscGpa) : undefined,
        sscScale,
        hscGpa: hscGpa !== '' ? Number(hscGpa) : undefined,
        hscScale,
        hscStream,
        subjectGrades: subjectGrades.filter((s) => s.subjectName.trim() !== ''),
        bachelorDegreeTitle: degreeLevel !== 'BACHELOR' ? bachelorDegreeTitle : undefined,
        bachelorCgpa: degreeLevel !== 'BACHELOR' && bachelorCgpa !== '' ? Number(bachelorCgpa) : undefined,
        bachelorScale,
        masterDegreeTitle: degreeLevel === 'PHD' ? masterDegreeTitle : undefined,
        masterCgpa: degreeLevel === 'PHD' && masterCgpa !== '' ? Number(masterCgpa) : undefined,
        masterScale,
        hasResearchProposal,
        workExperienceMonths: workExperienceMonths !== '' ? Number(workExperienceMonths) : 0,
        englishProficiencyStatus: englishStatus,
      };

      const result = await evaluateAcademicEligibility(payload);
      setAssessment(result);

      // Scroll to assessment result smoothly
      setTimeout(() => {
        const el = document.getElementById('assessment-result-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate academic eligibility.');
    } finally {
      setEvaluating(false);
    }
  };

  // Add / Remove Subject
  const handleAddSubject = () => {
    setSubjectGrades([...subjectGrades, { subjectName: '', gradeLetter: 'A', gradeNumeric: 4.0 }]);
  };

  const handleRemoveSubject = (idx: number) => {
    setSubjectGrades(subjectGrades.filter((_, i) => i !== idx));
  };

  const handleSubjectChange = (idx: number, field: string, value: any) => {
    const updated = [...subjectGrades];
    (updated[idx] as any)[field] = value;
    setSubjectGrades(updated);
  };

  // Preset Sample Profiles
  const applyPreset = (preset: 'OXFORD_CS' | 'IMPERIAL_EEE' | 'TUM_INFORMATICS' | 'TORONTO_PHARM') => {
    if (preset === 'OXFORD_CS') {
      setTargetCountryCode('GB');
      const uni = universities.find((u) => u.name.toLowerCase().includes('oxford'));
      if (uni) setUniversityId(uni.id);
      setDegreeLevel('MASTER');
      setProgramName('MSc in Advanced Computer Science');
      setBachelorDegreeTitle('BSc in Computer Science');
      setBachelorCgpa(3.75);
      setBachelorScale(4.0);
      setSubjectGrades([
        { subjectName: 'Mathematics', gradeLetter: 'A+', gradeNumeric: 5.0 },
        { subjectName: 'Computer Science', gradeLetter: 'A+', gradeNumeric: 5.0 },
      ]);
    } else if (preset === 'IMPERIAL_EEE') {
      setTargetCountryCode('GB');
      const uni = universities.find((u) => u.name.toLowerCase().includes('imperial'));
      if (uni) setUniversityId(uni.id);
      setDegreeLevel('BACHELOR');
      setProgramName('BEng Electrical and Electronic Engineering');
      setHscGpa(5.0);
      setHscScale(5.0);
      setHscStream('SCIENCE');
      setSubjectGrades([
        { subjectName: 'Higher Mathematics', gradeLetter: 'A+', gradeNumeric: 5.0 },
        { subjectName: 'Physics', gradeLetter: 'A+', gradeNumeric: 5.0 },
      ]);
    } else if (preset === 'TUM_INFORMATICS') {
      setTargetCountryCode('DE');
      const uni = universities.find((u) => u.name.toLowerCase().includes('munich') || u.name.toLowerCase().includes('tum'));
      if (uni) setUniversityId(uni.id);
      setDegreeLevel('MASTER');
      setProgramName('MSc in Informatics');
      setBachelorDegreeTitle('BSc in Software Engineering');
      setBachelorCgpa(3.6);
      setBachelorScale(4.0);
    } else if (preset === 'TORONTO_PHARM') {
      setTargetCountryCode('CA');
      const uni = universities.find((u) => u.name.toLowerCase().includes('toronto'));
      if (uni) setUniversityId(uni.id);
      setDegreeLevel('MASTER');
      setProgramName('MSc in Pharmaceutical Sciences');
      setBachelorDegreeTitle('Bachelor of Pharmacy (BPharm)');
      setBachelorCgpa(3.55);
      setBachelorScale(4.0);
      setSubjectGrades([
        { subjectName: 'Chemistry', gradeLetter: 'A', gradeNumeric: 4.5 },
        { subjectName: 'Biology', gradeLetter: 'A+', gradeNumeric: 5.0 },
      ]);
    }
  };

  // Helper for Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'MEETS_THRESHOLDS':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          title: 'Meets Published Academic Thresholds',
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
        };
      case 'DOES_NOT_MEET':
        return {
          icon: <XCircle className="w-6 h-6 text-rose-600" />,
          title: 'Does Not Meet One or More Published Thresholds',
          bg: 'bg-rose-50 border-rose-200 text-rose-950',
          badge: 'bg-rose-600 text-white',
        };
      case 'EQUIVALENCY_CONFIRMATION_REQUIRED':
        return {
          icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
          title: 'Qualification Equivalency Requires Confirmation',
          bg: 'bg-amber-50 border-amber-200 text-amber-950',
          badge: 'bg-amber-600 text-white',
        };
      case 'PREREQUISITES_NOT_CONFIRMED':
        return {
          icon: <HelpCircle className="w-6 h-6 text-blue-600" />,
          title: 'Subject Prerequisites Not Confirmed',
          bg: 'bg-blue-50 border-blue-200 text-blue-950',
          badge: 'bg-blue-600 text-white',
        };
      default:
        return {
          icon: <Info className="w-6 h-6 text-slate-600" />,
          title: 'Additional Information Required',
          bg: 'bg-slate-50 border-slate-200 text-slate-950',
          badge: 'bg-slate-600 text-white',
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] pb-20">
      {/* Editorial Header */}
      <div className="bg-[#0B192C] text-white pt-12 pb-16 border-b border-slate-800">
        <PageIntro className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-teal-400 text-xs font-semibold tracking-wide uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                Academic Equivalency & Prerequisites Engine
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold tracking-tight text-white mb-3">
                Academic Eligibility & Qualification Checker
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Evaluate your secondary (SSC), higher secondary (HSC), bachelor’s CGPA, and prerequisite STEM/health/business subject grades against verified minimum admission thresholds across global institutions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/academic-requirements"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition-all shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-teal-400" />
                Browse Requirements Catalog
              </Link>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Evaluation Presets:</span>
            <button
              onClick={() => applyPreset('OXFORD_CS')}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors font-medium"
            >
              Oxford MSc Comp Sci (CGPA 3.75)
            </button>
            <button
              onClick={() => applyPreset('IMPERIAL_EEE')}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors font-medium"
            >
              Imperial BEng EEE (HSC Math+Physics)
            </button>
            <button
              onClick={() => applyPreset('TUM_INFORMATICS')}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors font-medium"
            >
              TUM MSc Informatics (BSc Software Eng)
            </button>
            <button
              onClick={() => applyPreset('TORONTO_PHARM')}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-rose-300 border border-slate-700 transition-colors font-medium"
            >
              Toronto MSc Pharmacy (Biology+Chem)
            </button>
          </div>
        </PageIntro>
      </div>

      {/* Main Content Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <form onSubmit={handleEvaluate} className="space-y-6">
          {/* Card 1: Target Destination & Program */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">1. Target Destination & Academic Program</h2>
                <p className="text-xs text-slate-500">
                  Select the institution and discipline to compare against official faculty benchmarks.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Country *</label>
                <select
                  value={targetCountryCode}
                  onChange={(e) => setTargetCountryCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="">Any Country</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Institution *</label>
                <select
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="">Select University</option>
                  {filteredUniversities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.countryName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Qualification Level *</label>
                <select
                  value={degreeLevel}
                  onChange={(e) => setDegreeLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="BACHELOR">Bachelor's Degree (BA, BSc, BEng, BBA)</option>
                  <option value="MASTER">Master's Degree (MA, MSc, MEng, MBA)</option>
                  <option value="PHD">Doctoral Degree (PhD, DPhil)</option>
                  <option value="FOUNDATION">Foundation / Pathway Program</option>
                  <option value="DIPLOMA">Postgraduate Diploma / Vocational</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject or Program Title</label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="e.g. Computer Science, Pharmacy, MBA"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Secondary & Higher Secondary (SSC & HSC) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  2. Secondary (SSC/O-Level) & Higher Secondary (HSC/A-Level)
                </h2>
                <p className="text-xs text-slate-500">
                  Preserve exact grading scales. Do not convert Bangladesh 5.00 GPA into university CGPA.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">SSC / Equivalent GPA</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5.0"
                    value={sscGpa}
                    onChange={(e) => setSscGpa(e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="e.g. 5.00"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-xs text-slate-400 font-semibold">/ 5.00</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">HSC / Equivalent GPA</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5.0"
                    value={hscGpa}
                    onChange={(e) => setHscGpa(e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="e.g. 4.85"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-xs text-slate-400 font-semibold">/ 5.00</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">HSC Academic Group / Stream</label>
                <select
                  value={hscStream}
                  onChange={(e) => setHscStream(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="SCIENCE">Science (Physics, Chem, Math, Bio)</option>
                  <option value="COMMERCE">Commerce / Business Studies</option>
                  <option value="HUMANITIES">Humanities / Arts</option>
                  <option value="OTHER">Other / Vocational</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">English Proficiency Status</label>
                <input
                  type="text"
                  value={englishStatus}
                  onChange={(e) => setEnglishStatus(e.target.value)}
                  placeholder="e.g. IELTS 7.0, TOEFL 100, or MOI"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Subject Specific Grades */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Prerequisite Subject Grades (e.g. Higher Math, Physics, Chemistry, Biology)
                </span>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-lg transition-colors"
                >
                  + Add Subject
                </button>
              </div>

              <div className="space-y-2.5">
                {subjectGrades.map((subj, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex-1 min-w-[180px]">
                      <input
                        type="text"
                        value={subj.subjectName}
                        onChange={(e) => handleSubjectChange(idx, 'subjectName', e.target.value)}
                        placeholder="Subject Name (e.g. Mathematics, Physics)"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="w-24">
                      <select
                        value={subj.gradeLetter}
                        onChange={(e) => handleSubjectChange(idx, 'gradeLetter', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="A+">A+ (5.00)</option>
                        <option value="A">A (4.00)</option>
                        <option value="A-">A- (3.50)</option>
                        <option value="B">B (3.00)</option>
                        <option value="C">C (2.00)</option>
                        <option value="D">D (1.00)</option>
                      </select>
                    </div>
                    <div className="w-28 flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        value={subj.gradeNumeric}
                        onChange={(e) => handleSubjectChange(idx, 'gradeNumeric', parseFloat(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                      <span className="text-[10px] text-slate-400 font-medium">pts</span>
                    </div>
                    {subjectGrades.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Undergraduate & Postgraduate Qualifications */}
          {['MASTER', 'PHD', 'DIPLOMA'].includes(degreeLevel) && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    3. Undergraduate Degree & CGPA (For Postgraduate Study)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mandatory for Master's and Doctoral assessments. Enter your Bachelor's CGPA out of 4.00.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Bachelor's Degree Title *
                  </label>
                  <input
                    type="text"
                    value={bachelorDegreeTitle}
                    onChange={(e) => setBachelorDegreeTitle(e.target.value)}
                    placeholder="e.g. BSc in Computer Science, BBA, BPharm"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                    required={['MASTER', 'PHD'].includes(degreeLevel)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Bachelor's Cumulative GPA (CGPA) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      value={bachelorCgpa}
                      onChange={(e) => setBachelorCgpa(e.target.value ? parseFloat(e.target.value) : '')}
                      placeholder="e.g. 3.65"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                      required={['MASTER', 'PHD'].includes(degreeLevel)}
                    />
                    <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Relevant Work Experience (Months)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={workExperienceMonths}
                    onChange={(e) => setWorkExperienceMonths(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="e.g. 12"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* PhD Specific fields */}
              {degreeLevel === 'PHD' && (
                <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Master's Degree Title (if completed)
                    </label>
                    <input
                      type="text"
                      value={masterDegreeTitle}
                      onChange={(e) => setMasterDegreeTitle(e.target.value)}
                      placeholder="e.g. MSc in Data Science"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Master's CGPA
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        value={masterCgpa}
                        onChange={(e) => setMasterCgpa(e.target.value ? parseFloat(e.target.value) : '')}
                        placeholder="e.g. 3.80"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                      />
                      <span className="text-xs text-slate-400 font-semibold">/ 4.00</span>
                    </div>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={hasResearchProposal}
                        onChange={(e) => setHasResearchProposal(e.target.checked)}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      Have Prepared Research Proposal (2,000+ words)
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Evaluate Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-navy-900 text-white p-6 rounded-2xl shadow-lg">
            <div>
              <p className="font-bold text-base text-white">Ready to verify admission requirements?</p>
              <p className="text-xs text-navy-200">
                Instantly check minimum GPAs, prerequisite subjects, and credential frameworks with zero document upload.
              </p>
            </div>
            <button
              type="submit"
              disabled={evaluating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Evaluating Criteria...
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  Evaluate Academic Eligibility
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center gap-3">
            <XCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* ASSESSMENT RESULT SECTION */}
        {assessment && (
          <div id="assessment-result-section" className="mt-10 space-y-6 animate-fade-in">
            {/* Status Summary Banner */}
            {(() => {
              const badge = getStatusBadge(assessment.status);
              return (
                <div className={`p-6 sm:p-8 rounded-2xl border ${badge.bg} shadow-sm space-y-4`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-white rounded-xl shadow-sm">{badge.icon}</div>
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-1 ${badge.badge}`}>
                          {assessment.status.replace(/_/g, ' ')}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{badge.title}</h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCorrectionModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition-colors self-start sm:self-auto"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-600" />
                      Propose Requirement Correction
                    </button>
                  </div>

                  <p className="text-sm font-medium leading-relaxed max-w-4xl">{assessment.summary}</p>

                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600 border-t border-slate-200/60">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      No guaranteed admission — evaluation matches published minimum thresholds only.
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>Exact official assessment requires departmental faculty transcript review.</span>
                  </div>
                </div>
              );
            })()}

            {/* Criteria-by-Criteria Breakdown Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Criteria-by-Criteria Requirement Audit</h4>
                  <p className="text-xs text-slate-500">
                    Direct comparison of student credentials against verified departmental benchmarks.
                  </p>
                </div>
                <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  {assessment.criteria.length} Criteria Evaluated
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {assessment.criteria.map((crit, idx) => (
                  <div key={idx} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {crit.category.replace(/_/g, ' ')}
                          </span>
                          <h5 className="text-sm font-bold text-slate-900">{crit.title}</h5>
                        </div>
                        <p className="text-xs text-slate-600">{crit.explanation}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:w-96 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div>
                          <span className="block text-[10px] font-semibold text-slate-400 uppercase">Published Requirement</span>
                          <span className="font-semibold text-slate-900">{crit.required}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold text-slate-400 uppercase">Your Details</span>
                          <span className="font-medium text-slate-800">{crit.studentActual}</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:justify-end">
                          {crit.matched === true ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Satisfied
                            </span>
                          ) : crit.matched === false ? (
                            <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-lg text-xs font-bold">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Unmet
                            </span>
                          ) : crit.matched === 'CONDITIONAL' ? (
                            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-lg text-xs font-bold">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              Conditional
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold">
                              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                              Missing Data
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Official Benchmark Source Card */}
            {assessment.requirementDetails && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-5 h-5 text-teal-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Official Academic Policy Attribution & Source Evidence
                      </h4>
                      <p className="text-xs text-slate-500">
                        {assessment.requirementDetails.university?.name} ({assessment.requirementDetails.countryCode})
                      </p>
                    </div>
                  </div>
                  <a
                    href={assessment.requirementDetails.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold transition-colors"
                  >
                    View Official Course Page
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-semibold block mb-0.5">Direct Entry Status</span>
                    <span className="font-bold text-slate-900">
                      {assessment.requirementDetails.directEntryAccepted
                        ? 'Direct Year 1 Entry Accepted'
                        : 'Approved Foundation Year Required'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-semibold block mb-0.5">Verification Date</span>
                    <span className="font-bold text-slate-900">
                      {new Date(assessment.requirementDetails.verificationTimestamp).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-semibold block mb-0.5">Editorial Verification Status</span>
                    <span className="font-bold text-emerald-700">Verified by Borno Editorial Board</span>
                  </div>
                </div>

                {assessment.requirementDetails.foundationEntryOption && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <p className="font-bold mb-1">International Pathway Guidance:</p>
                    <p>{assessment.requirementDetails.foundationEntryOption}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Correction Report Modal */}
      <AcademicReportCorrectionModal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        academicRequirementId={assessment?.requirementDetails?.id}
        universityName={assessment?.requirementDetails?.university?.name || universities.find((u) => u.id === universityId)?.name || 'Target University'}
        programName={programName || 'Academic Program'}
        degreeLevel={degreeLevel}
        onSuccess={() => alert('Thank you! Your correction report has been forwarded to the editorial queue.')}
      />
    </div>
  );
};
