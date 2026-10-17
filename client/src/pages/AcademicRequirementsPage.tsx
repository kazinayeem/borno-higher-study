import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Search,
  Filter,
  Globe,
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  FileCheck2,
  School,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  getAcademicRequirements,
  getCountries,
  getGradeScales,
  getQualificationEquivalencies,
} from '../services/api';
import { AcademicReportCorrectionModal } from '../components/common/AcademicReportCorrectionModal';
import {
  AcademicRequirementItem,
  Country,
  GradeScaleItem,
  QualificationEquivalencyItem,
} from '../types';

export const AcademicRequirementsPage: React.FC = () => {
  const [requirements, setRequirements] = useState<AcademicRequirementItem[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [gradeScales, setGradeScales] = useState<GradeScaleItem[]>([]);
  const [equivalencies, setEquivalencies] = useState<QualificationEquivalencyItem[]>([]);

  // Filter State
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [selectedStream, setSelectedStream] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Correction Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedForReport, setSelectedForReport] = useState<AcademicRequirementItem | null>(null);

  // Active Tab: Catalog vs Equivalency Reference
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'EQUIVALENCIES' | 'GRADE_SCALES'>('CATALOG');

  useEffect(() => {
    async function loadMeta() {
      try {
        const [cRes, scalesRes, equivsRes] = await Promise.all([
          getCountries(),
          getGradeScales(),
          getQualificationEquivalencies(),
        ]);
        setCountries(cRes.countries || []);
        setGradeScales(scalesRes.gradeScales || []);
        setEquivalencies(equivsRes.equivalencies || []);
      } catch (err) {
        console.error('Failed to load metadata:', err);
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    async function fetchReqs() {
      setLoading(true);
      try {
        const res = await getAcademicRequirements({
          countryCode: selectedCountry !== 'all' ? selectedCountry : undefined,
          degreeLevel: selectedDegree !== 'all' ? selectedDegree : undefined,
          hscStreamRequired: selectedStream !== 'all' ? selectedStream : undefined,
          search: searchTerm.trim() || undefined,
          page,
          limit: 12,
        });
        setRequirements(res.requirements || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      } catch (err) {
        console.error('Failed to fetch academic requirements:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReqs();
  }, [selectedCountry, selectedDegree, selectedStream, searchTerm, page]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white pt-12 pb-20 relative overflow-hidden border-b border-navy-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold tracking-wide uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Admissions Registry
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
                Global University Academic Requirements Directory
              </h1>
              <p className="text-navy-200 text-sm sm:text-base leading-relaxed">
                Explore verified minimum GPA thresholds, prerequisite subject grades, and international qualification frameworks for higher study destinations across the UK, USA, Canada, Germany, Australia, and Europe.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/eligibility-checker"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-teal-500/20 transition-all"
              >
                <FileCheck2 className="w-4 h-4" />
                Check My Eligibility
              </Link>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="mt-8 flex items-center gap-2 border-b border-navy-800 pb-px">
            <button
              onClick={() => setActiveTab('CATALOG')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 ${
                activeTab === 'CATALOG'
                  ? 'border-teal-400 text-teal-300 bg-navy-800/80'
                  : 'border-transparent text-navy-300 hover:text-white hover:bg-navy-800/40'
              }`}
            >
              Academic Requirements Catalog ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('EQUIVALENCIES')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 ${
                activeTab === 'EQUIVALENCIES'
                  ? 'border-teal-400 text-teal-300 bg-navy-800/80'
                  : 'border-transparent text-navy-300 hover:text-white hover:bg-navy-800/40'
              }`}
            >
              Qualification Equivalencies ({equivalencies.length})
            </button>
            <button
              onClick={() => setActiveTab('GRADE_SCALES')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 ${
                activeTab === 'GRADE_SCALES'
                  ? 'border-teal-400 text-teal-300 bg-navy-800/80'
                  : 'border-transparent text-navy-300 hover:text-white hover:bg-navy-800/40'
              }`}
            >
              Grade Scale Standards ({gradeScales.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {activeTab === 'CATALOG' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search university or course..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Country Filter */}
                <div>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Destination Countries</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Degree Level Filter */}
                <div>
                  <select
                    value={selectedDegree}
                    onChange={(e) => {
                      setSelectedDegree(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Degree Levels</option>
                    <option value="BACHELOR">Bachelor's Degree</option>
                    <option value="MASTER">Master's Degree</option>
                    <option value="PHD">Doctoral Degree (PhD)</option>
                    <option value="FOUNDATION">Foundation Program</option>
                  </select>
                </div>

                {/* Academic Stream Filter */}
                <div>
                  <select
                    value={selectedStream}
                    onChange={(e) => {
                      setSelectedStream(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Academic Streams</option>
                    <option value="SCIENCE">Science Required</option>
                    <option value="COMMERCE">Commerce Required</option>
                    <option value="HUMANITIES">Humanities / Arts</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 h-64 animate-pulse" />
                ))}
              </div>
            ) : requirements.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Academic Requirements Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your country or degree level filters, or test your profile in the interactive eligibility checker.
                </p>
                <Link
                  to="/eligibility-checker"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold mt-2"
                >
                  Open Eligibility Checker
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requirements.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div className="p-6 space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          {req.degreeLevel}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {req.countryCode}
                        </span>
                      </div>

                      {/* Title & University */}
                      <div>
                        <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                          {req.program?.name || req.university?.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <School className="w-3.5 h-3.5 text-slate-400" />
                          {req.university?.name} • {req.university?.countryName}
                        </p>
                      </div>

                      {/* Key Academic Requirements Details */}
                      <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {/* Minimum Bachelor CGPA */}
                        {req.minBachelorCgpa && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Min Bachelor CGPA:</span>
                            <span className="font-bold text-slate-900">
                              {req.minBachelorCgpa.toFixed(2)} / {req.bachelorCgpaScale?.toFixed(2) || '4.00'}
                              {req.bachelorClassRequired && ` (${req.bachelorClassRequired})`}
                            </span>
                          </div>
                        )}

                        {/* Minimum HSC GPA */}
                        {req.minHscGpa && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Min HSC GPA:</span>
                            <span className="font-bold text-slate-900">
                              {req.minHscGpa.toFixed(2)} / 5.00
                              {req.hscStreamRequired && req.hscStreamRequired !== 'ANY' && ` (${req.hscStreamRequired})`}
                            </span>
                          </div>
                        )}

                        {/* Minimum SSC GPA */}
                        {req.minSscGpa && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Min SSC GPA:</span>
                            <span className="font-bold text-slate-900">
                              {req.minSscGpa.toFixed(2)} / 5.00
                            </span>
                          </div>
                        )}

                        {/* Direct Entry vs Foundation */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                          <span className="text-slate-500">Year 1 Entry:</span>
                          <span
                            className={`font-semibold ${
                              req.directEntryAccepted ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {req.directEntryAccepted ? 'Direct Accepted' : 'Foundation Route'}
                          </span>
                        </div>
                      </div>

                      {/* Subject Prerequisites */}
                      {req.subjectRequirements && req.subjectRequirements.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                            Prerequisite Subjects:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {req.subjectRequirements.map((subj) => (
                              <span
                                key={subj.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                              >
                                {subj.subjectName}
                                {subj.minimumGradeLetter && (
                                  <span className="text-teal-700 font-bold">({subj.minimumGradeLetter})</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={req.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-500 hover:text-teal-700 font-medium inline-flex items-center gap-1"
                        >
                          Official Source
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-slate-300">•</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedForReport(req);
                            setModalOpen(true);
                          }}
                          className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                        >
                          Report Update
                        </button>
                      </div>

                      <Link
                        to={`/eligibility-checker?country=${req.countryCode}&universityId=${req.universityId}&degree=${req.degreeLevel}&program=${encodeURIComponent(req.program?.name || '')}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Check
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* EQUIVALENCIES TAB */}
        {activeTab === 'EQUIVALENCIES' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Official Qualification Equivalency Frameworks
                </h3>
                <p className="text-xs text-slate-500">
                  Recognized authorities (ECCTIS, Anabin, WES) conversion guidelines for international applicants.
                </p>
              </div>
              <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
                Official Policies
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3">Destination</th>
                    <th className="px-6 py-3">Home Qualification</th>
                    <th className="px-6 py-3">Minimum Result</th>
                    <th className="px-6 py-3">Standard Equivalency</th>
                    <th className="px-6 py-3">Credential Evaluator</th>
                    <th className="px-6 py-3">Policy Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {equivalencies.map((eq) => (
                    <tr key={eq.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-900">{eq.countryCode}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{eq.homeQualification}</td>
                      <td className="px-6 py-4 text-slate-600">{eq.minimumHomeResult || 'N/A'}</td>
                      <td className="px-6 py-4 text-teal-700 font-bold">{eq.standardEquivalency}</td>
                      <td className="px-6 py-4 text-slate-700">{eq.credentialEvaluator}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {eq.isOfficialPolicy ? 'Official Policy' : 'Advisory Estimate'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GRADE SCALES TAB */}
        {activeTab === 'GRADE_SCALES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gradeScales.map((scale) => (
              <div key={scale.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                      {scale.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{scale.name}</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Max: {scale.maxScale}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{scale.description}</p>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <span className="text-slate-400 font-semibold block">Official Scale Authority:</span>
                  <span className="font-bold text-slate-800">{scale.officialScaleAuthority}</span>
                </div>

                {scale.bands && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
                      Grade Classification Bands
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {scale.bands.map((band: any, bIdx: number) => (
                        <div
                          key={bIdx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <span className="font-bold text-slate-800">{band.band || band.label}</span>
                          <span className="text-slate-500 font-mono">
                            {band.range || (band.minGpa ? `GPA >= ${band.minGpa}` : `${band.min || 0} - ${band.max || scale.maxScale}`)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedForReport && (
        <AcademicReportCorrectionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          academicRequirementId={selectedForReport.id}
          universityName={selectedForReport.university?.name || 'Selected University'}
          programName={selectedForReport.program?.name || 'Academic Program'}
          degreeLevel={selectedForReport.degreeLevel}
          onSuccess={() => alert('Correction report submitted to admin queue.')}
        />
      )}
    </div>
  );
};
