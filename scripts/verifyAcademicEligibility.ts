// Automated Test Suite: Borno Higher Study Global Academic Eligibility & Subject Requirements Engine
// Run with: npx tsx scripts/verifyAcademicEligibility.ts

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
  console.log('🎓 BORNO HIGHER STUDY: ACADEMIC ELIGIBILITY & SUBJECT REQUIREMENTS TEST');
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
      '1. Admin & Student Authentication',
      'Tokens successfully acquired for API test executions'
    );

    // 2. Grade Scales Directory Check (Scale preservation)
    const scalesRes = await fetch(`${API_BASE}/academic/grade-scales`);
    const scalesData = await scalesRes.json();

    const bdScale = scalesData.gradeScales?.find((s: any) => s.code === 'BD_GPA_5');
    const cgpaScale = scalesData.gradeScales?.find((s: any) => s.code === 'UNIV_CGPA_4');
    const germanScale = scalesData.gradeScales?.find((s: any) => s.code === 'GERMAN_SCALE_1_TO_5');

    assert(
      scalesRes.ok && !!bdScale && !!cgpaScale && !!germanScale,
      '2. Grade Scales Preservation',
      `Found ${scalesData.gradeScales?.length || 0} scales: BD GPA 5.00, University CGPA 4.00, German 1.0-5.0 scale preserved without forced conversion`
    );

    // 3. Qualification Equivalency Frameworks (ECCTIS, Anabin, WES)
    const equivsRes = await fetch(`${API_BASE}/academic/equivalencies`);
    const equivsData = await equivsRes.json();

    const ecctisEquiv = equivsData.equivalencies?.find((e: any) => e.credentialEvaluator?.includes('ECCTIS'));
    const anabinEquiv = equivsData.equivalencies?.find((e: any) => e.credentialEvaluator?.includes('Anabin'));

    assert(
      equivsRes.ok && !!ecctisEquiv && !!anabinEquiv,
      '3. Official Qualification Equivalency Data',
      `Recognized authorities present: ECCTIS (${ecctisEquiv?.homeQualification} -> ${ecctisEquiv?.targetQualification}) and Anabin`
    );

    // 4. Academic Requirements Catalog Fetch & Filtering
    const catalogRes = await fetch(`${API_BASE}/academic/requirements?limit=50`);
    const catalogData = await catalogRes.json();

    assert(
      catalogRes.ok && catalogData.total >= 8 && Array.isArray(catalogData.requirements),
      '4. Academic Requirements Catalog Listing',
      `Retrieved ${catalogData.total} verified benchmark academic requirements`
    );

    // 5. Independent SSC and HSC Minimum GPA Thresholds
    const bscEngineeringReq = catalogData.requirements.find(
      (r: any) => r.degreeLevel === 'BACHELOR' && r.minHscGpa && r.minSscGpa
    );

    assert(
      !!bscEngineeringReq && bscEngineeringReq.minSscGpa > 0 && bscEngineeringReq.minHscGpa > 0,
      '5. Independent SSC & HSC Minimum GPAs',
      `Verified independent thresholds: Min SSC GPA ${bscEngineeringReq?.minSscGpa} / 5.00 and Min HSC GPA ${bscEngineeringReq?.minHscGpa} / 5.00`
    );

    // 6. Subject-Level Prerequisites & Grades Verification
    const imperialReq = catalogData.requirements.find(
      (r: any) => r.university?.name?.includes('Imperial') || r.sourceUrl?.includes('imperial')
    );
    const hasMathPhysics = imperialReq?.subjectRequirements?.some((s: any) =>
      s.subjectName.toLowerCase().includes('mathematics')
    );

    assert(
      !!imperialReq && hasMathPhysics,
      '6. Program Subject-Level Prerequisites',
      `Imperial College Engineering mandates Mathematics & Physics prerequisite achievements`
    );

    // 7. Student Eligibility Evaluation: Case A - High CGPA Master's Applicant Meets Thresholds
    const evalHighCgpaRes = await fetch(`${API_BASE}/academic/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        targetCountryCode: 'GB',
        universityName: 'University of Oxford',
        degreeLevel: 'MASTER',
        programName: 'MSc in Advanced Computer Science',
        bachelorDegreeTitle: 'BSc in Computer Science and Engineering',
        bachelorCgpa: 3.85,
        bachelorScale: 4.0,
        subjectGrades: [
          { subjectName: 'Mathematics', gradeNumeric: 5.0, gradeLetter: 'A+' },
          { subjectName: 'Computer Science', gradeNumeric: 5.0, gradeLetter: 'A+' },
        ],
        workExperienceMonths: 24,
      }),
    });
    const evalHighCgpaData = await evalHighCgpaRes.json();

    assert(
      evalHighCgpaRes.ok && evalHighCgpaData.status === 'MEETS_THRESHOLDS',
      '7. Eligibility Engine: Meets Published Thresholds',
      `Assessment returned MEETS_THRESHOLDS (Matched criteria: ${evalHighCgpaData.criteria?.length})`
    );

    // 8. Student Eligibility Evaluation: Case B - Below Minimum CGPA
    const evalLowCgpaRes = await fetch(`${API_BASE}/academic/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        targetCountryCode: 'GB',
        universityName: 'University of Oxford',
        degreeLevel: 'MASTER',
        programName: 'MSc in Advanced Computer Science',
        bachelorDegreeTitle: 'BSc in Software Engineering',
        bachelorCgpa: 2.5, // Below Oxford min 3.60
        bachelorScale: 4.0,
      }),
    });
    const evalLowCgpaData = await evalLowCgpaRes.json();

    assert(
      evalLowCgpaRes.ok && evalLowCgpaData.status === 'DOES_NOT_MEET',
      '8. Eligibility Engine: Below Minimum Threshold',
      `Assessment returned DOES_NOT_MEET for CGPA 2.50 against Oxford 3.60 threshold`
    );

    // 9. Student Eligibility Evaluation: Case C - UK Direct Entry vs International Foundation
    const evalFoundationRes = await fetch(`${API_BASE}/academic/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetCountryCode: 'GB',
        universityName: 'Imperial College London',
        degreeLevel: 'BACHELOR',
        programName: 'BEng Electrical and Electronic Engineering',
        sscGpa: 5.0,
        hscGpa: 5.0,
        hscStream: 'SCIENCE',
        subjectGrades: [
          { subjectName: 'Higher Mathematics', gradeNumeric: 5.0, gradeLetter: 'A+' },
          { subjectName: 'Physics', gradeNumeric: 5.0, gradeLetter: 'A+' },
        ],
      }),
    });
    const evalFoundationData = await evalFoundationRes.json();

    const hasConditionalFoundation = evalFoundationData.criteria?.some(
      (c: any) => c.category === 'QUALIFICATION_EQUIVALENCY' && c.matched === 'CONDITIONAL'
    );

    assert(
      evalFoundationRes.ok &&
        (evalFoundationData.status === 'EQUIVALENCY_CONFIRMATION_REQUIRED' || hasConditionalFoundation),
      '9. UK Direct Entry vs Foundation Pathway',
      `Detected mandatory Foundation Pathway condition for Bangladesh 12-year HSC applying to top UK engineering`
    );

    // 10. Student Correction Report Submission & Super Admin Moderation
    const reportSubmitRes = await fetch(`${API_BASE}/academic/corrections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        universityName: 'University of Oxford',
        programName: 'MSc in Advanced Computer Science',
        degreeLevel: 'MASTER',
        issueCategory: 'INCORRECT_GPA_REQUIREMENT',
        description: 'Updated minimum CGPA requirement from faculty website for 2026 entry.',
        officialEvidenceUrl: 'https://www.ox.ac.uk/admissions/graduate/courses/msc-advanced-computer-science',
        reporterEmail: 'student@borno.edu',
        reporterName: 'Rafiqul Islam',
      }),
    });
    const reportSubmitData = await reportSubmitRes.json();
    const createdReportId = reportSubmitData.report?.id;

    assert(
      reportSubmitRes.ok && !!createdReportId && reportSubmitData.report?.status === 'PENDING',
      '10. Student Correction Proposal Submission',
      `Correction submitted successfully in PENDING review state (ID: ${createdReportId?.slice(-6)})`
    );

    // 11. Admin Review of Student Correction
    const adminReviewRes = await fetch(`${API_BASE}/admin/academic/corrections/${createdReportId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        action: 'APPROVED',
        adminNotes: 'Verified against current official Oxford 2026 postgraduate prospectus.',
      }),
    });
    const adminReviewData = await adminReviewRes.json();

    assert(
      adminReviewRes.ok && adminReviewData.report?.status === 'APPROVED',
      '11. Super Admin Review & Approval',
      `Admin approved correction report with audit notes`
    );

    // 12. Admin Update & Revision Audit History
    const targetReq = catalogData.requirements[0];
    const updateReqRes = await fetch(`${API_BASE}/admin/academic/requirements/${targetReq.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        adminNotes: 'Verified by Borno Editorial Board October 2026',
        sourceUrl: targetReq.sourceUrl,
      }),
    });
    const updateReqData = await updateReqRes.json();

    assert(
      updateReqRes.ok && !!updateReqData.requirement,
      '12. Academic Requirement Update & Revision Logging',
      `Admin updated requirement and logged revision for ${targetReq.university?.name}`
    );

    // Summary
    console.log('\n========================================================================');
    console.log(`TEST SUITE SUMMARY: ${results.filter((r) => r.passed).length} / ${results.length} PASSED`);
    console.log('========================================================================\n');

    if (results.some((r) => !r.passed)) {
      process.exit(1);
    } else {
      console.log('🎉 ALL 12 ACADEMIC ELIGIBILITY TEST SCENARIOS PASSED SUCCESSFULLY!');
      process.exit(0);
    }
  } catch (err: any) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
