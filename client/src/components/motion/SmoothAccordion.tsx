import React, { useRef, useEffect } from 'react';
import { gsap, isReducedMotion, MOTION_DURATIONS, MOTION_EASE } from '../../utils/motion.js';

interface SmoothAccordionProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SmoothAccordion: React.FC<SmoothAccordionProps> = ({
  isOpen,
  children,
  className = '',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isReducedMotion()) {
      el.style.height = isOpen ? 'auto' : '0px';
      el.style.opacity = isOpen ? '1' : '0';
      el.style.overflow = isOpen ? 'visible' : 'hidden';
      return;
    }

    if (isOpen) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: MOTION_DURATIONS.standard,
          ease: MOTION_EASE.smooth,
          onComplete: () => {
            el.style.height = 'auto';
            el.style.overflow = 'visible';
          },
        }
      );
    } else {
      el.style.overflow = 'hidden';
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: MOTION_DURATIONS.fast,
        ease: MOTION_EASE.smooth,
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      className={`overflow-hidden ${className}`}
      style={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
    >
      {children}
    </div>
  );
};
