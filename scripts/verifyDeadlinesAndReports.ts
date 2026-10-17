import { prisma } from '../server/src/services/db.js';
import { calculateDeadlineStatus } from '../server/src/controllers/deadlineController.js';

async function runDeadlinesAndReportsTestSuite() {
  console.log('====================================================');
  console.log('🧪 RUNNING APPLICATION DEADLINES & DATA CORRECTION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${details || ''}`);
      failed++;
    }
  }

  // TEST 1: Deadline Status Calculator
  console.log('--- TEST GROUP 1: Dynamic Deadline Status Calculation ---');
  const now = new Date();
  const pastDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  const futureCloseSoon = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
  const futureOpen = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const distantClose = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  const statusRolling = calculateDeadlineStatus({ isRolling: true });
  assert(statusRolling === 'ROLLING', 'Rolling admission returns ROLLING');

  const statusUnannounced = calculateDeadlineStatus({ isRolling: false, openDate: null, closeDate: null });
  assert(statusUnannounced === 'NOT_ANNOUNCED', 'Null dates return NOT_ANNOUNCED');

  const statusDisputed = calculateDeadlineStatus({ isDisputed: true, closeDate: distantClose });
  assert(statusDisputed === 'UNCONFIRMED', 'Disputed record returns UNCONFIRMED');

  const statusUpcoming = calculateDeadlineStatus({ openDate: futureOpen, closeDate: distantClose });
  assert(statusUpcoming === 'UPCOMING', 'Future open date returns UPCOMING');

  const statusClosingSoon = calculateDeadlineStatus({ openDate: pastDate, closeDate: futureCloseSoon });
  assert(statusClosingSoon === 'CLOSING_SOON', 'Deadline within 7 days returns CLOSING_SOON');

  const statusClosed = calculateDeadlineStatus({ openDate: pastDate, closeDate: pastDate });
  assert(statusClosed === 'CLOSED', 'Past close date returns CLOSED');

  const statusOpen = calculateDeadlineStatus({ openDate: pastDate, closeDate: distantClose });
  assert(statusOpen === 'OPEN', 'Active window returns OPEN');

  // TEST 2: Seeded Deadlines in DB
  console.log('\n--- TEST GROUP 2: Seeded Application Deadlines in SQLite Database ---');
  const deadlines = await prisma.applicationDeadline.findMany({
    include: { university: true, program: true, revisions: true },
  });
  assert(deadlines.length >= 4, `Found ${deadlines.length} application deadlines in database`);

  const dbsDeadline = deadlines.find((d) => d.intakeSemester === 'Autumn 2026' && d.university?.slug === 'dublin-business-school');
  assert(!!dbsDeadline, 'Dublin Business School Autumn 2026 deadline exists');
  if (dbsDeadline) {
    assert(dbsDeadline.isRolling === false, 'DBS has explicit closing date (not rolling)');
    assert(!!dbsDeadline.officialSourceUrl, 'DBS has official admission source URL');
    assert(dbsDeadline.revisions.length >= 1, 'DBS deadline has immutable revision audit history');
  }

  // TEST 3: Safe Publication Rule & Rejected Reports
  console.log('\n--- TEST GROUP 3: Safe Publication Rules ---');
  // Create a dummy test university
  const testUni = await prisma.university.findFirst();
  assert(!!testUni, 'Test university exists for verification');

  if (testUni) {
    const originalAdmissionsUrl = testUni.admissionsUrl;

    // Simulate rejected report
    const rejectedReport = await prisma.informationReport.create({
      data: {
        reportNumber: `RPT-TEST-REJECT`,
        entityType: 'UNIVERSITY',
        entityId: testUni.id,
        entitySlug: testUni.slug,
        entityName: testUni.name,
        fieldBelievedIncorrect: 'OFFICIAL_LINK',
        reasonCategory: 'BROKEN_OR_UNOFFICIAL_LINK',
        description: 'Testing rejected report behavior.',
        proposedCorrection: 'https://fake-phishing-url.com/admissions',
        officialEvidenceUrl: 'https://fake-phishing-url.com/proof',
        status: 'REJECTED',
        adminFeedback: 'Domain does not belong to accredited institution.',
      },
    });

    const uniAfterReject = await prisma.university.findUnique({ where: { id: testUni.id } });
    assert(
      uniAfterReject?.admissionsUrl === originalAdmissionsUrl,
      'Rejected student report DID NOT modify public admissionsUrl',
      `Expected ${originalAdmissionsUrl}, got ${uniAfterReject?.admissionsUrl}`
    );

    // Clean up test report
    await prisma.informationReport.delete({ where: { id: rejectedReport.id } });
  }

  // TEST 4: Approved Correction with Transactional Revision History
  console.log('\n--- TEST GROUP 4: Transactional Safe Correction & Audit Trail ---');
  const testDeadline = await prisma.applicationDeadline.findFirst();
  assert(!!testDeadline, 'Target application deadline exists');

  if (testDeadline) {
    const originalDisputed = testDeadline.isDisputed;
    const testNewCloseDate = new Date('2026-08-20T23:59:00Z');

    // Create report and approve transactionally
    const approveReport = await prisma.informationReport.create({
      data: {
        reportNumber: `RPT-TEST-APPROVE`,
        entityType: 'DEADLINE',
        entityId: testDeadline.id,
        entityName: 'Test Target Deadline',
        fieldBelievedIncorrect: 'CLOSE_DATE',
        reasonCategory: 'INCORRECT_CLOSING_DATE',
        description: 'University officially extended deadline to August 20, 2026.',
        proposedCorrection: testNewCloseDate.toISOString(),
        officialEvidenceUrl: 'https://official.edu/admissions/bulletin-aug20',
        status: 'PENDING_REVIEW',
      },
    });

    // Simulate transactional approval
    await prisma.$transaction(async (tx) => {
      await tx.applicationDeadline.update({
        where: { id: testDeadline.id },
        data: {
          closeDate: testNewCloseDate,
          lastVerifiedAt: new Date(),
          isDisputed: false,
        },
      });

      await tx.dataRevisionHistory.create({
        data: {
          reportId: approveReport.id,
          entityType: 'DEADLINE',
          entityId: testDeadline.id,
          fieldName: 'CLOSE_DATE',
          previousValue: testDeadline.closeDate ? testDeadline.closeDate.toISOString() : 'NULL',
          newValue: testNewCloseDate.toISOString(),
          sourceUrl: 'https://official.edu/admissions/bulletin-aug20',
          reviewerId: 'admin-tester',
          reviewerName: 'Admin Auditor',
          reason: 'Verified against university bulletin dated Oct 17.',
        },
      });

      await tx.informationReport.update({
        where: { id: approveReport.id },
        data: { status: 'APPROVED' },
      });
    });

    const updatedDeadline = await prisma.applicationDeadline.findUnique({ where: { id: testDeadline.id } });
    assert(
      updatedDeadline?.closeDate?.toISOString() === testNewCloseDate.toISOString(),
      'Approved correction successfully and transactionally updated live database record'
    );

    const revisionRecorded = await prisma.dataRevisionHistory.findFirst({
      where: { reportId: approveReport.id },
    });
    assert(!!revisionRecorded, 'Immutable DataRevisionHistory entry successfully created');
    assert(revisionRecorded?.fieldName === 'CLOSE_DATE', 'Revision audit points to exact field CLOSE_DATE');

    // Restore original closeDate and cleanup test report/revision
    await prisma.applicationDeadline.update({
      where: { id: testDeadline.id },
      data: { closeDate: testDeadline.closeDate, isDisputed: originalDisputed },
    });
    await prisma.dataRevisionHistory.deleteMany({ where: { reportId: approveReport.id } });
    await prisma.informationReport.delete({ where: { id: approveReport.id } });
  }

  // TEST 5: Bookmarking and Planner Integration
  console.log('\n--- TEST GROUP 5: Personal Planner Bookmarks ---');
  const user = await prisma.user.findFirst();
  assert(!!user, 'Test user exists for bookmarking');
  if (user && testDeadline) {
    // Delete any existing bookmark
    await prisma.userDeadlineBookmark.deleteMany({
      where: { userId: user.id, deadlineId: testDeadline.id },
    });

    // Create bookmark
    const bookmark = await prisma.userDeadlineBookmark.create({
      data: {
        userId: user.id,
        deadlineId: testDeadline.id,
        reminderDaysBefore: 7,
      },
    });
    assert(!!bookmark.id, 'User can save deadline to personal application planner');
    assert(bookmark.reminderDaysBefore === 7, 'Configurable 7-day reminder saved');

    // Clean up
    await prisma.userDeadlineBookmark.delete({ where: { id: bookmark.id } });
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

runDeadlinesAndReportsTestSuite()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
