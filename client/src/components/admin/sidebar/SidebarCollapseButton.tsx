import React from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

interface SidebarCollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export const SidebarCollapseButton: React.FC<SidebarCollapseButtonProps> = ({
  isCollapsed,
  onToggle,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
      className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-500 ${className}`}
    >
      {isCollapsed ? (
        <ChevronsRight className="w-4 h-4" />
      ) : (
        <ChevronsLeft className="w-4 h-4" />
      )}
    </button>
  );
};
