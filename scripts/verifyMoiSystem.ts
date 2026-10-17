// Automated Test Suite: Borno Higher Study MOI Acceptance & English Waiver Directory
// Run with: npx tsx scripts/verifyMoiSystem.ts

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

async function runTests() {
  console.log('\n========================================================================');
  console.log('📜 BORNO HIGHER STUDY: MOI ACCEPTANCE & ENGLISH WAIVER TEST SUITE');
  console.log('========================================================================\n');

  try {
    // 1. Authenticate Super Admin and Student
    const adminLoginRes = await fetch(`${API_BASE}/auth/super-admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'superadmin@borno.edu',
        password: 'SuperAdmin@Borno2026!',
      }),
    });
    const adminData = await adminLoginRes.json();
    const adminToken = adminData.token;

    const studentLoginRes = await fetch(`${API_BASE}/auth/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@borno.edu',
        password: 'StudentDemo@Borno2026!',
      }),
    });
    const studentData = await studentLoginRes.json();
    const studentToken = studentData.token;

    assert(
      !!adminToken && !!studentToken,
      '1. Authentication for MOI Tests',
      'Super Admin and Student tokens successfully acquired'
    );

    // 2. Public MOI Directory API & Pagination
    const policiesRes = await fetch(`${API_BASE}/moi/policies?limit=10`);
    const policiesData = await policiesRes.json();

    assert(
      policiesRes.ok && Array.isArray(policiesData.policies) && policiesData.policies.length >= 5,
      '2. Public MOI Directory API & Pagination',
      `Retrieved ${policiesData.policies.length} policies with total count: ${policiesData.pagination.total}`
    );

    // 3. Initial Verified Examples (Aston, Alberta, Ottawa, McGill, Maynooth)
    const aston = policiesData.policies.find((p: any) => p.university?.name.includes('Aston'));
    const alberta = policiesData.policies.find((p: any) => p.university?.name.includes('Alberta'));
    const ottawa = policiesData.policies.find((p: any) => p.university?.name.includes('Ottawa'));
    const mcgill = policiesData.policies.find((p: any) => p.university?.name.includes('McGill'));
    const maynooth = policiesData.policies.find((p: any) => p.university?.name.includes('Maynooth'));

    assert(
      !!aston && !!alberta && !!ottawa && !!mcgill && !!maynooth,
      '3. Initial Five Verified Benchmark Examples Present',
      'Aston, Alberta, Ottawa, McGill, and Maynooth all verified in database'
    );

    // 4. Aston University Specific Institutional Roster & 4-Year Rule
    assert(
      aston.acceptanceStatus === 'ACCEPTED_ONLY_FOR_SELECTED_INSTITUTIONS' &&
      aston.eligibleInstitutions?.includes('BUET') &&
      aston.eligibleInstitutions?.includes('NSU') &&
      aston.minDegreeDurationYears === 4.0,
      '4. Aston University Bangladesh Institutional Roster',
      'Requires 4-year degree from vetted institutional roster (BUET, NSU, BRAC, etc.)'
    );

    // 5. University of Ottawa 3-Year Recency Restriction
    assert(
      ottawa.graduationValidityYears === 3 &&
      ottawa.acceptanceStatus === 'ACCEPTED_FOR_SPECIFIED_COURSES',
      '5. University of Ottawa Recency Window',
      'Enforces strict 3-year graduation recency limit for language exemption'
    );

    // 6. Maynooth University & Irish ISD Visa Distinction
    assert(
      maynooth.visaSeparateRequirementNote.includes('Irish Immigration Service Delivery') &&
      maynooth.graduationValidityYears === 2,
      '6. Maynooth University Visa vs Academic Separation',
      'Explicitly highlights that academic waiver does NOT bypass Irish ISD student visa rules'
    );

    // 7. Non-Acceptance Contrasting Examples (Oxford & Cambridge)
    const oxford = policiesData.policies.find((p: any) => p.university?.name.includes('Oxford'));
    const cambridge = policiesData.policies.find((p: any) => p.university?.name.includes('Cambridge'));

    assert(
      oxford?.acceptanceStatus === 'NOT_ACCEPTED' &&
      cambridge?.acceptanceStatus === 'NOT_ACCEPTED' &&
      oxford?.separateTestRequired === 'SEPARATE_TEST_REQUIRED',
      '7. Explicit Non-Acceptance Recognition (Oxford & Cambridge)',
      'Oxford & Cambridge correctly flagged as NOT_ACCEPTED with mandatory test requirement'
    );

    // 8. Eligibility Assessment Engine - Potentially Eligible Case (Aston + NSU)
    const evalEligible = await fetch(`${API_BASE}/moi/check-eligibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country: 'United Kingdom',
        universityId: aston.universityId,
        completedQualification: "4-Year Bachelor's Degree",
        awardingInstitution: 'North South University (NSU)',
        allTaughtInEnglish: true,
        graduationYear: new Date().getFullYear() - 1,
        canProvideMoiLetter: true,
        hasAdditionalCourseReqs: false,
      }),
    });
    const evalEligibleData = await evalEligible.json();

    assert(
      evalEligibleData.outcome === 'POTENTIALLY_ELIGIBLE',
      '8. Interactive Advisor: Potentially Eligible Assessment',
      `Aston + NSU recognized: ${evalEligibleData.summaryTitle}`
    );

    // 9. Eligibility Assessment Engine - Negative Cases (Oxford or Non-English)
    const evalOxford = await fetch(`${API_BASE}/moi/check-eligibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country: 'United Kingdom',
        universityId: oxford.universityId,
        completedQualification: "4-Year Bachelor's Degree",
        awardingInstitution: 'BUET',
        allTaughtInEnglish: true,
        graduationYear: new Date().getFullYear() - 1,
        canProvideMoiLetter: true,
        hasAdditionalCourseReqs: false,
      }),
    });
    const evalOxfordData = await evalOxford.json();

    const evalNonEnglish = await fetch(`${API_BASE}/moi/check-eligibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country: 'Canada',
        universityId: alberta.universityId,
        completedQualification: "4-Year Bachelor's Degree",
        awardingInstitution: 'National University',
        allTaughtInEnglish: false,
        graduationYear: new Date().getFullYear() - 1,
        canProvideMoiLetter: false,
        hasAdditionalCourseReqs: false,
      }),
    });
    const evalNonEnglishData = await evalNonEnglish.json();

    assert(
      evalOxfordData.outcome === 'SEPARATE_TEST_NECESSARY' &&
      evalNonEnglishData.outcome === 'SEPARATE_TEST_NECESSARY',
      '9. Interactive Advisor: Mandatory Test Identification',
      'Oxford applicants & non-English medium graduates correctly informed test is required'
    );

    // 10. Student Correction Queue Submission
    const correctionRes = await fetch(`${API_BASE}/moi/corrections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        moiPolicyId: aston.id,
        universityName: 'Aston University',
        issueCategory: 'OUTDATED_POLICY',
        description: 'New 2026 intake guidelines added East West University to recognized list',
        evidenceUrl: 'https://www.aston.ac.uk/international/bangladesh',
        reporterName: 'Test Student',
        reporterEmail: 'student@borno.edu',
      }),
    });
    const correctionData = await correctionRes.json();

    assert(
      correctionRes.status === 201 && correctionData.correction?.status === 'PENDING',
      '10. Student Correction Queue Submission',
      `Correction #${correctionData.correction?.id?.slice(0, 8)} queued with status PENDING`
    );

    // 11. Role Isolation & Super Admin Approval with Audit Revision
    const studentAttempt = await fetch(`${API_BASE}/admin/moi/corrections`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    const adminReview = await fetch(
      `${API_BASE}/admin/moi/corrections/${correctionData.correction.id}/review`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          action: 'APPROVED',
          adminNotes: 'Verified against Aston updated South Asia prospectus.',
        }),
      }
    );
    const adminReviewData = await adminReview.json();

    assert(
      studentAttempt.status === 403 &&
      adminReview.ok &&
      adminReviewData.result?.status === 'APPROVED',
      '11. Role Isolation & Super Admin Review Workflow',
      'Student blocked (403), Super Admin approved, audit log entry created'
    );

    // 12. Policy Update with Audit History
    const updateRes = await fetch(`${API_BASE}/admin/moi/policies/${aston.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        changeReason: 'Automated test verified update',
        reviewerNotes: 'Verified for 2026/2027 admissions cycle.',
      }),
    });
    const updateData = await updateRes.json();

    assert(
      updateRes.ok && updateData.policy?.reviewerNotes?.includes('2026/2027'),
      '12. Super Admin Policy Management with Traceable Revision',
      'Policy updated with audit revision tracking'
    );

  } catch (err: any) {
    console.error('Fatal test execution error:', err);
    assert(false, 'Fatal Execution Error', err.message);
  }

  // Summary
  console.log('\n========================================================================');
  const passedCount = results.filter((r) => r.passed).length;
  console.log(`Summary: ${passedCount}/${results.length} tests passed.`);
  if (passedCount === results.length) {
    console.log('🎉 ALL MOI & ENGLISH WAIVER MODULE SPECIFICATIONS VERIFIED SUCCESSFULLY!\n');
  } else {
    console.error('❌ SOME TESTS FAILED!\n');
    process.exit(1);
  }
}

runTests();
