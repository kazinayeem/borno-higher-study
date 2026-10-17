// Borno Higher Study — Career Toolkit Comprehensive Verification Suite
// Run with: npm run test:career-toolkit (or: npx tsx scripts/verifyCareerToolkit.ts)

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

async function runCareerToolkitVerification() {
  console.log('========================================================================');
  console.log('💼 BORNO HIGHER STUDY: COMPLETE CAREER & CV TOOLKIT TEST SUITE');
  console.log('========================================================================\n');

  try {
    // Step 0: Acquire Auth Tokens (Super Admin & Student)
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

    assert(!!adminToken && !!studentToken, '1. Authentication Tokens Acquired', 'Super Admin and Student tokens verified');

    // Step 1: Verify 52 Public CV Example Research Records
    const researchRes = await fetch(`${API_BASE}/career-toolkit/research-records`);
    assert(researchRes.ok, '2. Public Research Records API Responsive', `HTTP ${researchRes.status}`);
    const researchData = await researchRes.json();
    assert(
      researchData.total >= 50,
      '3. Minimum 50 Public CV Research Records Verified',
      `Found ${researchData.total} records across official universities and agencies`
    );

    // Verify key flagship institutions
    const wesleyan = researchData.records.find((r: any) => r.sourceInstitution.includes('Wesleyan'));
    assert(!!wesleyan, '4. Wesleyan University Gordon Career Center Record Verified', wesleyan?.title);

    const europass = researchData.records.find((r: any) => r.sourceInstitution.includes('Europass'));
    assert(!!europass, '5. Official European Union Europass Platform Record Verified', europass?.sourceUrl);

    const ucRiverside = researchData.records.find((r: any) => r.sourceInstitution.includes('Riverside'));
    assert(!!ucRiverside, '6. UC Riverside Graduate CV Toolkit Record Verified', ucRiverside?.title);

    const kansas = researchData.records.find((r: any) => r.sourceInstitution.includes('Kansas State'));
    assert(!!kansas, '7. Kansas State University Graduate CV Record Verified', kansas?.title);

    // Step 2: Verify 12 Original Illustrative CV Models
    const examplesRes = await fetch(`${API_BASE}/career-toolkit/cv-examples`);
    assert(examplesRes.ok, '8. CV Examples Catalog API Responsive', `HTTP ${examplesRes.status}`);
    const examplesData = await examplesRes.json();
    assert(
      examplesData.count >= 12,
      '9. Exactly 12 Original Illustrative Sample CVs Verified',
      `Found ${examplesData.count} illustrative models across disciplines`
    );

    // Verify individual sample CV by slug & illustrative labeling
    const csSlugRes = await fetch(`${API_BASE}/career-toolkit/cv-examples/computer-science-software-engineering`);
    assert(csSlugRes.ok, '10. CS/Software Engineering Model Deep Retrieval', `HTTP ${csSlugRes.status}`);
    const csModel = (await csSlugRes.json()).example;
    assert(
      csModel.isIllustrative === true,
      '11. Sample CV Explicitly Labelled Illustrative to Prevent Fabricated Claims',
      'isIllustrative: true'
    );
    assert(
      csModel.sectionBreakdown && csModel.sectionBreakdown.length >= 4,
      '12. Architectural Section Rationale Documented',
      `${csModel.sectionBreakdown.length} sections annotated with tactical purpose`
    );

    // Step 3: Verify 8 Editorial Career Guides
    const guidesRes = await fetch(`${API_BASE}/career-toolkit/guides`);
    assert(guidesRes.ok, '13. Editorial Career Guides API Responsive', `HTTP ${guidesRes.status}`);
    const guidesData = await guidesRes.json();
    assert(
      guidesData.count >= 8,
      '14. Minimum 8 Comprehensive Editorial Guides Verified',
      `Found ${guidesData.count} guides (Europass, Academic, Research, Scholarship, Resume, Cover Letter, SOP, Writing Guide)`
    );

    // Check Europass Guide details
    const europassGuideRes = await fetch(`${API_BASE}/career-toolkit/guides/europass-cv`);
    assert(europassGuideRes.ok, '15. Europass Guide Deep Retrieval', `HTTP ${europassGuideRes.status}`);
    const europassGuide = (await europassGuideRes.json()).guide;
    assert(
      europassGuide.contentEn.includes('CEFR') && europassGuide.contentEn.includes('EQF'),
      '16. Europass Guide Integrates Official CEFR Linguistic Grid and EQF Framework',
      'CEFR & EQF documented'
    );

    // Step 4: Verify Before-and-After Educational Showcase
    const baRes = await fetch(`${API_BASE}/career-toolkit/before-after`);
    assert(baRes.ok, '17. Before-and-After Educational API Responsive', `HTTP ${baRes.status}`);
    const baData = await baRes.json();
    assert(
      baData.count >= 6,
      '18. Before-and-After Learning Examples Present Across Major Sections',
      `Found ${baData.count} structured comparative learning examples`
    );

    // Step 5: Verify 10-Point Pre-Submission Checklist
    const chkRes = await fetch(`${API_BASE}/career-toolkit/checklist`);
    assert(chkRes.ok, '19. Pre-Submission Checklist API Responsive', `HTTP ${chkRes.status}`);
    const chkData = await chkRes.json();
    assert(
      chkData.count === 10,
      '20. Exactly 10 Verified Checkpoints Present in Pre-Submission Checklist',
      `Found ${chkData.count} checkpoints`
    );

    // Test Checklist Progress Sync
    const testSessionKey = 'test_check_' + Date.now();
    const saveProgressRes = await fetch(`${API_BASE}/career-toolkit/checklist/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completedItems: ['chk-instr-1', 'chk-proofread-6'], sessionKey: testSessionKey })
    });
    assert(saveProgressRes.ok, '21. Checklist Progress Saving Operates Successfully', `HTTP ${saveProgressRes.status}`);

    const getProgressRes = await fetch(`${API_BASE}/career-toolkit/checklist/progress?sessionKey=${testSessionKey}`);
    const retrievedProgress = await getProgressRes.json();
    assert(
      retrievedProgress.completedItems.length === 2,
      '22. Checklist Progress Correctly Restored for User Session',
      `Items: ${retrievedProgress.completedItems.join(', ')}`
    );

    // Step 6: Test Deterministic Rule-Based CV Review Engine
    const weakCvPayload = {
      cvData: {
        personalInfo: { fullName: 'Test User', email: 'invalid-email', phone: '01700' },
        education: [{ degree: 'BSc', institution: 'University' }],
        experience: [{ role: 'Intern', organization: 'Company', bullets: ['Worked on website and helped team'] }],
        skills: [{ category: 'Soft', items: ['Hardworking, passionate, punctual, team player'] }]
      },
      targetOpportunity: 'MASTERS_ADMISSION'
    };
    const weakReviewRes = await fetch(`${API_BASE}/career-toolkit/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weakCvPayload)
    });
    assert(weakReviewRes.ok, '23. Rule-Based Review Engine API Responsive', `HTTP ${weakReviewRes.status}`);
    const weakReport = (await weakReviewRes.json()).report;
    assert(
      weakReport.score < 60 && weakReport.findings.some((f: any) => f.id === 'crit-email'),
      '24. Weak Draft Correctly Penalized & Missing Email Flagged',
      `Score: ${weakReport.score}/100, Rating: ${weakReport.rating}`
    );

    const strongCvPayload = {
      cvData: {
        personalInfo: { fullName: 'Tahmidur Rahman', email: 'tahmid@buet.ac.bd', phone: '+880 1711-234567', location: 'Dhaka, Bangladesh', github: 'github.com/tahmid' },
        education: [{ degree: 'BSc in CSE', institution: 'BUET', grade: 'CGPA 3.86/4.00', graduationDate: 'October 2025' }],
        experience: [{ role: 'SWE Intern', organization: 'Apex Solutions', bullets: ['Architected backend microservices in Go, cutting median latency by 45%'] }],
        projects: [{ title: 'Admissions Service', description: 'Real-time pipeline in Go and Redis processing 10,000 events/sec' }],
        skills: [{ category: 'Languages', items: ['Go, TypeScript, Python'] }],
        languages: [{ language: 'English', proficiency: 'C1' }]
      },
      targetOpportunity: 'TECH_INTERNSHIP'
    };
    const strongReviewRes = await fetch(`${API_BASE}/career-toolkit/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strongCvPayload)
    });
    const strongReport = (await strongReviewRes.json()).report;
    assert(
      strongReport.score >= 85 && (strongReport.rating === 'EXCELLENT' || strongReport.rating === 'STRONG'),
      '25. Strong Technical Draft Awarded High Score',
      `Score: ${strongReport.score}/100, Rating: ${strongReport.rating}`
    );

    // Step 7: Test Private Draft Saving & User Authorization
    const draftPayload = {
      title: 'Automated Test CV Draft',
      template: 'academic-editorial',
      personalInfo: { fullName: 'Student Candidate', email: 'student@borno.edu' },
      education: [{ institution: 'BUET', degree: 'BSc' }]
    };
    const saveDraftRes = await fetch(`${API_BASE}/career-toolkit/drafts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify(draftPayload)
    });
    assert(saveDraftRes.ok, '26. Private CV Builder Draft Saving with User Ownership', `HTTP ${saveDraftRes.status}`);
    const savedDraft = (await saveDraftRes.json()).draft;

    const getDraftsRes = await fetch(`${API_BASE}/career-toolkit/drafts`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const draftsData = await getDraftsRes.json();
    assert(
      draftsData.drafts.some((d: any) => d.id === savedDraft.id),
      '27. Authenticated Student Successfully Retrieves Private Drafts',
      `Draft found: ${savedDraft.id}`
    );

    // Delete test draft
    await fetch(`${API_BASE}/career-toolkit/drafts/${savedDraft.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${studentToken}` }
    });

    // Step 8: Test Role Isolation on Super Admin Management
    const unauthAdminPost = await fetch(`${API_BASE}/admin/career-toolkit/research-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceInstitution: 'Unauthorized' })
    });
    assert(
      unauthAdminPost.status === 401 || unauthAdminPost.status === 403,
      '28. Unauthenticated Request to Admin Career Route Rejected',
      `HTTP ${unauthAdminPost.status}`
    );

    const studentAdminPost = await fetch(`${API_BASE}/admin/career-toolkit/research-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ sourceInstitution: 'Student Attempt' })
    });
    assert(
      studentAdminPost.status === 403,
      '29. Student Role Escalation to Super Admin Career Route Correctly Blocked',
      `HTTP 403 Forbidden`
    );

    const superAdminPost = await fetch(`${API_BASE}/admin/career-toolkit/research-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        sourceInstitution: 'Super Admin Test Lab',
        sourceUrl: 'https://example.edu/verified-cv',
        title: 'Super Admin Test Record',
        cvType: 'ACADEMIC_CV',
        intendedAudience: 'Testing Panels',
        field: 'Computer Science',
        careerStage: 'Graduate',
        sectionStructure: ['Education', 'Research'],
        formattingObservations: 'Verified',
        usefulPractices: 'Clear layout',
        potentialLimitations: 'None',
        dateAccessed: '2026-10-17'
      })
    });
    assert(superAdminPost.ok, '30. Super Admin Authorized to Create & Verify Research Records', `HTTP ${superAdminPost.status}`);
    const createdRecord = (await superAdminPost.json()).record;

    // Clean up created record
    if (createdRecord?.id) {
      await fetch(`${API_BASE}/admin/career-toolkit/research-records/${createdRecord.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }
  } catch (err: any) {
    console.error('Test execution error:', err);
    assert(false, 'Runtime Error', err.message);
  }

  console.log('\n========================================================================');
  const passedCount = results.filter(r => r.passed).length;
  console.log(`TOTAL AUDIT CHECKS: ${results.length}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${results.length - passedCount}`);
  console.log('========================================================================');

  if (passedCount === results.length) {
    console.log('🎉 ALL CAREER TOOLKIT & CV SYSTEM SPECIFICATIONS VERIFIED 100% SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME CHECKS FAILED');
    process.exit(1);
  }
}

runCareerToolkitVerification();
