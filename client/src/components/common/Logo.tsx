import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  compact?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'auto', compact = false, className = '' }) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 group transition-transform ${className}`}>
      {/* Dynamic SVG Icon */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="logoGlobeGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#0B192C" />
            </linearGradient>
            <linearGradient id="logoGoldGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Globe */}
          <circle cx="50" cy="50" r="44" fill="url(#logoGlobeGrad)" />
          <circle cx="50" cy="50" r="44" stroke="#14B8A6" strokeWidth="2" strokeOpacity="0.5" />
          <ellipse cx="50" cy="50" rx="44" ry="18" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.25" fill="none" />
          <ellipse cx="50" cy="50" rx="18" ry="44" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.25" fill="none" />

          {/* Open Book */}
          <path d="M26 68 C34 65, 45 65, 50 69 C55 65, 66 65, 74 68 L74 54 C66 51, 55 51, 50 55 C45 51, 34 51, 26 54 Z" fill="#FFFFFF" />
          <path d="M50 55 L50 69" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Graduation Cap */}
          <polygon points="50,22 76,32 50,42 24,32" fill="url(#logoGoldGrad)" />
          <polygon points="50,22 76,32 50,42 24,32" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M34 36.5 L34 46 C34 51 66 51 66 46 L66 36.5" fill="#B45309" stroke="#92400E" strokeWidth="1" />
          <path d="M68 35 C70 41, 72 45, 71 49" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="71" cy="50" r="2" fill="#FEF08A" />

          {/* Flight Path & Plane Motif */}
          <path d="M15 75 Q 35 15, 84 25" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="4,3" strokeLinecap="round" opacity="0.85" />
          <g transform="translate(84, 25) rotate(22)">
            <path d="M0 -6 L5 4 L0 2 L-5 4 Z" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Brand Wordmark */}
      {!compact && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span
              className={`font-heading font-extrabold text-base sm:text-lg tracking-tight leading-none ${
                variant === 'dark' ? 'text-white' : 'text-brand-navy dark:text-white'
              }`}
            >
              BORNO
            </span>
            <span className="font-heading font-semibold text-base sm:text-lg text-teal-700 dark:text-teal-400 leading-none">
              HIGHER STUDY
            </span>
          </div>
          <span
            className={`text-[9px] uppercase font-semibold tracking-wider whitespace-nowrap mt-0.5 hidden 2xl:block ${
              variant === 'dark' ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Education Research &amp; Admissions
          </span>
        </div>
      )}
    </Link>
  );
};
