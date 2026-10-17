import React, { useState } from 'react';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { CountryCard } from '../components/common/CountryCard.js';
import { Search, Globe, Filter, Sparkles, Compass } from 'lucide-react';

const CONTINENTS = [
  { id: 'all', label: 'All Continents' },
  { id: 'Europe', label: 'Europe' },
  { id: 'North America', label: 'North America' },
  { id: 'Asia', label: 'Asia' },
  { id: 'Oceania', label: 'Oceania' },
  { id: 'South America', label: 'South America' },
  { id: 'Africa', label: 'Africa' },
  { id: 'Antarctica', label: 'Antarctica (Reference)' },
];

export const CountriesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = COUNTRIES_DATA.filter((c) => {
    // Search
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.capitalCity.toLowerCase().includes(search.toLowerCase()) ||
      c.majorCities.some((city) => city.toLowerCase().includes(search.toLowerCase())) ||
      c.region.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Continent
    if (selectedContinent !== 'all' && c.continent !== selectedContinent) {
      return false;
    }

    // Featured toggle (criteria: popular study destination with verified English-medium degrees & visa frameworks)
    if (featuredOnly && !c.isFeatured) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <Compass className="w-4 h-4 text-teal-600" />
            <span>Global Higher Education Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy">
            Explore Countries & Continents
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Discover recognized university systems, compare tuition structures, check post-study work visa rights, and view official government portals across all seven continents.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto relative pt-2">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by country, city, or region (e.g. Germany, Espoo, Tokyo)…"
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 shadow-xs text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Continental Filter & Featured Toggle */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-4">
          {/* Continent Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CONTINENTS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedContinent(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedContinent === item.id
                    ? 'bg-brand-navy text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Transparent Criteria Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Featured Study Abroad Destinations (Selected by verified international student quotas, English-degree pathways & transparent visa frameworks)
              </span>
            </label>

            <span className="text-slate-500 font-medium">
              Showing <strong>{filtered.length}</strong> destinations
            </span>
          </div>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((country) => (
            <CountryCard key={country.slug} country={country as any} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-base">No destinations match your filters</p>
            <p className="text-slate-500 text-xs mt-1">Try clearing your search query or selecting "All Continents".</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedContinent('all');
                setFeaturedOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
