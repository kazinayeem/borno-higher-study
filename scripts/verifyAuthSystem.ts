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

async function runTests() {
  console.log('====================================================');
  console.log('🔒 BORNO HIGHER STUDY: AUTH & PERMISSIONS TEST SUITE');
  console.log('====================================================\n');

  let adminToken = '';
  let studentToken = '';
  let contributorToken = '';

  // 1. Super Admin Login with correct credentials
  try {
    const res = await request('/auth/super-admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'superadmin@borno.edu',
        password: 'SuperAdmin@Borno2026!'
      })
    });
    if (res.ok && res.data.token && res.data.user.role === 'SUPER_ADMIN') {
      adminToken = res.data.token;
      const noPasswordExposed = !res.data.user.password && !res.data.user.passwordHash;
      record('1. Super Admin Login (Valid Credentials)', true, `Token received, role: ${res.data.user.role}, password hash hidden: ${noPasswordExposed}`);
    } else {
      record('1. Super Admin Login (Valid Credentials)', false, `Invalid response: ${JSON.stringify(res.data)}`);
    }
  } catch (err: any) {
    record('1. Super Admin Login (Valid Credentials)', false, err.message);
  }

  // 2. Super Admin Login with Student Credentials (Must Be Rejected with 403)
  try {
    const res = await request('/auth/super-admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'student@borno.edu',
        password: 'StudentDemo@Borno2026!'
      })
    });
    if (res.status === 403) {
      record('2. Super Admin Login with Student Credentials (Strict Role Isolation)', true, 'Correctly rejected with 403 Forbidden');
    } else {
      record('2. Super Admin Login with Student Credentials', false, `Status was ${res.status}`);
    }
  } catch (err: any) {
    record('2. Super Admin Login with Student Credentials', false, err.message);
  }

  // 3. Super Admin Login with Wrong Password (Must Fail with 401)
  try {
    const res = await request('/auth/super-admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'superadmin@borno.edu',
        password: 'WrongPassword999!'
      })
    });
    if (res.status === 401) {
      record('3. Super Admin Login (Wrong Password Security)', true, 'Correctly rejected with 401 Invalid credentials');
    } else {
      record('3. Super Admin Login (Wrong Password)', false, `Status was ${res.status}`);
    }
  } catch (err: any) {
    record('3. Super Admin Login (Wrong Password)', false, err.message);
  }

  // 4. Student Login (Valid Credentials)
  try {
    const res = await request('/auth/student/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'student@borno.edu',
        password: 'StudentDemo@Borno2026!'
      })
    });
    if (res.ok && res.data.token && res.data.user.role === 'STUDENT') {
      studentToken = res.data.token;
      record('4. Student Login (Valid Credentials)', true, `Token received, target degree: ${res.data.user.studentProfile?.targetDegree || 'None'}`);
    } else {
      record('4. Student Login (Valid Credentials)', false, `Response error: ${JSON.stringify(res.data)}`);
    }
  } catch (err: any) {
    record('4. Student Login (Valid Credentials)', false, err.message);
  }

  // 5. Approved Contributor Login
  try {
    const res = await request('/auth/student/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'contributor@borno.edu',
        password: 'ContributorDemo@Borno2026!'
      })
    });
    if (res.ok && res.data.token && res.data.user.isContributor === true) {
      contributorToken = res.data.token;
      record('5. Approved Contributor Login', true, `Contributor flag: ${res.data.user.isContributor}, role: ${res.data.user.role}`);
    } else {
      record('5. Approved Contributor Login', false, `Response: ${JSON.stringify(res.data)}`);
    }
  } catch (err: any) {
    record('5. Approved Contributor Login', false, err.message);
  }

  // 6. Student Registration Flow
  const testStudentEmail = `test.student.${Date.now()}@example.com`;
  try {
    const res = await request('/auth/student/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Automated Test Student',
        email: testStudentEmail,
        password: 'TestPasswordSecure123!',
        targetCountry: 'Lithuania',
        targetDegree: 'Master of Science'
      })
    });
    if (res.ok && res.data.token && res.data.user.email === testStudentEmail) {
      record('6. Student Registration Flow', true, `Registered new student: ${testStudentEmail}`);
    } else {
      record('6. Student Registration Flow', false, `Invalid registration response: ${JSON.stringify(res.data)}`);
    }
  } catch (err: any) {
    record('6. Student Registration Flow', false, err.message);
  }

  // 7. Password Reset Code Request & Verification Flow
  try {
    const reqRes = await request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: testStudentEmail })
    });
    const code = reqRes.data.devCode;
    if (code) {
      const resetRes = await request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: testStudentEmail,
          code,
          newPassword: 'UpdatedSecurePassword456!'
        })
      });
      if (resetRes.ok && resetRes.data.success) {
        // Authenticate with new password
        const loginRes = await request('/auth/student/login', {
          method: 'POST',
          body: JSON.stringify({
            email: testStudentEmail,
            password: 'UpdatedSecurePassword456!'
          })
        });
        if (loginRes.ok && loginRes.data.token) {
          record('7. Password Reset & Verification Flow', true, 'Requested code, reset password, successfully authenticated with new password');
        } else {
          record('7. Password Reset & Verification Flow', false, 'Login failed with updated password');
        }
      } else {
        record('7. Password Reset & Verification Flow', false, `Reset call failed: ${JSON.stringify(resetRes.data)}`);
      }
    } else {
      record('7. Password Reset & Verification Flow', false, 'No devCode returned in response');
    }
  } catch (err: any) {
    record('7. Password Reset & Verification Flow', false, err.message);
  }

  // 8. Re-authentication Endpoint (Sensitive Admin Action Confirmation)
  try {
    const reauthRes = await request('/auth/reauthenticate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ password: 'SuperAdmin@Borno2026!' })
    });
    if (reauthRes.ok && reauthRes.data.verified === true) {
      record('8. Password Re-Authentication (Sensitive Actions)', true, 'Correctly verified admin password');
    } else {
      record('8. Password Re-Authentication', false, `Reauth failed: ${JSON.stringify(reauthRes.data)}`);
    }
  } catch (err: any) {
    record('8. Password Re-Authentication', false, err.message);
  }

  // 9. Unauthorized API Access Protection (No Token to Protected Route)
  try {
    const res = await request('/admin/reports');
    if (res.status === 401) {
      record('9. Protected API Rejection (No Token)', true, 'Rejected with 401 Unauthorized');
    } else {
      record('9. Protected API Rejection (No Token)', false, `Status was ${res.status}`);
    }
  } catch (err: any) {
    record('9. Protected API Rejection (No Token)', false, err.message);
  }

  // 10. Role Escalation Prevention (Student Token accessing Admin Route)
  try {
    const res = await request('/admin/reports', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    if (res.status === 403) {
      record('10. Role Escalation Prevention (Student -> Admin Route)', true, 'Correctly blocked with 403 Forbidden');
    } else {
      record('10. Role Escalation Prevention (Student -> Admin Route)', false, `Status was ${res.status}`);
    }
  } catch (err: any) {
    record('10. Role Escalation Prevention (Student -> Admin Route)', false, err.message);
  }

  // 11. Super Admin Access to Admin Route
  try {
    const res = await request('/admin/reports', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const reportsList = Array.isArray(res.data) ? res.data : res.data?.reports;
    if (res.ok && Array.isArray(reportsList)) {
      record('11. Super Admin Authorized Access to Admin Route', true, `Successfully fetched ${reportsList.length} reports with Super Admin token`);
    } else {
      record('11. Super Admin Authorized Access to Admin Route', false, `Status ${res.status}: ${JSON.stringify(res.data)}`);
    }
  } catch (err: any) {
    record('11. Super Admin Authorized Access to Admin Route', false, err.message);
  }

  // 12. Password Hash Protection (Check that API endpoints never return passwordHash)
  try {
    const res = await request('/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const hasHash = 'passwordHash' in res.data || 'password' in res.data;
    if (!hasHash) {
      record('12. Password Hash Leak Prevention in API', true, 'Neither password nor passwordHash is present in auth response');
    } else {
      record('12. Password Hash Leak Prevention in API', false, 'CRITICAL: passwordHash exposed in /api/auth/me!');
    }
  } catch (err: any) {
    record('12. Password Hash Leak Prevention in API', false, err.message);
  }

  console.log('\n====================================================');
  const allPassed = results.every(r => r.passed);
  const passedCount = results.filter(r => r.passed).length;
  console.log(`Summary: ${passedCount}/${results.length} tests passed.`);
  if (allPassed) {
    console.log('🎉 ALL AUTH & PERMISSION SPECIFICATIONS VERIFIED SUCCESSFULLY!');
  } else {
    console.log('❌ SOME TESTS FAILED. See details above.');
    process.exit(1);
  }
}

runTests();
