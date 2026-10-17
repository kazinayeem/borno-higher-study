import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  Plane,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Info,
  Calendar,
  CreditCard
} from 'lucide-react';
import { getVisaCentres, findVisaCentre, getCountries } from '../services/api';
import { SeoHead } from '../components/common/SeoHead';
import { VisaApplicationCentreItem } from '../types/index';
import { VisaReportCorrectionModal } from '../components/common/VisaReportCorrectionModal';

export const VisaApplicationCentresPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Questionnaire / Matcher state
  const [passportCountry, setPassportCountry] = useState('Bangladesh');
  const [residenceCountry, setResidenceCountry] = useState('Bangladesh');
  const [destinationCountryCode, setDestinationCountryCode] = useState(searchParams.get('country') || 'GB');
  const [visaCategory, setVisaCategory] = useState('Student / Long-Stay Study Visa');
  const [submissionLocation, setSubmissionLocation] = useState('Dhaka, Bangladesh');
  const [intakePeriod, setIntakePeriod] = useState('Autumn 2025 / 2026');

  // Interactive determination result
  const [finderResult, setFinderResult] = useState<{
    mustTravelToIndia: 'NO' | 'YES' | 'POSSIBLY' | 'UNKNOWN';
    reason: string;
    recommendation: string;
    centres: VisaApplicationCentreItem[];
  } | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  // Directory listing state
  const [centres, setCentres] = useState<VisaApplicationCentreItem[]>([]);
  const [indiaFilter, setIndiaFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<any[]>([]);

  // Reporting modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState<VisaApplicationCentreItem | null>(null);

  useEffect(() => {
    loadCountries();
    loadAllCentres();
  }, [indiaFilter]);

  useEffect(() => {
    runMatcher();
  }, [destinationCountryCode, passportCountry, residenceCountry, submissionLocation]);

  const loadCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res.countries || []);
    } catch {
      // Fallback
    }
  };

  const loadAllCentres = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (indiaFilter !== 'ALL') params.mustTravelToIndia = indiaFilter;
      const res = await getVisaCentres(params);
      setCentres(res.centres || []);
    } catch (err) {
      console.error('Failed to load application centres:', err);
    } finally {
      setLoading(false);
    }
  };

  const runMatcher = async () => {
    try {
      setIsMatching(true);
      const res = await findVisaCentre({
        passportCountry,
        residenceCountry,
        destinationCountryCode,
        visaCategory,
        submissionLocation,
        intendedIntakePeriod: intakePeriod,
      });
      setFinderResult(res);
    } catch (err) {
      console.error('Failed to run centre matcher:', err);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <SeoHead
        title="Bangladesh Visa Application Centre & India-Travel Finder | Borno Higher Study"
        description="Check official visa application centres in Dhaka & Sylhet for Bangladeshi students. Verify whether you must travel to India, biometrics locations, and appointment portals."
        canonicalPath="/visa-application-centres"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-navy-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Dedicated Bangladesh Applicant Jurisdiction Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-3xl">
            Bangladesh Visa Application Centres &amp; India-Travel Finder
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Answer 6 simple application questions to determine verified submission centres in Dhaka &amp; Sylhet and receive a legally verified determination: <strong>Must you travel to India for your student visa?</strong>
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Dedicated 6-Question Interactive Finder */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 flex items-center gap-2">
              <Search className="w-5 h-5 text-teal-600" />
              <span>Interactive Jurisdiction &amp; Centre Matcher</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Specify your passport, residence, and study destination to retrieve exact centre locations and diplomatic routing.
            </p>
          </div>

          {/* 6 Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* 1. Passport */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                1. Which passport will you use?
              </label>
              <select
                value={passportCountry}
                onChange={(e) => setPassportCountry(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Bangladesh">Bangladesh (Ordinary Bangladeshi Passport)</option>
                <option value="Other">Other National Passport</option>
              </select>
            </div>

            {/* 2. Residence */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                2. Country of legal residence?
              </label>
              <select
                value={residenceCountry}
                onChange={(e) => setResidenceCountry(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Bangladesh">Bangladesh (Resident in BD)</option>
                <option value="Other">Other Country</option>
              </select>
            </div>

            {/* 3. Destination Country */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                3. Country you want to study in?
              </label>
              <select
                value={destinationCountryCode}
                onChange={(e) => setDestinationCountryCode(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Visa Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                4. Which visa category are you applying for?
              </label>
              <select
                value={visaCategory}
                onChange={(e) => setVisaCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Student / Long-Stay Study Visa">Student / Long-Stay National Study Visa</option>
                <option value="Short-Stay Student / Summer School">Short-Stay Student (&lt; 90 Days)</option>
              </select>
            </div>

            {/* 5. Where will you submit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                5. Where will you submit the application?
              </label>
              <select
                value={submissionLocation}
                onChange={(e) => setSubmissionLocation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Dhaka, Bangladesh">Dhaka, Bangladesh</option>
                <option value="Sylhet, Bangladesh">Sylhet, Bangladesh (where available)</option>
              </select>
            </div>

            {/* 6. Intended Intake Period */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                6. What is your intended application period?
              </label>
              <select
                value={intakePeriod}
                onChange={(e) => setIntakePeriod(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Autumn 2025 / 2026">Autumn Intake (September / October)</option>
                <option value="Spring 2025 / 2026">Spring Intake (January / February)</option>
                <option value="Summer 2025 / 2026">Summer Intake</option>
              </select>
            </div>
          </div>

          {/* Matcher Determination Display */}
          {finderResult && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
              {/* Prominent India Travel Field */}
              <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                finderResult.mustTravelToIndia === 'NO'
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                  : finderResult.mustTravelToIndia === 'YES'
                  ? 'bg-red-50/90 border-red-200 text-red-950'
                  : finderResult.mustTravelToIndia === 'POSSIBLY'
                  ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Determined Travel Requirement
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl sm:text-2xl font-black">
                      Must the applicant travel to India?
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold ${
                      finderResult.mustTravelToIndia === 'NO'
                        ? 'bg-emerald-600 text-white'
                        : finderResult.mustTravelToIndia === 'YES'
                        ? 'bg-red-600 text-white'
                        : finderResult.mustTravelToIndia === 'POSSIBLY'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-600 text-white'
                    }`}>
                      {finderResult.mustTravelToIndia === 'NO'
                        ? 'NO — Eligible Local Route Confirmed'
                        : finderResult.mustTravelToIndia === 'YES'
                        ? 'YES — Travel to New Delhi Required'
                        : finderResult.mustTravelToIndia === 'POSSIBLY'
                        ? 'POSSIBLY — Subject to Quotas & Conditions'
                        : 'UNKNOWN — Official Confirmation Required'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm mt-2 leading-relaxed">
                    <strong>Legal / Operational Reason:</strong> {finderResult.reason}
                  </p>
                  <p className="text-xs mt-1 text-slate-600">
                    <strong>Actionable Advice:</strong> {finderResult.recommendation}
                  </p>
                </div>
              </div>

              {/* Matched Centres for this country */}
              {finderResult.centres && finderResult.centres.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-slate-700">
                    Verified Application Facilities Handling This Route ({finderResult.centres.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {finderResult.centres.map((c) => (
                      <div
                        key={c.id}
                        className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className="font-bold text-sm text-navy-950">{c.centreName}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                              {c.serviceProvider}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 flex items-center gap-1.5 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{c.address}, {c.city}, {c.country}</span>
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-2">
                            <div>• Biometrics: <strong>{c.requiresBiometrics ? 'Yes' : 'No'}</strong></div>
                            <div>• Interview: <strong>{c.requiresInterview ? 'Yes' : 'No'}</strong></div>
                            <div>• Passport in person: <strong>{c.inPersonPassportSubmission ? 'Yes' : 'No'}</strong></div>
                            <div>• Courier return: <strong>{c.courierReturnAvailable ? 'Available' : 'No'}</strong></div>
                          </div>

                          {c.officialEmbassyHandling && (
                            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                              Official Embassy: <strong>{c.officialEmbassyHandling}</strong> ({c.embassyCity})
                            </p>
                          )}
                        </div>

                        <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                          {c.appointmentUrl ? (
                            <a
                              href={c.appointmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 text-[11px]"
                            >
                              <span>Book Official Appointment</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Appointment via Embassy</span>
                          )}

                          <button
                            onClick={() => {
                              setSelectedCentre(c);
                              setModalOpen(true);
                            }}
                            className="text-[11px] text-slate-400 hover:text-amber-600"
                          >
                            Report correction
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Full Directory of Bangladesh Application Centres */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Verified Facility Directory</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                All Verified Bangladesh Application Centres
              </h2>
            </div>

            {/* India Filter buttons */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setIndiaFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  indiaFilter === 'ALL' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setIndiaFilter('NO')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  indiaFilter === 'NO' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Local Only (No India)
              </button>
              <button
                onClick={() => setIndiaFilter('YES')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  indiaFilter === 'YES' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                India Travel Required
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-slate-200/60 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : centres.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80">
              <p className="text-sm font-semibold text-slate-700">No application centres found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {centres.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Destination & India Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Destination Country
                        </span>
                        <h3 className="font-extrabold text-base text-navy-950">
                          {c.destinationCountryName}
                        </h3>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        c.mustTravelToIndia === 'NO'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : c.mustTravelToIndia === 'YES'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        India: {c.mustTravelToIndia}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 mt-1">{c.centreName}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{c.address}, {c.city}</span>
                    </p>

                    {/* Operational Reason */}
                    {c.indiaTravelReason && (
                      <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-800">Operational Rule: </span>
                        {c.indiaTravelReason}
                      </div>
                    )}

                    {/* Check items */}
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 mt-3 pt-2 border-t border-slate-100">
                      <div>Biometrics: <strong>{c.requiresBiometrics ? 'Yes' : 'No'}</strong></div>
                      <div>Interview: <strong>{c.requiresInterview ? 'Yes' : 'No'}</strong></div>
                      <div>Appointment: <strong>{c.requiresAppointment ? 'Mandatory' : 'Walk-in'}</strong></div>
                      <div>Courier: <strong>{c.courierReturnAvailable ? 'Available' : 'In-person'}</strong></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {c.appointmentUrl ? (
                      <a
                        href={c.appointmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 text-[11px]"
                      >
                        <span>Official Booking</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <a
                        href={c.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-teal-600 flex items-center gap-1 text-[11px]"
                      >
                        <span>Official Directive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <button
                      onClick={() => {
                        setSelectedCentre(c);
                        setModalOpen(true);
                      }}
                      className="text-[11px] text-slate-400 hover:text-amber-600 transition-colors"
                    >
                      Report correction
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Report Modal */}
      {selectedCentre && (
        <VisaReportCorrectionModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedCentre(null);
          }}
          targetType={selectedCentre.mustTravelToIndia === 'YES' ? 'INDIA_TRAVEL' : 'CENTRE'}
          countryName={selectedCentre.destinationCountryName}
          itemTitle={`${selectedCentre.centreName} (${selectedCentre.city})`}
          centreId={selectedCentre.id}
        />
      )}
    </div>
  );
};
