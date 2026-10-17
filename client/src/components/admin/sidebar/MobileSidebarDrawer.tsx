import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { ADMIN_NAV_GROUPS, AdminNavItem } from './adminNavConfig.js';
import { AdminNavigationGroup } from './AdminNavigationGroup.js';
import { AdminSidebarFooter } from './AdminSidebarFooter.js';

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeItemId: string;
  userRole?: string;
  badgeCounts: {
    applications?: number;
    pendingPosts?: number;
    docQueue?: number;
  };
  onSelectItem: (item: AdminNavItem) => void;
  triggerButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export const MobileSidebarDrawer: React.FC<MobileSidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeItemId,
  userRole = 'SUPER_ADMIN',
  badgeCounts,
  onSelectItem,
  triggerButtonRef,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        triggerButtonRef?.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, triggerButtonRef]);

  if (!isOpen) return null;

  const handleSelectAndClose = (item: AdminNavItem) => {
    onSelectItem(item);
    onClose();
    triggerButtonRef?.current?.focus();
  };

  return (
    <div
      className="fixed inset-0 z-50 md:hidden flex"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div
        ref={drawerRef}
        className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250 ease-out"
      >
        {/* Top Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-teal-800 dark:bg-teal-700 flex items-center justify-center text-white font-heading font-black text-lg shrink-0 shadow-xs">
              ব
            </div>
            <div className="min-w-0">
              <span className="font-heading font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate block">
                Borno Higher Study
              </span>
              <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 dark:text-teal-400">
                <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span className="tracking-wider uppercase">{userRole.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {ADMIN_NAV_GROUPS.map((group) => (
            <AdminNavigationGroup
              key={group.id}
              group={group}
              activeItemId={activeItemId}
              isCollapsed={false}
              userRole={userRole}
              badgeCounts={badgeCounts}
              onSelectItem={handleSelectAndClose}
            />
          ))}
        </nav>

        {/* Pinned Footer */}
        <AdminSidebarFooter isCollapsed={false} />
      </div>
    </div>
  );
};
