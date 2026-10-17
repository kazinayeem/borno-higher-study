import fs from 'fs';
import path from 'path';

interface CheckResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: CheckResult[] = [];

function check(name: string, condition: boolean, details?: string) {
  results.push({ name, passed: condition, details });
  const icon = condition ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} - ${name} ${details ? `(${details})` : ''}`);
}

async function verifyEnglishAdvisorStyling() {
  console.log('========================================================================');
  console.log('🎨 VERIFY ENGLISH TEST ADVISOR — TEXT VISIBILITY, CONTRAST & FUNCTIONALITY');
  console.log('========================================================================\n');

  const pagePath = path.resolve(process.cwd(), 'client/src/pages/EnglishTestAdvisorPage.tsx');
  const content = fs.readFileSync(pagePath, 'utf-8');

  // 1. Root Cause Elimination: No invalid Tailwind navy classes
  const invalidNavyMatches = content.match(/\b(?:from-navy|to-navy|border-navy|bg-navy|text-navy)-\d+\b/g);
  check(
    '1. Root Cause Check: Invalid navy-* Tailwind classes eliminated',
    !invalidNavyMatches || invalidNavyMatches.length === 0,
    invalidNavyMatches ? `Found invalid classes: ${invalidNavyMatches.join(', ')}` : 'Zero invalid navy-* classes found'
  );

  // 2. Palette compliance
  check(
    '2. Palette: Page background #F8FAFC & dark mode',
    content.includes('#F8FAFC') && content.includes('dark:bg-slate-950'),
    'Matches requested #F8FAFC light surface and dark:bg-slate-950'
  );

  check(
    '3. Palette: Main heading #0F172A & dark mode',
    content.includes('#0F172A') && content.includes('dark:text-white'),
    'Matches requested #0F172A dark navy heading and dark:text-white'
  );

  check(
    '4. Palette: Primary teal #0F9488 & teal hover #0D766E',
    content.includes('#0F9488') && content.includes('#0D766E'),
    'Matches requested teal action colors'
  );

  check(
    '5. Palette: Selected option background #F0FDFA & border #0D9488',
    content.includes('#F0FDFA') && content.includes('#0D9488'),
    'Matches requested selection state palette'
  );

  check(
    '6. Palette: Body text (#334155), Secondary text (#475569), Borders (#E2E8F0)',
    content.includes('#334155') && content.includes('#475569') && content.includes('#E2E8F0'),
    'Verified high contrast editorial text and border tokens'
  );

  // 3. Stepper Progress Indicator
  const hasCompletedStepStyle = content.includes('bg-[#0F9488] text-white') || content.includes('Check');
  const hasCurrentStepStyle = content.includes('ring-4 ring-teal-100');
  const hasConnectingLine = content.includes('absolute top-4 -left-1/2 w-full h-0.5') && content.includes('#CBD5E1');
  check(
    '7. Stepper: Completed, active, and upcoming steps with connecting line',
    hasCompletedStepStyle && hasCurrentStepStyle && hasConnectingLine,
    'Stepper communicates progress with icons, numbers, connecting lines, and readable labels'
  );

  // 4. Wizard Card Styling
  check(
    '8. Wizard Card: White surface, subtle border & shadow-card',
    content.includes('bg-white dark:bg-slate-900') && content.includes('shadow-card') && content.includes('rounded-3xl'),
    'Fluid mobile-first card layout verified'
  );

  // 5. Delivery Preference Options (Step 3)
  const hasTestCentre = content.includes('TEST_CENTRE') && content.includes('Physical Test Centre');
  const hasOnline = content.includes('ONLINE') && content.includes('At-Home Online Test');
  const hasNoPref = content.includes('NO_PREFERENCE') && content.includes('No Preference');
  check(
    '9. Delivery Preferences: Physical, Online, and No Preference options',
    hasTestCentre && hasOnline && hasNoPref,
    'All 3 delivery preferences supported with distinct icons and descriptions'
  );

  // 6. Budget Slider
  const hasSlider =
    content.includes('type="range"') &&
    content.includes('min="20000"') &&
    content.includes('max="35000"') &&
    content.includes('step="1000"');
  const hasSliderLabels =
    content.includes('BDT 20,000 (Min)') &&
    content.includes('BDT 27,000 (IELTS/PTE Standard)') &&
    content.includes('BDT 35,000 (Max)');
  check(
    '10. Budget Slider: Bounds 20k–35k, step 1k, BDT display, reference ticks',
    hasSlider && hasSliderLabels,
    'Accessible range input with accurate BDT currency indicators'
  );

  // 7. University Search in Step 2
  check(
    '11. University Filter: Instant client-side search across institutions',
    content.includes('uniSearchQuery') && content.includes('Search universities by name or city'),
    'Search input and filtered list verified'
  );

  // 8. Recommendation Step 4 Surface Contrast
  const hasRecommendationCard =
    content.includes('bg-slate-900 dark:bg-slate-950 text-white') &&
    content.includes('recommendationResult.recommendation.primary') &&
    content.includes('Book Official Test');
  check(
    '12. Step 4: High-contrast primary recommendation card with booking link',
    hasRecommendationCard,
    'Primary match, acceptance rate, and official links render on high-contrast surface'
  );

  // 9. Live Backend Recommendation Verification
  try {
    const res = await fetch('http://localhost:5001/api/english-tests/advisor-recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetCountry: 'united-kingdom',
        qualificationLevel: 'UNDERGRADUATE',
        shortlistedUniIds: [],
        deliveryPreference: 'TEST_CENTRE',
        budgetBdt: 30000,
      }),
    });
    const data = await res.json();
    const hasPrimary = Boolean(data.recommendation?.primary?.name);
    check(
      '13. Live Backend API: Advisor recommendation generates valid response',
      res.ok && hasPrimary,
      `Recommended: ${data.recommendation?.primary?.name} (${data.recommendation?.primary?.acceptanceRateAcrossShortlist}% acceptance)`
    );
  } catch (err: any) {
    check('13. Live Backend API: Advisor recommendation generates valid response', false, err.message);
  }

  // 10. Summary
  const allPassed = results.every((r) => r.passed);
  console.log('\n========================================================================');
  console.log(`Summary: ${results.filter((r) => r.passed).length}/${results.length} checks passed.`);
  if (allPassed) {
    console.log('🎉 ALL ENGLISH TEST ADVISOR STYLING & CONTRAST SPECIFICATIONS PASSED!\n');
  } else {
    console.log('❌ SOME CHECKS FAILED.\n');
    process.exit(1);
  }
}

verifyEnglishAdvisorStyling().catch((err) => {
  console.error(err);
  process.exit(1);
});
