import React, { useRef, useEffect } from 'react';
import { gsap, isReducedMotion, MOTION_DURATIONS, MOTION_EASE } from '../../utils/motion.js';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  id,
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_DURATIONS.entrance,
          ease: MOTION_EASE.editorial,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
          clearProps: 'transform',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id={id} className={className}>
      {children}
    </section>
  );
};
