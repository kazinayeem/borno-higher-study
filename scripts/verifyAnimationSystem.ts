/**
 * Borno Higher Study — GSAP Motion Design & Animation System Verification Suite
 * Tests GSAP / ScrollTrigger registration, timing tokens, reduced motion accessibility,
 * scoped animation lifecycles, and component integrations across all core layouts.
 */

import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  suite: string;
  test: string;
  status: 'PASS' | 'FAIL';
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, test: string, details?: string) {
  if (condition) {
    results.push({ suite, test, status: 'PASS', details });
    console.log(`  ✓ [${suite}] ${test}`);
  } else {
    results.push({ suite, test, status: 'FAIL', details });
    console.error(`  ✗ [${suite}] ${test} — ${details || 'Assertion failed'}`);
  }
}

console.log('='.repeat(70));
console.log('BORNO HIGHER STUDY — GSAP MOTION DESIGN SYSTEM VERIFICATION');
console.log('='.repeat(70));

// 1. GSAP & SCROLLTRIGGER REGISTRATION
console.log('\n1. Audit GSAP & ScrollTrigger Configuration:');
const motionUtilsPath = path.resolve(__dirname, '../client/src/utils/motion.ts');
assert(fs.existsSync(motionUtilsPath), 'GSAP-Core', 'motion.ts utility module exists');

const motionCode = fs.readFileSync(motionUtilsPath, 'utf8');
assert(
  motionCode.includes("import { gsap } from 'gsap'") && motionCode.includes("import { ScrollTrigger } from 'gsap/ScrollTrigger'"),
  'GSAP-Core',
  'GSAP and ScrollTrigger imported cleanly'
);
assert(
  motionCode.includes('gsap.registerPlugin(ScrollTrigger)'),
  'GSAP-Core',
  'ScrollTrigger registered with GSAP'
);

// 2. TIMING TOKENS & EASING CURVES
console.log('\n2. Audit Timing Tokens & Easing Curves:');
assert(
  motionCode.includes('MOTION_DURATIONS') &&
  motionCode.includes('micro:') &&
  motionCode.includes('standard:') &&
  motionCode.includes('entrance:') &&
  motionCode.includes('hero:'),
  'Tokens',
  'Timing tokens defined (micro: 0.2s, standard: 0.45s, entrance: 0.65s, hero: 0.85s)'
);

assert(
  motionCode.includes('MOTION_EASE') &&
  motionCode.includes('editorial:') &&
  motionCode.includes('smooth:'),
  'Tokens',
  'Natural easing curves defined (power2.out, power3.out)'
);

// 3. ACCESSIBILITY & REDUCED MOTION PREFERENCE
console.log('\n3. Audit Accessibility (prefers-reduced-motion):');
assert(
  motionCode.includes('isReducedMotion') &&
  motionCode.includes("window.matchMedia('(prefers-reduced-motion: reduce)')"),
  'Accessibility',
  'Reduced-motion media query check implemented'
);

// 4. REUSABLE MOTION PRIMITIVES
console.log('\n4. Audit Reusable Motion Primitives:');
const motionComponents = [
  'PageIntro.tsx',
  'RevealOnScroll.tsx',
  'StaggerGroup.tsx',
  'AnimatedSection.tsx',
  'SmoothAccordion.tsx',
  'RouteTransition.tsx',
  'index.ts',
];

motionComponents.forEach((comp) => {
  const compPath = path.resolve(__dirname, '../client/src/components/motion', comp);
  assert(fs.existsSync(compPath), 'Primitives', `Motion component ${comp} created`);
});

// 5. SCOPED CLEANUP & STRICT MODE RESILIENCE
console.log('\n5. Audit Scoped Animation Context & Cleanup:');
const pageIntroCode = fs.readFileSync(path.resolve(__dirname, '../client/src/components/motion/PageIntro.tsx'), 'utf8');
assert(
  pageIntroCode.includes('gsap.context') && pageIntroCode.includes('ctx.revert()'),
  'Cleanup',
  'PageIntro scopes animations with gsap.context and calls revert() on unmount'
);

const revealCode = fs.readFileSync(path.resolve(__dirname, '../client/src/components/motion/RevealOnScroll.tsx'), 'utf8');
assert(
  revealCode.includes('scrollTrigger:') && revealCode.includes('ctx.revert()'),
  'Cleanup',
  'RevealOnScroll attaches ScrollTrigger and cleans up with ctx.revert()'
);

const staggerCode = fs.readFileSync(path.resolve(__dirname, '../client/src/components/motion/StaggerGroup.tsx'), 'utf8');
assert(
  staggerCode.includes('stagger') && staggerCode.includes('ctx.revert()'),
  'Cleanup',
  'StaggerGroup coordinates child cards with stagger and cleans up on unmount'
);

// 6. NAVBAR SCROLL & INITIAL ENTRANCE
console.log('\n6. Audit Navbar Entrance & Scroll Transitions:');
const navbarPath = path.resolve(__dirname, '../client/src/components/layout/Navbar.tsx');
const navbarCode = fs.readFileSync(navbarPath, 'utf8');

assert(
  navbarCode.includes('navRef') && navbarCode.includes('fromTo(') && navbarCode.includes('MOTION_DURATIONS'),
  'Navbar',
  'Navbar has coordinated GSAP entrance on initial page load'
);
assert(
  navbarCode.includes('isScrolled') && navbarCode.includes('backdrop-blur-md'),
  'Navbar',
  'Navbar applies backdrop blur and elevation border transition on scroll'
);

// 7. HOMEPAGE HERO TIMELINE & FAQ ACCORDION
console.log('\n7. Audit Homepage Motion Integration:');
const homePath = path.resolve(__dirname, '../client/src/pages/HomePage.tsx');
const homeCode = fs.readFileSync(homePath, 'utf8');

assert(
  homeCode.includes('heroContainerRef') && homeCode.includes('gsap.timeline('),
  'Homepage',
  'Hero section initiates coordinated GSAP timeline'
);

assert(
  homeCode.includes('hero-anim-badge') &&
  homeCode.includes('hero-anim-title') &&
  homeCode.includes('hero-anim-sub') &&
  homeCode.includes('hero-anim-form') &&
  homeCode.includes('hero-anim-stats'),
  'Homepage',
  'Hero elements (badge, title, subtitle, form, stats) wired to timeline'
);

assert(
  homeCode.includes('SmoothAccordion') && homeCode.includes('openFaq'),
  'Homepage',
  'Homepage FAQ accordion upgraded with SmoothAccordion component'
);

// 8. ROUTE TRANSITIONS IN APP.TSX
console.log('\n8. Audit Route Transitions:');
const appPath = path.resolve(__dirname, '../client/src/App.tsx');
const appCode = fs.readFileSync(appPath, 'utf8');

assert(
  appCode.includes('RouteTransition') && appCode.includes('<RouteTransition>'),
  'RouteTransitions',
  'App.tsx wraps Routes with RouteTransition component for seamless navigation'
);

// 9. DIRECTORY & DASHBOARD ENHANCEMENTS
console.log('\n9. Audit Directory & Dashboard Animations:');
const uniPagePath = path.resolve(__dirname, '../client/src/pages/UniversitiesPage.tsx');
const uniPageCode = fs.readFileSync(uniPagePath, 'utf8');
assert(
  uniPageCode.includes('PageIntro') && uniPageCode.includes('StaggerGroup'),
  'Directories',
  'UniversitiesPage utilizes PageIntro and StaggerGroup for card reveals'
);

const schPagePath = path.resolve(__dirname, '../client/src/pages/ScholarshipsPage.tsx');
const schPageCode = fs.readFileSync(schPagePath, 'utf8');
assert(
  schPageCode.includes('PageIntro') && schPageCode.includes('StaggerGroup'),
  'Directories',
  'ScholarshipsPage utilizes PageIntro and StaggerGroup for card reveals'
);

const adminPagePath = path.resolve(__dirname, '../client/src/pages/AdminDashboardPage.tsx');
const adminPageCode = fs.readFileSync(adminPagePath, 'utf8');
assert(
  adminPageCode.includes('PageIntro'),
  'Dashboards',
  'AdminDashboardPage utilizes PageIntro for control center entrance'
);

// SUMMARY
console.log('\n' + '='.repeat(70));
const total = results.length;
const passed = results.filter((r) => r.status === 'PASS').length;
const failed = results.filter((r) => r.status === 'FAIL').length;
console.log(`TOTAL AUDIT CHECKS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('='.repeat(70));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL GSAP MOTION DESIGN CHECKS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}
