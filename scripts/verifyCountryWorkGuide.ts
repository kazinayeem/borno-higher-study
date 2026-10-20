// Borno Higher Study — Global Country Work Guide Verification Suite
// Run with: npm run test:work-guide (or: npx tsx scripts/verifyCountryWorkGuide.ts)

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
  console.log('🌍 BORNO HIGHER STUDY: GLOBAL COUNTRY WORK GUIDE TEST SUITE');
  console.log('========================================================================\n');

  try {
    // ------------------------------------------------------------------------
    // Step 0: Check File & Route Integrity in Client
    // ------------------------------------------------------------------------
    console.log('--- Step 0: Checking Routes & Client Component Integrity ---');
    const appTsxPath = path.resolve(process.cwd(), 'client/src/App.tsx');
    const appTsxContent = fs.readFileSync(appTsxPath, 'utf8');

    const expectedRoutes = [
      '/country-work-guide',
      '/country-work-guide/:countryCode',
      '/country-work-guide/compare',
      '/country-work-guide/student-work-rules',
      '/country-work-guide/minimum-wages',
      '/country-work-guide/post-study-work',
      '/country-work-guide/career-roadmaps',
      '/country-work-guide/sources'
    ];

    for (const route of expectedRoutes) {
      assert(
        appTsxContent.includes(`path="${route}"`),
        `Route Registration: ${route}`,
        `Found in client/src/App.tsx`
      );
    }

    // ------------------------------------------------------------------------
    // Step 1: Authentication Tokens
    // ------------------------------------------------------------------------
    console.log('\n--- Step 1: Acquiring Test Credentials ---');
    let adminToken = '';
    let studentToken = '';

    const adminLoginRes = await fetch(`${API_BASE}/auth/super-admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'superadmin@borno.edu', password: 'SuperAdmin@Borno2026!' })
    });
    if (adminLoginRes.ok) {
      const data = await adminLoginRes.json();
      adminToken = data.token;
    }

    const studentLoginRes = await fetch(`${API_BASE}/auth/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@borno.edu', password: 'StudentDemo@Borno2026!' })
    });
    if (studentLoginRes.ok) {
      const data = await studentLoginRes.json();
      studentToken = data.token;
    }

    assert(!!adminToken, 'Admin Authentication', 'Super Admin bearer token acquired');
    assert(!!studentToken, 'Student Authentication', 'Student bearer token acquired');

    // ------------------------------------------------------------------------
    // Step 2: Global Country Work Guide Directory API
    // ------------------------------------------------------------------------
    console.log('\n--- Step 2: Global Directory & Aggregation Endpoints ---');
    const hubRes = await fetch(`${API_BASE}/country-work-guide`);
    assert(hubRes.ok, 'Global Hub API Status', `HTTP ${hubRes.status}`);
    const hubData = await hubRes.json();

    assert(
      Array.isArray(hubData.countries) && hubData.countries.length >= 7,
      'Global Countries Dataset',
      `Found ${hubData.countries?.length} comprehensive country profiles`
    );

    assert(
      hubData.stats && hubData.stats.totalCountries >= 7 && hubData.stats.statutoryWageCountries >= 4,
      'Global Aggregated Statistics',
      `Total: ${hubData.stats?.totalCountries}, Statutory Wage: ${hubData.stats?.statutoryWageCountries}, Collective Bargaining: ${hubData.stats?.collectiveBargainingCountries}`
    );

    // ------------------------------------------------------------------------
    // Step 3: Verified Country Profiles & Statutory Nuances
    // ------------------------------------------------------------------------
    console.log('\n--- Step 3: Country Profile & Legal Unit Integrity ---');

    // Australia: 48h / fortnight
    const auRes = await fetch(`${API_BASE}/country-work-guide/profile/AU`);
    assert(auRes.ok, 'Australia Profile API', `HTTP ${auRes.status}`);
    const auData = await auRes.json();
    const auPolicy = auData.profile?.studentWorkPolicy;
    assert(
      auPolicy?.hourLimitPeriod === 'fortnight' && auPolicy?.termTimeHoursLimit === 48,
      'Australia Statutory Work Limit',
      `Accurately recorded as 48 hours per fortnight (${auPolicy?.termTimeHoursLimit}h/${auPolicy?.hourLimitPeriod})`
    );

    // Germany: 140 full days / calendar year
    const deRes = await fetch(`${API_BASE}/country-work-guide/profile/DE`);
    assert(deRes.ok, 'Germany Profile API', `HTTP ${deRes.status}`);
    const deData = await deRes.json();
    const dePolicy = deData.profile?.studentWorkPolicy;
    assert(
      dePolicy?.calendarYearDaysLimit === 140 && dePolicy?.halfDaysEquivalent === 280,
      'Germany Skilled Immigration Act Rule',
      `Preserved 140 full days or 280 half days per calendar year (March 2024 update)`
    );

    // Canada: 24 hours / week off-campus (Fall 2024 revised limit)
    const caRes = await fetch(`${API_BASE}/country-work-guide/profile/CA`);
    assert(caRes.ok, 'Canada Profile API', `HTTP ${caRes.status}`);
    const caData = await caRes.json();
    const caPolicy = caData.profile?.studentWorkPolicy;
    assert(
      caPolicy?.termTimeHoursLimit === 24 && caPolicy?.hourLimitPeriod === 'week',
      'Canada Off-Campus Limit',
      `Accurately recorded as 24 hours per week (${caPolicy?.termTimeHoursLimit}h/${caPolicy?.hourLimitPeriod})`
    );

    // USA: 20 hours / week on-campus strictly enforced
    const usRes = await fetch(`${API_BASE}/country-work-guide/profile/US`);
    assert(usRes.ok, 'United States Profile API', `HTTP ${usRes.status}`);
    const usData = await usRes.json();
    const usPolicy = usData.profile?.studentWorkPolicy;
    assert(
      usPolicy?.onCampusPermitted === true && usPolicy?.offCampusPermitted === false && usPolicy?.termTimeHoursLimit === 20,
      'United States F-1 On-Campus Work Rule',
      `Accurately restricted to 20h/wk on-campus; off-campus strictly requires CPT/OPT authorization`
    );

    // Sweden & Finland: Collective Bargaining (No statutory national minimum wage)
    const seRes = await fetch(`${API_BASE}/country-work-guide/profile/SE`);
    assert(seRes.ok, 'Sweden Profile API', `HTTP ${seRes.status}`);
    const seData = await seRes.json();
    const seWage = seData.profile?.minimumWagePolicy;
    assert(
      seWage?.hasStatutoryWage === false && seWage?.collectiveBargaining === true,
      'Sweden Collective Bargaining System',
      `No statutory minimum wage; governed by Kollektivavtal`
    );

    const fiRes = await fetch(`${API_BASE}/country-work-guide/profile/FI`);
    assert(fiRes.ok, 'Finland Profile API', `HTTP ${fiRes.status}`);
    const fiData = await fiRes.json();
    const fiWage = fiData.profile?.minimumWagePolicy;
    const fiPolicy = fiData.profile?.studentWorkPolicy;
    assert(
      fiWage?.hasStatutoryWage === false && fiWage?.collectiveBargaining === true && fiPolicy?.termTimeHoursLimit === 30,
      'Finland Collective Agreements & 30h/wk Limit',
      `Governed by TES collective agreements; work limit is 30h/week average`
    );

    // ------------------------------------------------------------------------
    // Step 4: Comparison, Wages, Rules, Post-Study & Roadmap Endpoints
    // ------------------------------------------------------------------------
    console.log('\n--- Step 4: Comparison Matrix & Section Endpoints ---');

    // Compare
    const compareRes = await fetch(`${API_BASE}/country-work-guide/compare?codes=DE,GB,CA,AU`);
    assert(compareRes.ok, 'Comparison Matrix API', `HTTP ${compareRes.status}`);
    const compareData = await compareRes.json();
    assert(
      Array.isArray(compareData.comparisons) && compareData.comparisons.length === 4,
      'Comparison Item Count',
      `Returned side-by-side comparison matrix for ${compareData.comparisons?.length} countries`
    );

    // Student Work Rules
    const workRulesRes = await fetch(`${API_BASE}/country-work-guide/student-work-rules`);
    assert(workRulesRes.ok, 'Student Work Rules API', `HTTP ${workRulesRes.status}`);
    const workRulesData = await workRulesRes.json();
    assert(
      Array.isArray(workRulesData.rules) && workRulesData.rules.length >= 7,
      'Student Work Rules Records',
      `Found ${workRulesData.rules?.length} country work regulations`
    );

    // Minimum Wages
    const wageRes = await fetch(`${API_BASE}/country-work-guide/minimum-wages`);
    assert(wageRes.ok, 'Minimum Wages API', `HTTP ${wageRes.status}`);
    const wageData = await wageRes.json();
    assert(
      Array.isArray(wageData.wages) && wageData.wages.length >= 7,
      'Minimum Wage Records',
      `Found ${wageData.wages?.length} wage profiles with BDT currency rates`
    );

    // Post Study Work
    const pswRes = await fetch(`${API_BASE}/country-work-guide/post-study-work`);
    assert(pswRes.ok, 'Post-Study Work API', `HTTP ${pswRes.status}`);
    const pswData = await pswRes.json();
    assert(
      Array.isArray(pswData.routes) && pswData.routes.length >= 7,
      'Post-Study Work Routes',
      `Found ${pswData.routes?.length} graduate visa pathways`
    );

    // Career Roadmaps
    const roadmapsRes = await fetch(`${API_BASE}/country-work-guide/career-roadmaps`);
    assert(roadmapsRes.ok, 'Career Roadmaps API', `HTTP ${roadmapsRes.status}`);
    const roadmapsData = await roadmapsRes.json();
    assert(
      Array.isArray(roadmapsData.roadmaps) && roadmapsData.roadmaps.length >= 7,
      'Career Roadmaps Records',
      `Found ${roadmapsData.roadmaps?.length} 6-stage country roadmaps`
    );

    // Check Stages in Germany Roadmap
    const deRoadmap = roadmapsData.roadmaps?.find((r: any) => r.countryCode === 'DE');
    assert(
      deRoadmap?.steps?.length >= 6,
      'Germany 6-Stage Roadmap Fidelity',
      `Found ${deRoadmap?.steps?.length} stages (Pre-arrival to PR/EU Blue Card)`
    );

    // Official Sources
    const sourcesRes = await fetch(`${API_BASE}/country-work-guide/sources`);
    assert(sourcesRes.ok, 'Official Sources API', `HTTP ${sourcesRes.status}`);
    const sourcesData = await sourcesRes.json();
    assert(
      Array.isArray(sourcesData.sources) && sourcesData.sources.length >= 10,
      'Official Sources Dataset',
      `Found ${sourcesData.sources?.length} verified primary government sources`
    );

    // ------------------------------------------------------------------------
    // Step 5: Interactive Personalized Student Planner Tool
    // ------------------------------------------------------------------------
    console.log('\n--- Step 5: Personalized Student Planner Engine ---');
    const plannerRes = await fetch(`${API_BASE}/country-work-guide/planner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        countryCode: 'DE',
        plannedDegreeLevel: 'Master',
        languageProficiencyLevel: 'B1',
        targetSector: 'Computer Science / Software Engineering',
        plannedWeeklyHours: 20
      })
    });
    assert(plannerRes.ok, 'Personalized Planner API', `HTTP ${plannerRes.status}`);
    const plan = await plannerRes.json();
    assert(
      plan.feasibilityScore >= 60 && Array.isArray(plan.breakdown) && plan.estimatedMonthlyEarningsBDT > 0,
      'Personalized Planner Feasibility Assessment',
      `Score: ${plan.feasibilityScore}/100, Est. Monthly: ~৳${plan.estimatedMonthlyEarningsBDT?.toLocaleString()} BDT`
    );

    // ------------------------------------------------------------------------
    // Step 6: Policy Correction Reporting & Admin Verification Workflow
    // ------------------------------------------------------------------------
    console.log('\n--- Step 6: Student Correction & Admin Review Flow ---');
    const reportRes = await fetch(`${API_BASE}/country-work-guide/report-correction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        countryCode: 'DE',
        policyType: 'student_work',
        proposedCorrection: 'Testing automated student correction report submission for verification suite',
        supportingSourceUrl: 'https://www.make-it-in-germany.com/en/study-vocational-training/studies-in-germany/work',
        submitterEmail: 'student@borno.edu',
        submitterName: 'Test Student'
      })
    });
    assert(reportRes.ok, 'Student Policy Correction Submission', `HTTP ${reportRes.status}`);
    const reportData = await reportRes.json();
    const createdReportId = reportData.report?.id;

    assert(
      !!createdReportId,
      'Correction Report Created',
      `ID: ${createdReportId}`
    );

    // Admin fetches reports
    const adminReportsRes = await fetch(`${API_BASE}/admin/country-work-guide/correction-reports`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminReportsRes.ok, 'Admin Fetch Correction Reports', `HTTP ${adminReportsRes.status}`);
    const adminReports = await adminReportsRes.json();
    assert(
      Array.isArray(adminReports.reports) && adminReports.reports.some((r: any) => r.id === createdReportId),
      'Report Present in Admin Queue',
      `Found submitted report ${createdReportId} in pending list`
    );

    // Admin reviews report
    const reviewRes = await fetch(`${API_BASE}/admin/country-work-guide/correction-reports/${createdReportId}/review`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: 'reviewed',
        adminNotes: 'Verified against Make-It-In-Germany official portal during automated test suite'
      })
    });
    assert(reviewRes.ok, 'Admin Review Correction Report', `HTTP ${reviewRes.status}`);

    // Admin verification log
    const verifyLogRes = await fetch(`${API_BASE}/admin/country-work-guide/verify-policy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        countryCode: 'DE',
        policyArea: 'minimum_wage',
        verificationStatus: 'verified',
        verificationNotes: 'Automated test suite policy verification check'
      })
    });
    assert(verifyLogRes.ok, 'Admin Policy Verification Action', `HTTP ${verifyLogRes.status}`);

    // ------------------------------------------------------------------------
    // Step 7: i18n Key Parity Check
    // ------------------------------------------------------------------------
    console.log('\n--- Step 7: Translation & i18n Key Parity ---');
    const enLocalePath = path.resolve(process.cwd(), 'client/src/locales/en.ts');
    const bnLocalePath = path.resolve(process.cwd(), 'client/src/locales/bn.ts');

    const enContent = fs.readFileSync(enLocalePath, 'utf8');
    const bnContent = fs.readFileSync(bnLocalePath, 'utf8');

    assert(
      enContent.includes('countryWorkGuide:') && bnContent.includes('countryWorkGuide:'),
      'Namespace countryWorkGuide in Locales',
      'Present in both en.ts and bn.ts'
    );

    // Extract countryWorkGuide keys
    const enMatch = enContent.match(/countryWorkGuide:\s*{([^}]+)}/s);
    const bnMatch = bnContent.match(/countryWorkGuide:\s*{([^}]+)}/s);

    if (enMatch && bnMatch) {
      const extractKeys = (block: string) => {
        const keys: string[] = [];
        const lines = block.split('\n');
        for (const line of lines) {
          const match = line.match(/^\s*([a-zA-Z0-9_-]+):/);
          if (match) keys.push(match[1]);
        }
        return keys;
      };

      const enKeys = extractKeys(enMatch[1]);
      const bnKeys = extractKeys(bnMatch[1]);

      const missingInBn = enKeys.filter(k => !bnKeys.includes(k));
      const missingInEn = bnKeys.filter(k => !enKeys.includes(k));

      assert(
        missingInBn.length === 0 && missingInEn.length === 0,
        'countryWorkGuide Key Parity',
        `en keys: ${enKeys.length}, bn keys: ${bnKeys.length}, 100% matched`
      );
    }

    // ------------------------------------------------------------------------
    // Final Summary
    // ------------------------------------------------------------------------
    console.log('\n========================================================================');
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = results.filter(r => !r.passed).length;

    console.log(`TOTAL TESTS: ${totalTests}`);
    console.log(`PASSED: ${passedTests}`);
    console.log(`FAILED: ${failedTests}`);

    if (failedTests > 0) {
      console.error('\n❌ SOME CHECKS FAILED. See details above.');
      process.exit(1);
    } else {
      console.log('\n🎉 ALL COUNTRY WORK GUIDE VERIFICATION CHECKS PASSED PERFECTLY!');
      process.exit(0);
    }

  } catch (error: any) {
    console.error('Fatal error in verification suite:', error);
    process.exit(1);
  }
}

runCountryWorkGuideVerification();
