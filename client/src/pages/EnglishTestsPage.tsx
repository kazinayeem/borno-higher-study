import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Clock,
  Mic,
  Calendar,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  ShieldCheck,
  Building2,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  Compass,
} from 'lucide-react';
import { getEnglishTestMatrix } from '../services/api';
import { SeoHead } from '../components/common/SeoHead';
import { TestReportCorrectionModal } from '../components/common/TestReportCorrectionModal';

export const EnglishTestsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TEST_CENTRE' | 'ONLINE' | 'UKVI'>('ALL');
  const [selectedFormatForModal, setSelectedFormatForModal] = useState<any | null>(null);

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    try {
      setLoading(true);
      const res = await getEnglishTestMatrix();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load test comparison matrix');
    } finally {
      setLoading(false);
    }
  };

  const filteredFormats = (data?.formats || []).filter((f: any) => {
    if (activeFilter === 'TEST_CENTRE') return f.deliveryMode === 'TEST_CENTRE';
    if (activeFilter === 'ONLINE') return f.deliveryMode === 'ONLINE';
    if (activeFilter === 'UKVI') return f.code.includes('UKVI');
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20">
      <SeoHead
        title="English Test Comparison 2026: IELTS vs PTE vs TOEFL Academic | Bangladesh Fees"
        description="Authoritative comparison of IELTS Academic, IELTS for UKVI, PTE Academic, PTE Online, and TOEFL iBT. Compare Bangladesh fees, test duration, speaking format, official turnaround times, and visa restrictions."
        canonicalPath="/english-tests"
        ogType="website"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Official Provider Data & Bangladesh Fees Verified
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            English Test Comparison & Bangladesh Fees
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl leading-relaxed mb-8">
            Compare <strong>IELTS Academic</strong>, <strong>IELTS for UKVI</strong>, <strong>PTE Academic</strong>,{' '}
            <strong>PTE Online</strong>, <strong>TOEFL iBT</strong>, and <strong>TOEFL Home Edition</strong> side by side.
            Check official Bangladesh registration fees, speaking formats, university acceptance, and critical visa restrictions.
          </p>

          {/* Neutrality & Key Guidance Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-navy-800/80 border border-navy-700 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-gray-200">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Info className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-white block mb-0.5">Which English test is best?</span>
              <p className="text-xs sm:text-sm text-gray-300">
                Borno Higher Study never claims one test is universally superior. The right choice depends strictly on your
                target course, university requirements, and whether your visa route requires a Secure English Language Test
                (SELT).
              </p>
            </div>
            <div className="flex gap-2.5 shrink-0 w-full sm:w-auto">
              <Link
                to="/english-test-advisor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-navy-950 font-bold text-xs shadow-md transition"
              >
                <Compass className="w-4 h-4" />
                Find My Best Test
              </Link>
              <Link
                to="/university-test-acceptance"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy-700 hover:bg-navy-600 text-white font-semibold text-xs border border-navy-600 transition"
              >
                <Building2 className="w-4 h-4" />
                University Rules
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <Filter className="w-4 h-4 text-teal-600" />
            <span>Filter Delivery:</span>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeFilter === 'ALL'
                  ? 'bg-navy-900 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Tests ({data?.formats?.length || 7})
            </button>
            <button
              onClick={() => setActiveFilter('TEST_CENTRE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeFilter === 'TEST_CENTRE'
                  ? 'bg-navy-900 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🏢 Test Centre Only
            </button>
            <button
              onClick={() => setActiveFilter('ONLINE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeFilter === 'ONLINE'
                  ? 'bg-navy-900 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              💻 At-Home Online Only
            </button>
            <button
              onClick={() => setActiveFilter('UKVI')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeFilter === 'UKVI'
                  ? 'bg-navy-900 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🇬🇧 UKVI SELT Approved
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center py-24">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-600 font-medium">Loading verified test comparison matrix...</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-800 my-8">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Failed to load test comparison data</h3>
            <p className="text-xs text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchMatrix}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Detailed Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFormats.map((format: any) => {
              const isOnline = format.deliveryMode === 'ONLINE';
              const isUkvi = format.code.includes('UKVI');
              const fee = format.currentFee;

              return (
                <div
                  key={format.id}
                  className="bg-white rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div>
                    <div className="p-6 pb-4 border-b border-gray-100">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <span className="text-[11px] font-bold tracking-wider text-teal-700 uppercase bg-teal-50 border border-teal-200/60 px-2.5 py-0.5 rounded-md inline-block mb-1.5">
                            {format.provider.name}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-black text-navy-950 flex items-center gap-2">
                            {format.name}
                          </h2>
                        </div>

                        {/* Delivery Badge */}
                        <div className="shrink-0 text-right">
                          {isOnline ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 border border-purple-200 text-purple-700">
                              💻 Remote At-Home
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                              🏢 Physical Test Centre
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Fee Highlight Box */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100/80 rounded-2xl p-4 border border-gray-200/70 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-[11px] text-gray-500 font-medium">Bangladesh Registration Fee</div>
                          <div className="flex items-baseline gap-2">
                            {fee?.amount ? (
                              <>
                                <span className="text-xl font-black text-navy-950">
                                  {fee.currency === 'BDT' ? `BDT ${fee.amount.toLocaleString()}` : `$${fee.amount} USD`}
                                </span>
                                {fee.currency === 'USD' && fee.bdtEstimate && (
                                  <span className="text-xs font-semibold text-teal-700">
                                    (~BDT {fee.bdtEstimate.toLocaleString()})
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-sm font-semibold text-gray-500">Official fee unconfirmed</span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {fee?.verificationStatus || 'VERIFIED'}
                          </div>
                          <a
                            href={fee?.officialFeeSourceUrl || format.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-gray-500 hover:text-teal-600 underline inline-flex items-center gap-1"
                          >
                            Official Fee Source
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Specifications List */}
                    <div className="p-6 space-y-4 text-xs sm:text-sm">
                      {/* Format, Scale, Duration */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-[11px] text-gray-500 font-semibold block mb-0.5 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-teal-600" /> Duration
                          </span>
                          <span className="font-bold text-navy-950">
                            {Math.floor(format.durationMinutes / 60)}h {format.durationMinutes % 60}m
                          </span>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-[11px] text-gray-500 font-semibold block mb-0.5 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-teal-600" /> Score Scale
                          </span>
                          <span className="font-bold text-navy-950">{format.scoreScale}</span>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 col-span-2 sm:col-span-1">
                          <span className="text-[11px] text-gray-500 font-semibold block mb-0.5 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-teal-600" /> Results Time
                          </span>
                          <span className="font-bold text-navy-950">{format.resultTurnaround}</span>
                        </div>
                      </div>

                      {/* Speaking Format */}
                      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1 flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5 text-teal-600" /> Speaking Format
                        </span>
                        <p className="text-gray-800 text-xs sm:text-sm">
                          {format.speakingFormat === 'FACE_TO_FACE' && (
                            <strong>Face-to-face 1-on-1 interview: </strong>
                          )}
                          {format.speakingFormat === 'AI_COMPUTER_RECORDED' && (
                            <strong>Headset microphone with AI dual scoring: </strong>
                          )}
                          {format.speakingFormat === 'COMPUTER_RECORDED_HUMAN_SCORED' && (
                            <strong>Microphone response scored by certified raters & AI: </strong>
                          )}
                          {format.speakingFormat === 'FACE_TO_FACE'
                            ? 'Converse naturally with a certified examiner; evaluates real-time conversational fluency.'
                            : format.speakingFormat === 'AI_COMPUTER_RECORDED'
                            ? 'Objective 100% automated AI grading eliminates human rater bias or examiner mood variance.'
                            : 'Standardized computerized speaking section evaluated under stringent multi-tier scoring rubrics.'}
                        </p>
                      </div>

                      {/* Scoring Updates / Special Features */}
                      {format.scoringUpdateNotes && (
                        <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-950">
                          <span className="font-bold block mb-1 text-teal-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Current Updates & Features:
                          </span>
                          {format.scoringUpdateNotes}
                        </div>
                      )}

                      {/* Visa & Immigration Restrictions Notice */}
                      <div
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                          isOnline
                            ? 'bg-rose-50 border-rose-200 text-rose-950'
                            : isUkvi
                            ? 'bg-blue-50 border-blue-200 text-blue-950'
                            : 'bg-amber-50 border-amber-200 text-amber-950'
                        }`}
                      >
                        <span
                          className={`font-bold block mb-1 flex items-center gap-1.5 ${
                            isOnline ? 'text-rose-900' : isUkvi ? 'text-blue-900' : 'text-amber-900'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          Visa & Immigration Notice:
                        </span>
                        {format.visaImmigrationRestrictions}
                      </div>

                      {/* University Acceptance Summary */}
                      <div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
                          Global University Acceptance
                        </span>
                        <p className="text-gray-700 text-xs leading-relaxed">{format.acceptanceOverview}</p>
                      </div>

                      {/* Preparation Resources */}
                      <div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
                          Official Preparation Resources
                        </span>
                        <p className="text-gray-600 text-xs mb-1.5">{format.preparationSummary}</p>
                        <a
                          href={format.preparationResourcesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                        >
                          Access Official Practice Tests
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-6 pt-4 bg-gray-50/80 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedFormatForModal(format)}
                      className="text-xs font-semibold text-gray-500 hover:text-navy-900 underline transition"
                    >
                      Report incorrect fee or policy
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/university-test-acceptance?testFormatCode=${format.code}`}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-300 hover:border-gray-400 text-gray-800 transition"
                      >
                        View Universities
                      </Link>

                      <a
                        href={format.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-950 hover:bg-navy-900 text-white flex items-center gap-1.5 shadow-sm transition"
                      >
                        Book Official Exam
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Official Source Attribution Section */}
        <div className="mt-14 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-navy-950 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            Official Provider Sources & Provenance
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-3xl leading-relaxed">
            All registration fee data, examination rules, test durations, and turnaround benchmarks are extracted directly
            from officially permitted circulars published by IDP IELTS Bangladesh, the British Council Bangladesh, Pearson
            Education Ltd, and Educational Testing Service (ETS).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(data?.officialSources || []).map((source: any) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-gray-50 hover:bg-teal-50/50 border border-gray-200/80 hover:border-teal-300 transition group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide block mb-1">
                    {source.sourceType}
                  </span>
                  <div className="text-xs font-bold text-navy-950 group-hover:text-teal-700 transition">
                    {source.title}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-500 font-medium group-hover:text-teal-600">
                  <span>Visit Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Report Inaccuracy Modal */}
      {selectedFormatForModal && (
        <TestReportCorrectionModal
          isOpen={!!selectedFormatForModal}
          onClose={() => setSelectedFormatForModal(null)}
          targetType="TEST_FEE"
          feeId={selectedFormatForModal.currentFee?.id}
          itemTitle={`${selectedFormatForModal.name} (${selectedFormatForModal.provider.name})`}
          currentValueSnippet={`Fee: ${
            selectedFormatForModal.currentFee?.currency === 'BDT'
              ? `BDT ${selectedFormatForModal.currentFee?.amount}`
              : `$${selectedFormatForModal.currentFee?.amount} USD`
          }`}
          onSuccess={() => fetchMatrix()}
        />
      )}
    </div>
  );
};
