import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSaved } from '../context/SavedContext.js';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';
import { UniversityCard } from '../components/common/UniversityCard.js';
import { ScholarshipCard } from '../components/common/ScholarshipCard.js';
import { Bookmark, GraduationCap, Award, ArrowRight } from 'lucide-react';

export const SavedItemsPage: React.FC = () => {
  const { savedUniversityIds, savedScholarshipIds } = useSaved();
  const [activeTab, setActiveTab] = useState<'universities' | 'scholarships'>('universities');

  const savedUnis = savedUniversityIds
    .map((id) => UNIVERSITIES_DATA.find((u) => u.id === id))
    .filter(Boolean) as typeof UNIVERSITIES_DATA;

  const savedSchs = savedScholarshipIds
    .map((id) => SCHOLARSHIPS_DATA.find((s) => s.id === id))
    .filter(Boolean) as typeof SCHOLARSHIPS_DATA;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <Bookmark className="w-4 h-4 text-teal-600" />
            <span>Student Bookmarks</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-navy mt-1">
            Saved Universities & Scholarships
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Access your curated list of target institutions and verified funding opportunities.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('universities')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'universities'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Saved Universities ({savedUnis.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scholarships')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'scholarships'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Saved Scholarships ({savedSchs.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'universities' && (
          <div>
            {savedUnis.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedUnis.map((uni) => (
                  <UniversityCard key={uni.id} university={uni} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No Saved Universities Yet</h3>
                <p className="text-xs text-slate-500">
                  Bookmark institutions while browsing our catalog to keep track of deadlines.
                </p>
                <Link
                  to="/universities"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold"
                >
                  <span>Browse Universities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scholarships' && (
          <div>
            {savedSchs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedSchs.map((sch) => (
                  <ScholarshipCard key={sch.id} scholarship={sch} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <Award className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No Saved Scholarships Yet</h3>
                <p className="text-xs text-slate-500">
                  Save scholarships from our finder to monitor closing dates.
                </p>
                <Link
                  to="/scholarships"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  <span>Explore Scholarships</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
