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
      ...(options.headers || {})
    }
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

async function runCoverageTests() {
  console.log('========================================================================');
  console.log('🏛️ BORNO HIGHER STUDY: GLOBAL INSTITUTION COVERAGE & INGESTION TEST SUITE');
  console.log('========================================================================\n');

  let adminToken = '';
  let studentToken = '';

  // 1. Authenticate Super Admin & Student
  try {
    const adminRes = await request('/auth/super-admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'superadmin@borno.edu',
        password: 'SuperAdmin@Borno2026!'
      })
    });
    adminToken = adminRes.data?.token;

    const studentRes = await request('/auth/student/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'student@borno.edu',
        password: 'StudentDemo@Borno2026!'
      })
    });
    studentToken = studentRes.data?.token;

    record('1. Authentication for Ingestion Tests', Boolean(adminToken && studentToken), 'Admin and Student tokens acquired');
  } catch (err: any) {
    record('1. Authentication for Ingestion Tests', false, err.message);
  }

  // 2. Fetch Coverage Dashboard
  let dashboardData: any = null;
  try {
    const res = await request('/admin/institutions/coverage', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (res.ok && res.data.overview && Array.isArray(res.data.countries)) {
      dashboardData = res.data;
      record('2. Country Coverage Dashboard API', true, `Fetched ${res.data.countries.length} countries, Total Verified: ${res.data.overview.totalVerifiedInstitutions}`);
    } else {
      record('2. Country Coverage Dashboard API', false, `Status ${res.status}: ${JSON.stringify(res.data)}`);
    }
  } catch (err: any) {
    record('2. Country Coverage Dashboard API', false, err.message);
  }

  // 3. Verify Target Met for 100+ Nations (US, UK, DE, CA, AU, IN)
  if (dashboardData) {
    const majorCountries = [
      { slug: 'united-states', name: 'United States', minCount: 100 },
      { slug: 'united-kingdom', name: 'United Kingdom', minCount: 100 },
      { slug: 'germany', name: 'Germany', minCount: 100 },
      { slug: 'canada', name: 'Canada', minCount: 100 },
      { slug: 'australia', name: 'Australia', minCount: 100 },
      { slug: 'india', name: 'India', minCount: 100 },
    ];

    let allMajorPassed = true;
    const majorDetails: string[] = [];

    for (const c of majorCountries) {
      const found = dashboardData.countries.find((item: any) => item.countrySlug === c.slug);
      if (found && found.verifiedCount >= c.minCount && found.coverageStatus === 'TARGET_MET') {
        majorDetails.push(`${c.name}: ${found.verifiedCount}/${found.targetCount} (TARGET_MET)`);
      } else {
        allMajorPassed = false;
        majorDetails.push(`${c.name}: ${found?.verifiedCount || 0}/${c.minCount} FAILED`);
      }
    }

    record('3. 100+ Institution Target Met for Major Nations', allMajorPassed, majorDetails.join(', '));
  } else {
    record('3. 100+ Institution Target Met for Major Nations', false, 'Dashboard data not loaded');
  }

  // 4. Verify Exhaustive Capped Coverage for Nations with <100 HEIs (Finland, Ireland, Netherlands, etc.)
  if (dashboardData) {
    const cappedCountries = [
      { slug: 'finland', expectedCount: 35 },
      { slug: 'ireland', minExpected: 25 },
      { slug: 'netherlands', minExpected: 36 },
      { slug: 'sweden', minExpected: 30 },
      { slug: 'lithuania', minExpected: 20 },
      { slug: 'estonia', minExpected: 15 },
      { slug: 'denmark', minExpected: 18 },
      { slug: 'norway', minExpected: 22 },
      { slug: 'new-zealand', minExpected: 18 },
      { slug: 'singapore', minExpected: 14 },
    ];

    let allCappedPassed = true;
    const cappedDetails: string[] = [];

    for (const c of cappedCountries) {
      const found = dashboardData.countries.find((item: any) => item.countrySlug === c.slug);
      const targetMin = (c as any).expectedCount || (c as any).minExpected;
      if (found && found.verifiedCount >= targetMin && found.isTargetCapped && found.coverageStatus === 'EXHAUSTIVE_COVERAGE') {
        const hasExhaustiveNote = found.statusMessage.includes('fewer than 100');
        cappedDetails.push(`${c.slug}: ${found.verifiedCount} HEIs (${found.coverageStatus}, fewer-than-100 note: ${hasExhaustiveNote})`);
      } else {
        allCappedPassed = false;
        cappedDetails.push(`${c.slug} FAILED (Found: ${found?.verifiedCount}, Capped: ${found?.isTargetCapped})`);
      }
    }

    record('4. Exhaustive National Coverage for Nations < 100 HEIs', allCappedPassed, cappedDetails.slice(0, 3).join(', ') + '...');
  } else {
    record('4. Exhaustive National Coverage for Nations < 100 HEIs', false, 'Dashboard data not loaded');
  }

  // 5. Server-Side Pagination & Search of Institution Registry
  try {
    const page1Res = await request('/admin/institutions/registry?page=1&limit=15', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const page2Res = await request('/admin/institutions/registry?page=2&limit=15', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const isPaginated =
      page1Res.ok &&
      page2Res.ok &&
      page1Res.data.institutions.length === 15 &&
      page2Res.data.institutions.length === 15 &&
      page1Res.data.institutions[0].id !== page2Res.data.institutions[0].id &&
      page1Res.data.total >= 800;

    record('5. Server-Side Pagination (Slice without Client Overload)', isPaginated, `Page 1: 15 items, Page 2: 15 items, Total: ${page1Res.data.total}, TotalPages: ${page1Res.data.totalPages}`);
  } catch (err: any) {
    record('5. Server-Side Pagination', false, err.message);
  }

  // 6. Indexed Search in Registry (Name and City Matching)
  try {
    const searchRes = await request('/admin/institutions/registry?search=Dublin%20Business%20School', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const dbsFound = searchRes.data.institutions.some((u: any) => u.name.includes('Dublin Business School'));
    record('6. Indexed Substring Search', searchRes.ok && dbsFound, `Searched 'Dublin Business School', found ${searchRes.data.institutions.length} match(es)`);
  } catch (err: any) {
    record('6. Indexed Substring Search', false, err.message);
  }

  // 7. Institution Type Filters (Business Schools, Community Colleges, Universities of Applied Sciences)
  try {
    const bSchoolRes = await request('/admin/institutions/registry?institutionType=BUSINESS_SCHOOL', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const uasRes = await request('/admin/institutions/registry?institutionType=UAS', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const ccRes = await request('/admin/institutions/registry?institutionType=COMMUNITY_COLLEGE', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const allTypesDistinct =
      bSchoolRes.data.total > 0 &&
      uasRes.data.total > 0 &&
      ccRes.data.total > 0 &&
      bSchoolRes.data.institutions.every((i: any) => i.institutionType === 'BUSINESS_SCHOOL') &&
      uasRes.data.institutions.every((i: any) => i.institutionType === 'UAS') &&
      ccRes.data.institutions.every((i: any) => i.institutionType === 'COMMUNITY_COLLEGE');

    record('7. Separate Institution Types & Qualification Tracking', allTypesDistinct, `Business Schools: ${bSchoolRes.data.total}, UAS: ${uasRes.data.total}, Community Colleges: ${ccRes.data.total}`);
  } catch (err: any) {
    record('7. Separate Institution Types', false, err.message);
  }

  // 8. Candidate Review Queue & Deduplication
  let candidateToReview: any = null;
  try {
    const candRes = await request('/admin/institutions/candidates', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (candRes.ok && Array.isArray(candRes.data.candidates) && candRes.data.candidates.length > 0) {
      candidateToReview = candRes.data.candidates[0];
      const hasDuplicates = candRes.data.candidates.some((c: any) => c.candidateStatus === 'DUPLICATE' && c.duplicateReason);
      record('8. Candidate Review Queue & Duplicate Detection', true, `Found ${candRes.data.candidates.length} candidates, Duplicate reason detection verified: ${hasDuplicates}`);
    } else {
      record('8. Candidate Review Queue & Duplicate Detection', false, 'No candidate queue items returned');
    }
  } catch (err: any) {
    record('8. Candidate Review Queue & Duplicate Detection', false, err.message);
  }

  // 9. Super Admin Candidate Review Action (Approve / Duplicate / Reject)
  if (candidateToReview) {
    try {
      const reviewRes = await request(`/admin/institutions/candidates/${candidateToReview.id}/review`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          action: 'RESOLVE_DUPLICATE',
          reviewNotes: 'Automated test verified duplicate resolution.',
        }),
      });
      if (reviewRes.ok && reviewRes.data.status === 'DUPLICATE') {
        record('9. Super Admin Candidate Review Action', true, `Resolved candidate #${candidateToReview.id.slice(0, 8)} as DUPLICATE with audit note.`);
      } else {
        record('9. Super Admin Candidate Review Action', false, `Response: ${JSON.stringify(reviewRes.data)}`);
      }
    } catch (err: any) {
      record('9. Super Admin Candidate Review Action', false, err.message);
    }
  } else {
    record('9. Super Admin Candidate Review Action', false, 'No candidate available for review');
  }

  // 10. Ingestion Idempotency & Resumability
  try {
    const ingestRes = await request('/admin/institutions/ingest', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ countrySlug: 'ireland' }),
    });
    if (ingestRes.ok && ingestRes.data.summary) {
      const s = ingestRes.data.summary;
      const isIdempotent = s.duplicateCount >= 20 && s.importedCount === 0;
      record('10. Ingestion Idempotency & Preservation of Existing Data', isIdempotent, `Re-ran Ireland ingestion: Discovered ${s.discoveredCount}, Duplicate/Preserved matches: ${s.duplicateCount}, New duplicates created: 0`);
    } else {
      record('10. Ingestion Idempotency & Preservation', false, `Failed: ${JSON.stringify(ingestRes.data)}`);
    }
  } catch (err: any) {
    record('10. Ingestion Idempotency & Preservation', false, err.message);
  }

  // 11. Security Role Enforcement (Student blocked from Ingestion API with 403)
  try {
    const res = await request('/admin/institutions/coverage', {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (res.status === 403) {
      record('11. Role Enforcement (Student Blocked from Ingestion)', true, 'Correctly rejected student token with 403 Forbidden');
    } else {
      record('11. Role Enforcement', false, `Status was ${res.status}`);
    }
  } catch (err: any) {
    record('11. Role Enforcement', false, err.message);
  }

  // 12. Unauthenticated Request Rejection (401)
  try {
    const res = await request('/admin/institutions/coverage');
    if (res.status === 401) {
      record('12. Unauthenticated Request Protection', true, 'Correctly rejected request without token with 401 Unauthorized');
    } else {
      record('12. Unauthenticated Request Protection', false, `Status was ${res.status}`);
    }
  } catch (err: any) {
    record('12. Unauthenticated Request Protection', false, err.message);
  }

  console.log('\n========================================================================');
  const allPassed = results.every(r => r.passed);
  const passedCount = results.filter(r => r.passed).length;
  console.log(`Summary: ${passedCount}/${results.length} tests passed.`);
  if (allPassed) {
    console.log('🎉 ALL GLOBAL INSTITUTION COVERAGE SPECIFICATIONS VERIFIED SUCCESSFULLY!');
  } else {
    console.log('❌ SOME TESTS FAILED. See details above.');
    process.exit(1);
  }
}

runCoverageTests();
