import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Bell,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building,
  Globe2,
  Share2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getVisaUpdates, getCountries } from '../services/api';
import { SeoHead } from '../components/common/SeoHead';
import { OfficialSocialUpdateItem } from '../types/index';

export const VisaUpdatesPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [countryCode, setCountryCode] = useState(searchParams.get('country') || 'ALL');
  const [platform, setPlatform] = useState(searchParams.get('platform') || 'ALL');
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<OfficialSocialUpdateItem[]>([]);
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    loadCountries();
    loadUpdates();
  }, [countryCode, platform]);

  const loadCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res.countries || []);
    } catch {
      // Fallback
    }
  };

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (countryCode !== 'ALL') params.destinationCountryCode = countryCode;
      if (platform !== 'ALL') params.platform = platform;
      const res = await getVisaUpdates(params);
      setUpdates(res.updates || []);
    } catch (err) {
      console.error('Failed to load visa updates:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUpdates = updates.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.title.toLowerCase().includes(q) ||
      u.summary.toLowerCase().includes(q) ||
      u.publisher.toLowerCase().includes(q) ||
      u.topic.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <SeoHead
        title="Official Embassy & Student Visa Social Updates | Borno Higher Study"
        description="Public visa and immigration announcements from verified High Commissions, Embassies, and National Immigration Portals in Bangladesh. Track CAS/I-20, visa appointments, and biometrics rules."
        canonicalPath="/visa-updates"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-navy-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <Bell className="w-3.5 h-3.5" />
            <span>Permitted Public Diplomatic Channels</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-3xl">
            Official Embassy &amp; Immigration Social Bulletins
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Directly monitoring verified public statements from High Commissions and Embassies in Dhaka. We strictly distinguish authorized government announcements from agent promotions, rumor pages, and unofficial student groups.
          </p>

          <div className="mt-6 p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 max-w-2xl">
            <span className="font-bold text-teal-300">Editorial Policy: </span>
            Social updates serve as advisory notices. They never automatically overwrite underlying statutory immigration rules or certified statistical tables without administrator verification.
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Country</label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">All Destination Countries</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">All Platforms</option>
                <option value="FACEBOOK">Official Facebook Page</option>
                <option value="TWITTER">X / Twitter</option>
                <option value="OFFICIAL_PORTAL">Official Government Portal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Filter Keywords</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Appointment, Slot, Biometrics..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Updates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-slate-200/60 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredUpdates.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No updates matching current filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUpdates.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {u.platform} • {u.topic}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Published: {new Date(u.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-950 mb-2">
                    {u.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {u.summary}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{u.publisher}</span>
                    {u.destinationCountryName && (
                      <span className="text-slate-400">({u.destinationCountryName})</span>
                    )}
                  </div>

                  <a
                    href={u.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 text-[11px]"
                  >
                    <span>View original announcement</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
