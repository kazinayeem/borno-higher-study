import React, { useRef, useEffect } from 'react';
import { gsap, isReducedMotion, MOTION_DURATIONS, MOTION_EASE } from '../../utils/motion.js';

interface PageIntroProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const PageIntro: React.FC<PageIntroProps> = ({ children, className = '', delay = 0.05 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_DURATIONS.entrance,
          delay,
          ease: MOTION_EASE.editorial,
          clearProps: 'transform',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
