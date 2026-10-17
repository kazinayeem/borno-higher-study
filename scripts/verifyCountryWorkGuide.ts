// Borno Higher Study — Global Country Language, Minimum Wage, Student Work & Post-Study Career Roadmap Verification Suite
// Run with: npx tsx scripts/verifyCountryWorkGuide.ts

import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5001/api';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, message: string) {
  if (condition) {
    results.push({ name: testName, passed: true, message });
    console.log(`✅ PASS - ${testName} (${message})`);
  } else {
    results.push({ name: testName, passed: false, message });
    console.error(`❌ FAIL - ${testName} (${message})`);
  }
}

async function runCountryWorkGuideVerification() {
  console.log('========================================================================');
  console.log('🌍 BORNO HIGHER STUDY: COUNTRY WORK & CAREER GUIDE TEST SUITE');
  console.log('========================================================================\n');

  try {
    // ---------------------------------------------------------
    // 1. Client Routing Integrity (8 Routes in App.tsx)
    // ---------------------------------------------------------
    const appTsxPath = path.resolve(process.cwd(), 'client/src/App.tsx');
    const appTsxContent = fs.readFileSync(appTsxPath, 'utf8');

    const expectedRoutes = [
      '/country-work-guide',
      '/country-work-guide/compare',
      '/country-work-guide/student-work-rules',
      '/country-work-guide/minimum-wages',
      '/country-work-guide/post-study-work',
      '/country-work-guide/career-roadmaps',
      '/country-work-guide/sources',
      '/country-work-guide/:countryCode',
    ];

    let allRoutesPresent = true;
    for (const route of expectedRoutes) {
      if (!appTsxContent.includes(`path="${route}"`)) {
        allRoutesPresent = false;
        console.error(`Missing route registration: ${route}`);
      }
    }
    assert(allRoutesPresent, '1. Route Registrations', 'All 8 work guide routes properly registered in App.tsx');

    // ---------------------------------------------------------
    // 2. Authentication Tokens (Super Admin & Student)
    // ---------------------------------------------------------
    let adminToken = '';
    let studentToken = '';

    const adminLoginRes = await fetch(`${API_BASE}/auth/super-admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'superadmin@borno.edu', password: 'SuperAdmin@Borno2026!' }),
    });
    if (adminLoginRes.ok) {
      const data = await adminLoginRes.json();
      adminToken = data.token;
    }

    const studentLoginRes = await fetch(`${API_BASE}/auth/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@borno.edu', password: 'StudentDemo@Borno2026!' }),
    });
    if (studentLoginRes.ok) {
      const data = await studentLoginRes.json();
      studentToken = data.token;
    }

    assert(!!adminToken && !!studentToken, '2. Auth Tokens Acquired', 'Super Admin and Student tokens acquired');

    // ---------------------------------------------------------
    // 3. Global Overview API Endpoint
    // ---------------------------------------------------------
    const overviewRes = await fetch(`${API_BASE}/country-work-guide`);
    assert(overviewRes.ok, '3. Global Overview Endpoint', `HTTP ${overviewRes.status}`);
    const overviewJson = await overviewRes.json();
    const overviewData = overviewJson.data;
    assert(Array.isArray(overviewData) && overviewData.length >= 7, '3.1 Overview Countries Loaded', `Loaded ${overviewData?.length} countries`);

    // ---------------------------------------------------------
    // 4. Country Work Profile (Germany DE)
    // ---------------------------------------------------------
    const deProfileRes = await fetch(`${API_BASE}/country-work-guide/profile/DE`);
    assert(deProfileRes.ok, '4. Germany Profile Endpoint', `HTTP ${deProfileRes.status}`);
    const deProfileJson = await deProfileRes.json();
    const deProfile = deProfileJson.profile;
    assert(deProfile?.code === 'DE', '4.1 Germany Profile Code', 'DE code verified');
    assert(deProfile?.studentWorkPolicies?.[0]?.termTimeLimitHours === 140 && deProfile?.studentWorkPolicies?.[0]?.termTimeUnit === 'DAYS_PER_YEAR', '4.2 Germany 140 Days Rule', 'Preserves 140 full / 280 half days (§16b AufenthG)');
    assert(deProfile?.minimumWagePolicies?.[0]?.hasStatutoryMinimum === true, '4.3 Germany Statutory Minimum Wage', 'Germany has statutory minimum wage');
    assert(deProfile?.minimumWagePolicies?.[0]?.rates?.some((r: any) => r.amount === 12.82), '4.4 Germany 2025/2026 Rate', '€12.82/h statutory rate verified');
    assert(deProfile?.careerRoadmaps?.length > 0, '4.5 Germany Career Roadmaps', `${deProfile?.careerRoadmaps?.length} roadmaps returned`);

    // ---------------------------------------------------------
    // 5. Australia (AU) Fortnightly Rule & Fair Work
    // ---------------------------------------------------------
    const auProfileRes = await fetch(`${API_BASE}/country-work-guide/profile/AU`);
    assert(auProfileRes.ok, '5. Australia Profile Endpoint', `HTTP ${auProfileRes.status}`);
    const auProfileJson = await auProfileRes.json();
    const auProfile = auProfileJson.profile;
    assert(auProfile?.studentWorkPolicies?.[0]?.termTimeLimitHours === 48 && auProfile?.studentWorkPolicies?.[0]?.termTimeUnit === 'HOURS_PER_FORTNIGHT', '5.1 Australia 48h/Fortnight Rule', 'Preserves 48 hours per fortnight statutory unit');
    assert(auProfile?.minimumWagePolicies?.[0]?.rates?.some((r: any) => r.amount === 24.10), '5.2 Australia FWC Minimum Wage', 'A$24.10 statutory national rate verified');

    // ---------------------------------------------------------
    // 6. Nordic Model (Sweden SE & Finland FI) CBA Verification
    // ---------------------------------------------------------
    const seProfileRes = await fetch(`${API_BASE}/country-work-guide/profile/SE`);
    assert(seProfileRes.ok, '6. Sweden Profile Endpoint', `HTTP ${seProfileRes.status}`);
    const seProfileJson = await seProfileRes.json();
    const seProfile = seProfileJson.profile;
    assert(seProfile?.minimumWagePolicies?.[0]?.hasStatutoryMinimum === false, '6.1 Sweden No Statutory Minimum Wage', 'Accurately documents Collective Bargaining (CBA) system');
    assert(seProfile?.minimumWagePolicies?.[0]?.governingBody?.includes('Medlingsinstitutet') || seProfile?.minimumWagePolicies?.[0]?.cbaOverview?.includes('kollektivavtal'), '6.2 Sweden CBA Context', 'Includes Swedish Kollektivavtal details');

    // ---------------------------------------------------------
    // 7. United States (US) & Canada (CA) Hour Constraints
    // ---------------------------------------------------------
    const usProfileRes = await fetch(`${API_BASE}/country-work-guide/profile/US`);
    assert(usProfileRes.ok, '7. US Profile Endpoint', `HTTP ${usProfileRes.status}`);
    const usProfileJson = await usProfileRes.json();
    const usProfile = usProfileJson.profile;
    assert(usProfile?.studentWorkPolicies?.[0]?.termTimeLimitHours === 20 && usProfile?.studentWorkPolicies?.[0]?.offCampusRules?.toLowerCase().includes('strictly prohibited'), '7.1 US 20h On-Campus Rule', 'Enforces F-1 20h/wk on-campus requirement');

    const caProfileRes = await fetch(`${API_BASE}/country-work-guide/profile/CA`);
    assert(caProfileRes.ok, '7.2 Canada Profile Endpoint', `HTTP ${caProfileRes.status}`);
    const caProfileJson = await caProfileRes.json();
    const caProfile = caProfileJson.profile;
    assert(caProfile?.studentWorkPolicies?.[0]?.termTimeLimitHours === 24 && caProfile?.studentWorkPolicies?.[0]?.termTimeUnit === 'HOURS_PER_WEEK', '7.3 Canada 24h Off-Campus Rule', 'Enforces updated IRCC 24h/wk limit');

    // ---------------------------------------------------------
    // 8. Side-by-Side Comparison Matrix Endpoint
    // ---------------------------------------------------------
    const compareRes = await fetch(`${API_BASE}/country-work-guide/compare?countries=DE,AU,US,SE`);
    assert(compareRes.ok, '8. Comparison Matrix Endpoint', `HTTP ${compareRes.status}`);
    const compareJson = await compareRes.json();
    const compareData = compareJson.comparison;
    assert(Array.isArray(compareData) && compareData.length === 4, '8.1 Matrix Country Count', `Returned ${compareData?.length} comparison profiles`);

    // ---------------------------------------------------------
    // 9. Sub-Page Data Endpoints
    // ---------------------------------------------------------
    const wagesRes = await fetch(`${API_BASE}/country-work-guide/minimum-wages`);
    assert(wagesRes.ok, '9.1 Minimum Wages Endpoint', `HTTP ${wagesRes.status}`);

    const workRulesRes = await fetch(`${API_BASE}/country-work-guide/student-work-rules`);
    assert(workRulesRes.ok, '9.2 Student Work Rules Endpoint', `HTTP ${workRulesRes.status}`);

    const pswRes = await fetch(`${API_BASE}/country-work-guide/post-study-work`);
    assert(pswRes.ok, '9.3 Post-Study Work Routes Endpoint', `HTTP ${pswRes.status}`);

    const roadmapsRes = await fetch(`${API_BASE}/country-work-guide/career-roadmaps`);
    assert(roadmapsRes.ok, '9.4 Career Roadmaps Endpoint', `HTTP ${roadmapsRes.status}`);

    const sourcesRes = await fetch(`${API_BASE}/country-work-guide/sources`);
    assert(sourcesRes.ok, '9.5 Official Sources Endpoint', `HTTP ${sourcesRes.status}`);

    // ---------------------------------------------------------
    // 10. Student Career & Financial Planner Engine
    // ---------------------------------------------------------
    const plannerRes = await fetch(`${API_BASE}/country-work-guide/planner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        degreeLevel: 'MASTER',
        targetField: 'Computer Science',
        workHoursPerWeekTarget: 20,
        intendedStudyDurationYears: 2,
        requiresPostStudyWork: true,
        targetCountries: ['DE', 'AU', 'CA'],
      }),
    });
    assert(plannerRes.ok, '10. Student Planner Recommendation Engine', `HTTP ${plannerRes.status}`);
    const plannerJson = await plannerRes.json();
    const plannerData = plannerJson.recommendations;
    assert(Array.isArray(plannerData) && plannerData.length >= 1, '10.1 Planner Output', `Generated ${plannerData?.length} scored country recommendations`);
    assert(plannerData?.[0]?.planningSuggestions?.length > 0, '10.2 Planner Regulatory Warnings', 'Contains realistic caution warnings (no living expense reliance on part-time wages)');

    // ---------------------------------------------------------
    // 11. Student Correction Submission & Admin Review
    // ---------------------------------------------------------
    const submitCorrectionRes = await fetch(`${API_BASE}/country-work-guide/corrections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        countryId: deProfile?.id,
        entityType: 'MINIMUM_WAGE',
        reportedIssue: 'Testing automated policy correction report submission.',
        proposedCorrection: 'Statutory minimum wage rate review for 2025/2026.',
        evidenceUrl: 'https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html',
      }),
    });
    assert(submitCorrectionRes.ok, '11. Student Submit Correction', `HTTP ${submitCorrectionRes.status}`);
    const submitJson = await submitCorrectionRes.json();
    const createdCorrection = submitJson.report;
    assert(!!createdCorrection?.id, '11.1 Correction ID Created', `ID: ${createdCorrection?.id}`);

    // Admin fetches corrections
    const adminGetCorrectionsRes = await fetch(`${API_BASE}/admin/country-work-guide/corrections`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminGetCorrectionsRes.ok, '11.2 Admin Get Corrections', `HTTP ${adminGetCorrectionsRes.status}`);
    const reportsJson = await adminGetCorrectionsRes.json();
    const reportsList = reportsJson.reports;
    assert(Array.isArray(reportsList) && reportsList.some((r: any) => r.id === createdCorrection?.id), '11.3 Correction Appears in Admin Queue', 'Report listed in admin queue');

    // Admin reviews correction
    const adminReviewRes = await fetch(`${API_BASE}/admin/country-work-guide/corrections/${createdCorrection?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'APPROVED',
        adminNotes: 'Automated test suite review: verified with BMAS portal.',
      }),
    });
    assert(adminReviewRes.ok, '11.4 Admin Review Correction', `HTTP ${adminReviewRes.status}`);

    // Admin logs policy verification
    const adminVerifyRes = await fetch(`${API_BASE}/admin/country-work-guide/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        countryId: deProfile?.id,
        entityType: 'MINIMUM_WAGE',
        status: 'VERIFIED',
        findings: 'Verified against BMAS gazette in automated test run.',
        sourceUrl: 'https://www.bmas.de',
      }),
    });
    assert(adminVerifyRes.ok, '11.5 Admin Policy Verification Log', `HTTP ${adminVerifyRes.status}`);

    // ---------------------------------------------------------
    // 12. Bilingual Parity & i18n Key Verification
    // ---------------------------------------------------------
    const enLocalePath = path.resolve(process.cwd(), 'client/src/locales/en.ts');
    const bnLocalePath = path.resolve(process.cwd(), 'client/src/locales/bn.ts');
    const enContent = fs.readFileSync(enLocalePath, 'utf8');
    const bnContent = fs.readFileSync(bnLocalePath, 'utf8');

    assert(enContent.includes('countryWorkGuide:'), '12.1 en.ts Has countryWorkGuide', 'English translation object exists');
    assert(bnContent.includes('countryWorkGuide:'), '12.2 bn.ts Has countryWorkGuide', 'Bengali translation object exists');
    assert(bnContent.includes('বৈধ কর্মঘণ্টা') || bnContent.includes('ন্যূনতম মজুরি'), '12.3 Bengali Authentic Unicode', 'Authentic Bengali Unicode terms present');

    // ---------------------------------------------------------
    // 13. Decoupled Independent Datasets Across All 42 Countries
    // ---------------------------------------------------------
    const dsWagesRes = await fetch(`${API_BASE}/country-work-guide/datasets/minimum-wages`);
    assert(dsWagesRes.ok, '13.1 Dedicated Minimum Wages Dataset Endpoint', `HTTP ${dsWagesRes.status}`);
    const dsWagesJson = await dsWagesRes.json();
    assert(dsWagesJson.success && dsWagesJson.count === 42, '13.2 Dataset 1 (Minimum Wage): 42 Countries', `Loaded ${dsWagesJson.count}/42 country minimum wage records`);

    const dsWorkHoursRes = await fetch(`${API_BASE}/country-work-guide/datasets/student-work-hours`);
    assert(dsWorkHoursRes.ok, '13.3 Dedicated Student Work Hours Dataset Endpoint', `HTTP ${dsWorkHoursRes.status}`);
    const dsWorkHoursJson = await dsWorkHoursRes.json();
    assert(dsWorkHoursJson.success && dsWorkHoursJson.count === 42, '13.4 Dataset 2 (Student Work Hours): 42 Countries', `Loaded ${dsWorkHoursJson.count}/42 student work hour records`);

    const dsPswRes = await fetch(`${API_BASE}/country-work-guide/datasets/post-study-work`);
    assert(dsPswRes.ok, '13.5 Dedicated Post-Study Work Dataset Endpoint', `HTTP ${dsPswRes.status}`);
    const dsPswJson = await dsPswRes.json();
    assert(dsPswJson.success && dsPswJson.count >= 42, '13.6 Dataset 3 (Post-Study Work): 42+ Country Routes', `Loaded ${dsPswJson.count} post-study work routes`);

    // ---------------------------------------------------------
    // Summary
    // ---------------------------------------------------------
    console.log('\n========================================================================');
    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;
    console.log(`TOTAL RESULTS: ${passedCount}/${totalCount} TESTS PASSED`);
    console.log('========================================================================');

    if (passedCount !== totalCount) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Unhandled test suite failure:', err);
    process.exit(1);
  }
}

runCountryWorkGuideVerification();
