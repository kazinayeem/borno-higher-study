import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger, isReducedMotion, MOTION_DURATIONS, MOTION_EASE } from '../../utils/motion.js';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  delay?: number;
  threshold?: string; // e.g., 'top 85%'
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  yOffset = 16,
  delay = 0,
  threshold = 'top 88%',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: yOffset },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_DURATIONS.entrance,
          delay,
          ease: MOTION_EASE.editorial,
          scrollTrigger: {
            trigger: el,
            start: threshold,
            once: true,
          },
          clearProps: 'transform',
        }
      );
    }, elementRef);

    return () => ctx.revert();
  }, [yOffset, delay, threshold]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};
