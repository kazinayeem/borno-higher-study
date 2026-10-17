import React from 'react';
import { Link } from 'react-router-dom';
import { Country } from '../../types/index.js';
import { MapPin, Coins, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';

interface CountryCardProps {
  country: Country;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  return (
    <Link
      to={`/countries/${country.slug}`}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-teal-400/80 transition-all duration-300 flex flex-col overflow-hidden"
    >
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
              {country.flagEmoji}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
              {country.code}
            </span>
          </div>

          <h3 className="text-xl font-bold text-brand-navy group-hover:text-teal-600 transition-colors">
            {country.name}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Capital: {country.capitalCity}
          </p>

          <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
            {country.overview}
          </p>
        </div>

        {/* Financial & Visa Highlights */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              Avg Living Cost:
            </span>
            <span className="font-semibold text-slate-800">
              ~{country.currencySymbol}{country.avgLivingCostMonthly}/mo
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
              Annual Tuition:
            </span>
            <span className="font-semibold text-teal-700">
              {country.currencySymbol}{country.avgTuitionMin.toLocaleString()} – {country.avgTuitionMax.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-slate-50/80 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:bg-teal-50/80 transition-colors">
        <span>Explore Universities & Visas</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
