import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-5 w-24 bg-slate-200 rounded-full" />
      <div className="h-5 w-16 bg-slate-200 rounded-full" />
    </div>
    <div className="space-y-2">
      <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
      <div className="h-4 w-1/2 bg-slate-100 rounded-md" />
    </div>
    <div className="space-y-1.5 pt-2">
      <div className="h-3 w-full bg-slate-100 rounded" />
      <div className="h-3 w-5/6 bg-slate-100 rounded" />
    </div>
    <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
      <div className="h-8 bg-slate-100 rounded-lg" />
      <div className="h-8 bg-slate-100 rounded-lg" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
    <div className="h-10 bg-slate-100 rounded-lg w-full mb-4" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-b-0">
        <div className="h-4 w-1/4 bg-slate-200 rounded" />
        <div className="h-4 w-1/6 bg-slate-100 rounded" />
        <div className="h-4 w-1/6 bg-slate-100 rounded" />
        <div className="h-4 w-1/4 bg-slate-100 rounded" />
        <div className="h-8 w-20 bg-slate-200 rounded-lg ml-auto" />
      </div>
    ))}
  </div>
);
