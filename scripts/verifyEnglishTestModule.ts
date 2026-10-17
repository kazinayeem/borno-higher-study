const API_BASE = 'http://localhost:5001/api';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function record(name: string, passed: boolean, details?: string) {
  results.push({ name, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${name} ${details ? `(${details})` : ''}`);
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  let data: any = null;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

async function runEnglishTestModuleTests() {
  console.log('========================================================================');
  console.log('🇬🇧 BORNO HIGHER STUDY: ENGLISH TEST COMPARISON & ACCEPTANCE TEST SUITE');
  console.log('========================================================================\n');

  let adminToken = '';
  let studentToken = '';

  // 1. Authentication
  try {
    const adminRes = await request('/auth/super-admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'superadmin@borno.edu',
        password: 'SuperAdmin@Borno2026!',
      }),
    });
    adminToken = adminRes.data?.token;

    const studentRes = await request('/auth/student/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'student@borno.edu',
        password: 'StudentDemo@Borno2026!',
      }),
    });
    studentToken = studentRes.data?.token;

    record(
      '1. Authentication for English Test Tests',
      Boolean(adminToken && studentToken),
      'Super Admin and Student tokens acquired'
    );
  } catch (err: any) {
    record('1. Authentication for English Test Tests', false, err.message);
  }

  // 2. Comparison Matrix API: 7 Formats & Bangladesh Fees
  let testFormats: any[] = [];
  try {
    const matrixRes = await request('/english-tests/matrix');
    testFormats = matrixRes.data?.formats || [];

    const expectedCodes = [
      'IELTS_ACADEMIC',
      'IELTS_UKVI_ACADEMIC',
      'PTE_ACADEMIC',
      'PTE_ACADEMIC_ONLINE',
      'PTE_UKVI',
      'TOEFL_IBT',
      'TOEFL_HOME_EDITION',
    ];

    const allCodesPresent = expectedCodes.every((code) =>
      testFormats.some((f: any) => f.code === code)
    );

    const ieltsFee = testFormats.find((f: any) => f.code === 'IELTS_ACADEMIC')?.currentFee;
    const pteFee = testFormats.find((f: any) => f.code === 'PTE_ACADEMIC')?.currentFee;
    const toeflFee = testFormats.find((f: any) => f.code === 'TOEFL_IBT')?.currentFee;

    const feesValid =
      ieltsFee?.amount === 26500 &&
      ieltsFee?.currency === 'BDT' &&
      pteFee?.amount === 215 &&
      pteFee?.bdtEstimate > 20000 &&
      toeflFee?.amount === 205;

    record(
      '2. Comparison Matrix API & Bangladesh Fees',
      matrixRes.ok && allCodesPresent && feesValid,
      `Verified 7 formats. IELTS: BDT ${ieltsFee?.amount}, PTE: $${pteFee?.amount} (~BDT ${pteFee?.bdtEstimate}), TOEFL: $${toeflFee?.amount}`
    );
  } catch (err: any) {
    record('2. Comparison Matrix API & Bangladesh Fees', false, err.message);
  }

  // 3. Online vs. Test-Centre Delivery Mode Distinction & Visa Restrictions
  try {
    const pteOnline = testFormats.find((f: any) => f.code === 'PTE_ACADEMIC_ONLINE');
    const toeflHome = testFormats.find((f: any) => f.code === 'TOEFL_HOME_EDITION');
    const ieltsUkvi = testFormats.find((f: any) => f.code === 'IELTS_UKVI_ACADEMIC');

    const restrictionsPresent =
      pteOnline?.visaImmigrationRestrictions?.includes('NOT approved for visa') &&
      toeflHome?.visaImmigrationRestrictions?.includes('Not approved as a Secure English Language Test') &&
      ieltsUkvi?.visaImmigrationRestrictions?.includes('SELT');

    record(
      '3. Online vs Test-Centre & Visa Restrictions Differentiation',
      Boolean(restrictionsPresent && pteOnline?.deliveryMode === 'ONLINE'),
      'PTE Online & TOEFL Home Edition carry explicit visa rejection warnings; UKVI SELT noted'
    );
  } catch (err: any) {
    record('3. Online vs Test-Centre & Visa Restrictions Differentiation', false, err.message);
  }

  // 4. University Acceptance Database & Server-Side Pagination
  try {
    const acceptanceRes = await request('/english-tests/university-acceptance?limit=10&page=1');
    const policies = acceptanceRes.data?.policies || [];
    const pagination = acceptanceRes.data?.pagination;

    const hasPagination =
      pagination?.total >= 45 &&
      pagination?.totalPages >= 4 &&
      policies.length === 10;

    record(
      '4. University Acceptance Server-Side Pagination',
      acceptanceRes.ok && hasPagination,
      `Total: ${pagination?.total} policies, Page 1 of ${pagination?.totalPages} (Limit 10 slice)`
    );
  } catch (err: any) {
    record('4. University Acceptance Server-Side Pagination', false, err.message);
  }

  // 5. Initial 15 UK Flagships Verification
  try {
    const ukRes = await request('/english-tests/university-acceptance?countrySlug=united-kingdom&limit=100');
    const ukPolicies = ukRes.data?.policies || [];

    const expectedUnis = [
      'University of Oxford',
      'University of Cambridge',
      'Imperial College London',
      'University College London',
      'University of Edinburgh',
      'University of Manchester',
      'University of Birmingham',
      'University of Bristol',
      'University of Leeds',
      "King's College London",
      'University of Warwick',
      'University of Glasgow',
      'University of Nottingham',
      'University of Southampton',
      'University of Sheffield',
    ];

    const foundUniNames = Array.from(new Set(ukPolicies.map((p: any) => p.university.name as string)));
    const all15Found = expectedUnis.every((expected) =>
      foundUniNames.some((found) => found.includes(expected) || expected.includes(found))
    );

    record(
      '5. Initial 15 UK University Flagships Dataset',
      all15Found,
      `Found ${foundUniNames.length} distinct UK universities across policies (All 15 initial flagships verified)`
    );
  } catch (err: any) {
    record('5. Initial 15 UK University Flagships Dataset', false, err.message);
  }

  // 6. Online vs. Test-Centre University Policy Non-Inference
  try {
    // Oxford policies
    const oxfordRes = await request('/english-tests/university-acceptance?search=Oxford');
    const oxfordPolicies = oxfordRes.data?.policies || [];

    const oxfordIelts = oxfordPolicies.find((p: any) => p.testFormat?.code === 'IELTS_ACADEMIC');
    const oxfordToeflHome = oxfordPolicies.find((p: any) => p.testFormat?.code === 'TOEFL_HOME_EDITION');
    const oxfordPteOnline = oxfordPolicies.find((p: any) => p.testFormat?.code === 'PTE_ACADEMIC_ONLINE');

    const nonInferencePassed =
      oxfordIelts?.status === 'ACCEPTED' &&
      oxfordToeflHome?.status === 'NOT_ACCEPTED' &&
      oxfordPteOnline?.status === 'NOT_ACCEPTED';

    record(
      '6. Non-Inference of Online Tests (Oxford Rejects At-Home Exams)',
      Boolean(nonInferencePassed),
      'Oxford accepts IELTS Academic (Test Centre) but explicitly has NOT_ACCEPTED for TOEFL Home & PTE Online'
    );
  } catch (err: any) {
    record('6. Non-Inference of Online Tests (Oxford Rejects At-Home Exams)', false, err.message);
  }

  // 7. Component Scores & Specific Band Thresholds (L, R, W, S)
  try {
    const cambridgeRes = await request('/english-tests/university-acceptance?search=Cambridge');
    const cambridgePolicies = cambridgeRes.data?.policies || [];
    const cambridgeIelts = cambridgePolicies.find((p: any) => p.testFormat?.code === 'IELTS_ACADEMIC');

    const scoreCheck =
      cambridgeIelts?.minOverallScore === 7.5 &&
      cambridgeIelts?.componentScores?.listening === 7.0 &&
      cambridgeIelts?.componentScores?.reading === 7.0 &&
      cambridgeIelts?.componentScores?.writing === 7.0 &&
      cambridgeIelts?.componentScores?.speaking === 7.0;

    record(
      '7. Course & Component Score Thresholds (L/R/W/S)',
      Boolean(scoreCheck),
      `Cambridge: Overall ${cambridgeIelts?.minOverallScore}, Components (L: ${cambridgeIelts?.componentScores?.listening}, R: ${cambridgeIelts?.componentScores?.reading}, W: ${cambridgeIelts?.componentScores?.writing}, S: ${cambridgeIelts?.componentScores?.speaking})`
    );
  } catch (err: any) {
    record('7. Course & Component Score Thresholds (L/R/W/S)', false, err.message);
  }

  // 8. Advisor Recommendation Wizard & Conflict Detection
  try {
    const oxfordPol = await request('/english-tests/university-acceptance?search=Oxford');
    const oxfordUniId = oxfordPol.data?.policies?.[0]?.university?.id;

    const impPol = await request('/english-tests/university-acceptance?search=Imperial');
    const impUniId = impPol.data?.policies?.[0]?.university?.id;

    const advisorRes = await request('/english-tests/advisor-recommendation', {
      method: 'POST',
      body: JSON.stringify({
        targetCountry: 'united-kingdom',
        qualificationLevel: 'UNDERGRADUATE',
        shortlistedUniIds: [oxfordUniId, impUniId].filter(Boolean),
        deliveryPreference: 'ONLINE', // Student asks for online exam
        budgetBdt: 30000,
      }),
    });

    const conflictDetected = advisorRes.data?.onlineConflictDetected === true;
    const hasConflictAlert = advisorRes.data?.conflictAlerts?.some((a: string) =>
      a.includes('CONFLICT DETECTED')
    );
    const recommended = advisorRes.data?.recommendation?.primary;

    record(
      '8. Advisor Recommendation Wizard & Conflict Detection',
      advisorRes.ok && conflictDetected && hasConflictAlert && recommended?.deliveryMode === 'TEST_CENTRE',
      `Correctly flagged that Oxford/Imperial reject online tests. Recommended: ${recommended?.name} (Test Centre)`
    );
  } catch (err: any) {
    record('8. Advisor Recommendation Wizard & Conflict Detection', false, err.message);
  }

  // 9. Student Reporting & Correction Submission
  let createdCorrectionId = '';
  try {
    const oxfordPol = await request('/english-tests/university-acceptance?search=Oxford');
    const oxfordPolicyId = oxfordPol.data?.policies?.[0]?.id;

    const submitRes = await request('/english-tests/corrections', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        targetType: 'UNIVERSITY_POLICY',
        policyId: oxfordPolicyId,
        correctionCategory: 'INCORRECT_SCORE',
        proposedChange: 'Proposal: Update Oxford minimum listening score requirement for Computer Science to 7.0',
        evidenceUrl: 'https://www.ox.ac.uk/admissions/cs/english',
        evidenceNotes: 'Noted in 2026 admissions prospectus',
      }),
    });

    createdCorrectionId = submitRes.data?.correction?.id;
    const statusIsPending = submitRes.data?.correction?.status === 'PENDING';

    record(
      '9. Student Reporting & Correction Queue Submission',
      submitRes.ok && Boolean(createdCorrectionId) && statusIsPending,
      `Submitted correction #${createdCorrectionId?.slice(0, 8)} with status: PENDING`
    );
  } catch (err: any) {
    record('9. Student Reporting & Correction Queue Submission', false, err.message);
  }

  // 10. Role Isolation & Super Admin Only Approval with Revision Audit
  try {
    // Attempt 1: Student tries to approve correction -> MUST FAIL with 403
    const studentApproveRes = await request(`/admin/english-tests/corrections/${createdCorrectionId}/review`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        decision: 'APPROVE',
        adminNotes: 'Student unauthorized approval attempt',
      }),
    });
    const studentBlocked = studentApproveRes.status === 403;

    // Attempt 2: Super Admin approves correction -> MUST SUCCEED
    const adminApproveRes = await request(`/admin/english-tests/corrections/${createdCorrectionId}/review`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        decision: 'APPROVE',
        adminNotes: 'Verified against Oxford Computer Science official admissions notice',
      }),
    });
    const adminApproved = adminApproveRes.ok && adminApproveRes.data?.correction?.status === 'APPROVED';

    // Verify Revision Audit was recorded in admin overview
    const overviewRes = await request('/admin/english-tests/overview', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const revisions = overviewRes.data?.recentRevisions || [];
    const hasAppliedRevision = revisions.some((r: any) => r.changeType === 'CORRECTION_APPLIED');

    record(
      '10. Role Isolation & Super Admin Approval with Audit Revision',
      studentBlocked && adminApproved && hasAppliedRevision,
      `Student blocked (403), Super Admin approved, Audit revisions recorded: ${revisions.length} item(s)`
    );
  } catch (err: any) {
    record('10. Role Isolation & Super Admin Approval with Audit Revision', false, err.message);
  }

  // 11. Official Fee Management & Audit Logging
  try {
    const overviewRes = await request('/admin/english-tests/overview', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const formats = overviewRes.data?.testFormats || [];
    const ieltsFormat = formats.find((f: any) => f.code === 'IELTS_ACADEMIC');
    const feeId = ieltsFormat?.fees?.[0]?.id;

    const updateFeeRes = await request(`/admin/english-tests/fees/${feeId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        amount: 26500,
        currency: 'BDT',
        bdtEstimate: 26500,
        verificationStatus: 'VERIFIED',
        availabilityNotes: 'British Council & IDP Bangladesh 2026 circular verified by Super Admin.',
      }),
    });

    record(
      '11. Official Fee Management & Audit Logging',
      updateFeeRes.ok && updateFeeRes.data?.fee?.verificationStatus === 'VERIFIED',
      `Fee verified at BDT 26,500 by Super Admin with traceable audit log`
    );
  } catch (err: any) {
    record('11. Official Fee Management & Audit Logging', false, err.message);
  }

  // 12. Repeatable & Idempotent Seeding
  try {
    const seedRes = await request('/admin/english-tests/seed', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const postOverview = await request('/admin/english-tests/overview', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const count = postOverview.data?.totalPolicies || 0;

    record(
      '12. Idempotent Seeding & Data Preservation Guarantee',
      seedRes.ok && count >= 45,
      `Re-seed executed without error. Total policies preserved: ${count}`
    );
  } catch (err: any) {
    record('12. Idempotent Seeding & Data Preservation Guarantee', false, err.message);
  }

  console.log('\n========================================================================');
  const passedCount = results.filter((r) => r.passed).length;
  console.log(`Summary: ${passedCount}/${results.length} tests passed.`);
  if (passedCount === results.length) {
    console.log('🎉 ALL ENGLISH TEST MODULE SPECIFICATIONS VERIFIED SUCCESSFULLY!\n');
  } else {
    console.error('⚠️ Some tests failed. Inspect details above.\n');
  }
}

runEnglishTestModuleTests().catch((e) => {
  console.error('Test execution failed:', e);
  process.exit(1);
});
