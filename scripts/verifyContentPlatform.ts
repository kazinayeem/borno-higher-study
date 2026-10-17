import { PrismaClient } from '../server/node_modules/@prisma/client';

const prisma = new PrismaClient();
const API_BASE = 'http://localhost:5001/api';

async function runContentPlatformVerification() {
  console.log('🧪 Starting Borno Higher Study Content Platform & Editorial Studio Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}${details ? ` -> ${details}` : ''}`);
      failed++;
    }
  }

  try {
    // ------------------------------------------------------------------------
    // TEST 1: Database Article Count and Distinctness
    // ------------------------------------------------------------------------
    console.log('🔍 Test 1: Verifying Database Article Counts & Distinctness...');
    const totalArticles = await prisma.article.count();
    assert(totalArticles >= 100, `Article Count >= 100 (Found ${totalArticles})`);

    const allArticles = await prisma.article.findMany({
      select: { id: true, title: true, slug: true, status: true, wordCount: true, categoryId: true },
    });

    const uniqueSlugs = new Set(allArticles.map((a) => a.slug));
    assert(uniqueSlugs.size === allArticles.length, `All ${allArticles.length} Article Slugs are Unique`);

    const uniqueTitles = new Set(allArticles.map((a) => a.title.toLowerCase().trim()));
    assert(uniqueTitles.size === allArticles.length, `All ${allArticles.length} Article Titles are Unique`);

    const longFormArticles = allArticles.filter((a) => a.wordCount >= 1000);
    assert(
      longFormArticles.length >= 80,
      `Comprehensive Long-Form Depth: ${longFormArticles.length}/${allArticles.length} articles exceed 1,000 words`
    );

    // ------------------------------------------------------------------------
    // TEST 2: Category Distribution & Authors
    // ------------------------------------------------------------------------
    console.log('\n🔍 Test 2: Verifying Categories, Authors & Research Papers...');
    const categories = await prisma.articleCategory.findMany({
      include: { _count: { select: { articles: true } } },
    });
    assert(categories.length === 8, `All 8 Required Categories Exist (Found ${categories.length})`);

    const categoriesWithArticles = categories.filter((c) => c._count.articles > 0);
    assert(
      categoriesWithArticles.length === 8,
      `Every Category Has Seeded Articles (Found ${categoriesWithArticles.length}/8)`
    );

    const authors = await prisma.articleAuthor.findMany();
    assert(authors.length >= 4, `At Least 4 Expert Author Profiles Exist (Found ${authors.length})`);

    const researchPapers = await prisma.researchPaper.findMany({
      include: { authors: true },
    });
    assert(researchPapers.length >= 4, `Peer-Reviewed Research Papers Exist (Found ${researchPapers.length})`);
    const papersWithDois = researchPapers.filter((p) => !!p.doi);
    assert(papersWithDois.length >= 3, `Research Papers Have Valid DOIs (Found ${papersWithDois.length})`);

    // ------------------------------------------------------------------------
    // TEST 3: Institutional and Country Comparisons
    // ------------------------------------------------------------------------
    console.log('\n🔍 Test 3: Verifying University & Country Comparisons...');
    const uniComparisons = await prisma.universityComparison.findMany({
      include: { dataPoints: true },
    });
    assert(uniComparisons.length >= 1, `University Comparisons Exist (Found ${uniComparisons.length})`);
    assert(
      uniComparisons[0].dataPoints.length >= 4,
      `University Comparison Contains Verified Data Points (${uniComparisons[0]?.dataPoints.length} points)`
    );

    const countryComparisons = await prisma.countryComparison.findMany({
      include: { dataPoints: true },
    });
    assert(countryComparisons.length >= 1, `Country Comparisons Exist (Found ${countryComparisons.length})`);
    assert(
      countryComparisons[0].dataPoints.length >= 4,
      `Country Comparison Contains Verified Data Points (${countryComparisons[0]?.dataPoints.length} points)`
    );

    // ------------------------------------------------------------------------
    // TEST 4: Public APIs (HTTP Endpoints)
    // ------------------------------------------------------------------------
    console.log('\n🔍 Test 4: Testing Public APIs...');
    const articlesRes = await fetch(`${API_BASE}/blog/articles?limit=5`);
    const articlesJson = await articlesRes.json();
    assert(articlesRes.ok && articlesJson.articles.length === 5, 'GET /api/blog/articles returns paginated articles');
    assert(articlesJson.total >= 80, `GET /api/blog/articles total count >= 80 (Found ${articlesJson.total})`);

    const sampleSlug = articlesJson.articles[0].slug;
    const singleRes = await fetch(`${API_BASE}/blog/articles/${sampleSlug}`);
    const singleJson = await singleRes.json();
    assert(singleRes.ok && singleJson.slug === sampleSlug, `GET /api/blog/articles/:slug returns full article`);
    assert(
      singleJson.sources && singleJson.sources.length > 0,
      `Article Details Includes Verified Primary Sources (Found ${singleJson.sources?.length} sources)`
    );

    const catsRes = await fetch(`${API_BASE}/blog/categories`);
    const catsJson = await catsRes.json();
    assert(catsRes.ok && catsJson.length === 8, 'GET /api/blog/categories returns all 8 categories');

    const papersRes = await fetch(`${API_BASE}/research/papers`);
    const papersJson = await papersRes.json();
    assert(papersRes.ok && papersJson.length >= 4, 'GET /api/research/papers returns peer-reviewed papers');

    const uCompRes = await fetch(`${API_BASE}/compare/universities`);
    const uCompJson = await uCompRes.json();
    assert(uCompRes.ok && uCompJson.length >= 1, 'GET /api/compare/universities returns comparison matrix');

    const cCompRes = await fetch(`${API_BASE}/compare/countries`);
    const cCompJson = await cCompRes.json();
    assert(cCompRes.ok && cCompJson.length >= 1, 'GET /api/compare/countries returns destination matrix');

    // ------------------------------------------------------------------------
    // TEST 5: Reader Factual Correction Submission
    // ------------------------------------------------------------------------
    console.log('\n🔍 Test 5: Testing Reader Correction Submission & Audit...');
    const corrPayload = {
      articleId: singleJson.id,
      articleTitle: singleJson.title,
      articleUrl: `http://localhost:5173/blog/${sampleSlug}`,
      correctionCategory: 'FACTUAL_ERROR',
      claimedErrorText: 'Test audit sentence regarding student visa holding period.',
      suggestedCorrection: 'Updated holding period benchmark from 28 days to statutory gazetted timeline.',
      officialEvidenceUrl: 'https://www.gov.uk/student-visa',
      reporterName: 'Test Academic Reviewer',
      reporterEmail: 'reviewer@borno.edu',
    };

    const corrRes = await fetch(`${API_BASE}/blog/corrections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corrPayload),
    });
    const corrJson = await corrRes.json();
    assert(corrRes.ok && corrJson.success && !!corrJson.reportId, 'Reader Can Submit Factual Correction Report');

    // ------------------------------------------------------------------------
    // TEST 6: Super Admin Editorial Studio Authentication & APIs
    // ------------------------------------------------------------------------
    console.log('\n🔍 Test 6: Testing Super Admin Editorial Studio APIs...');
    const adminLoginRes = await fetch(`${API_BASE}/auth/super-admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'superadmin@borno.edu',
        password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@Borno2026!',
      }),
    });
    const adminLoginJson = await adminLoginRes.json();
    assert(adminLoginRes.ok && !!adminLoginJson.token, 'Super Admin Login Successful');

    const adminHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminLoginJson.token}`,
    };

    const overviewRes = await fetch(`${API_BASE}/admin/content/overview`, { headers: adminHeaders });
    const overviewJson = await overviewRes.json();
    assert(overviewRes.ok && overviewJson.metrics.totalArticles >= 100, 'Super Admin Content Overview Fetched');
    assert(
      overviewJson.metrics.totalSourcesCount > 0,
      `Super Admin Sources Tracked (Found ${overviewJson.metrics.totalSourcesCount})`
    );

    // Test AI Research Drafter (Strictly status: DRAFT, Never Auto-Publish)
    console.log('\n🔍 Test 7: Testing AI Evidence Drafter (Drafts Only, Never Auto-Publish)...');
    const testTopic = `Autonomous AI Verification in Higher Education Admissions ${Date.now()}`;
    const aiDraftRes = await fetch(`${API_BASE}/admin/content/ai-draft`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        topic: testTopic,
        intendedAudience: 'POSTGRAD_RESEARCHERS',
        categorySlug: 'university-comparisons',
      }),
    });
    const aiDraftJson = await aiDraftRes.json();
    assert(aiDraftRes.ok && aiDraftJson.status === 'COMPLETED', 'AI Evidence Drafter Pipeline Executed');
    assert(!!aiDraftJson.articleDraftId, 'AI Draft Created in Database');

    // Verify created article status is strictly DRAFT
    const createdDraft = await prisma.article.findUnique({
      where: { id: aiDraftJson.articleDraftId },
    });
    assert(createdDraft?.status === 'DRAFT', 'AI Draft Status is Strictly "DRAFT" (Never Auto-Published)');

    // Test Editorial Review & Publishing Gate
    const reviewRes = await fetch(`${API_BASE}/admin/content/articles/${aiDraftJson.articleDraftId}/review`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        reviewStage: 'FACT_CHECK',
        decision: 'APPROVED',
        notes: 'Verified all references against DAAD and official university registers.',
        factCheckVerified: true,
      }),
    });
    const reviewJson = await reviewRes.json();
    assert(reviewRes.ok && reviewJson.article.status === 'PUBLISHED', 'Super Admin Approved Article Successfully Published');

    // Test Source Auditing
    const verifySourcesRes = await fetch(`${API_BASE}/admin/content/sources/verify`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({}),
    });
    const verifySourcesJson = await verifySourcesRes.json();
    assert(
      verifySourcesRes.ok && verifySourcesJson.checkedCount > 0,
      `Super Admin Outbound Source Verification Completed (${verifySourcesJson.checkedCount} sources audited)`
    );

    // Clean up test draft
    if (aiDraftJson.articleDraftId) {
      await prisma.article.delete({ where: { id: aiDraftJson.articleDraftId } }).catch(() => {});
    }

    // ------------------------------------------------------------------------
    // SUMMARY REPORT
    // ------------------------------------------------------------------------
    console.log('\n================================================================');
    console.log(`📋 Content Platform Verification Complete: ${passed} Passed, ${failed} Failed`);
    console.log('================================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unexpected error in test suite:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runContentPlatformVerification();
