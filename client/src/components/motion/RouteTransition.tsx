import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, isReducedMotion, MOTION_DURATIONS, MOTION_EASE } from '../../utils/motion.js';

interface RouteTransitionProps {
  children: React.ReactNode;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || isReducedMotion()) return;

    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { opacity: 0.88, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_DURATIONS.fast,
          ease: MOTION_EASE.smooth,
          clearProps: 'transform,opacity',
        }
      );
    }, nodeRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return <div ref={nodeRef}>{children}</div>;
};
