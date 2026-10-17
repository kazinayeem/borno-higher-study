import React, { useRef, useEffect } from 'react';
import { gsap, isReducedMotion, MOTION_DURATIONS, MOTION_EASE } from '../../utils/motion.js';

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  itemSelector?: string; // default to direct children
  stagger?: number;
  yOffset?: number;
  threshold?: string;
}

export const StaggerGroup: React.FC<StaggerGroupProps> = ({
  children,
  className = '',
  itemSelector = ':scope > *',
  stagger = 0.06,
  yOffset = 14,
  threshold = 'top 90%',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const items = container.querySelectorAll(itemSelector);
      if (!items.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: yOffset },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_DURATIONS.standard,
          stagger,
          ease: MOTION_EASE.smooth,
          scrollTrigger: {
            trigger: container,
            start: threshold,
            once: true,
          },
          clearProps: 'transform',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [itemSelector, stagger, yOffset, threshold]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
