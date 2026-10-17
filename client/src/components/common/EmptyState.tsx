import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onReset?: () => void;
  actionText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Matching Results Found',
  description = 'Try broadening your search criteria or resetting filters to view all available opportunities.',
  icon: Icon = Search,
  onReset,
  actionText = 'Reset All Filters',
}) => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-500">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-xs font-bold rounded-xl hover:bg-brand-navy-light transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
