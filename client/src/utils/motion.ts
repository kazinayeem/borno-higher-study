/**
 * Borno Higher Study — Motion Design System Tokens & GSAP Core
 * Production-ready animation primitives, timing curves, reduced motion detection,
 * and scoped cleanup utilities.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Global Timing Tokens (in seconds for GSAP)
 */
export const MOTION_DURATIONS = {
  micro: 0.2,      // Tooltips, badges, buttons, toggles
  fast: 0.3,       // Dropdowns, popovers, tabs
  standard: 0.45,  // Cards, drawer panels, accordions
  entrance: 0.65,  // Section headers, modals, route intro
  hero: 0.85,      // Hero typography and coordinated timelines
} as const;

/**
 * Natural Easing Curves
 */
export const MOTION_EASE = {
  smooth: 'power2.out',
  editorial: 'power3.out',
  subtle: 'sine.out',
  sharp: 'power2.inOut',
  expo: 'expo.out',
} as const;

/**
 * Detect User's Reduced Motion Accessibility Preference
 */
export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Safe GSAP Context Wrapper with automatic cleanup on unmount
 */
export const createScopedAnimation = (
  scope: React.RefObject<HTMLElement | null>,
  animationFn: (ctx: gsap.Context) => void
): (() => void) => {
  if (typeof window === 'undefined' || !scope.current) {
    return () => {};
  }

  const ctx = gsap.context(() => {
    if (!isReducedMotion()) {
      animationFn(ctx);
    }
  }, scope);

  return () => ctx.revert();
};

/**
 * Standard Subtle Reveal Timeline
 */
export const revealTimeline = (
  targets: gsap.TweenTarget,
  options?: {
    y?: number;
    delay?: number;
    duration?: number;
    stagger?: number;
    scrollTriggerElement?: Element | null;
  }
) => {
  if (isReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }

  const yOffset = options?.y ?? 14;
  const duration = options?.duration ?? MOTION_DURATIONS.entrance;
  const stagger = options?.stagger ?? 0.08;
  const delay = options?.delay ?? 0;

  const tweenVars: gsap.TweenVars = {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    delay,
    ease: MOTION_EASE.editorial,
  };

  if (options?.scrollTriggerElement) {
    tweenVars.scrollTrigger = {
      trigger: options.scrollTriggerElement,
      start: 'top 85%',
      once: true,
    };
  }

  gsap.fromTo(targets, { opacity: 0, y: yOffset }, tweenVars);
};

export { gsap, ScrollTrigger };
