# Borno Higher Study — Global Higher Education Directory & Community Platform

**Tagline:** *Your Future. Your University. Your World.*

Borno Higher Study is an international post-secondary education discovery and governance platform designed to help students discover universities, colleges, business schools, institutes of technology, and pathway providers across 42+ study destinations. The platform features verified application deadlines, living cost calculations in Bangladeshi Taka (BDT), English proficiency checking (IELTS/TOEFL/PTE), collaborative student application planning, financial document verification, community data-correction workflows, and strict role-based administration.

---

## 🏛️ System Architecture & Highlights

1. **Global Multi-Tier Directory**
   - Universities, colleges, business schools, institutes of technology, and pathway providers.
   - Verified institutions including Dublin Business School, Griffith College, Vilnius University, and Kaunas University of Technology.
   - Comprehensive living costs in local currency and real-time conversion to Bangladeshi Taka (BDT).
   - Official immigration and student visa portals (`migri.fi`, `ind.nl`, `make-it-in-germany.com`, `irishimmigration.ie`, etc.).

2. **Dual Authentication & Role Isolation**
   - **Super Admin Login (`/super-admin/login`)**: High-security administrative entrance with audit logging and password re-authentication for sensitive operations. Redirects to `/super-admin/dashboard`.
   - **Student Portal Login (`/student/login`)**: Student authentication supporting registration, login, logout, and 6-digit code password reset. Approved student contributors gain verified publishing rights. Redirects to `/student/dashboard`.
   - Backend role enforcement via JWT and middleware (`verifySuperAdmin`, `requireRole`). Privileges cannot be bypassed by client-side state manipulation.
   - Passwords stored as strong salted bcrypt hashes (`>= 10` salt rounds). Plaintext passwords and hashes are strictly excluded from API responses.

3. **Global Institution Coverage & Ingestion Architecture (Section 13)**
   - **100+ Institution Milestone for Major Nations:** Guaranteed >= 100 verified institutions for destination countries where available:
     - United States: 116/100 verified (`TARGET_MET`)
     - United Kingdom: 112/100 verified (`TARGET_MET`)
     - Germany: 116/100 verified (`TARGET_MET`)
     - Canada: 106/100 verified (`TARGET_MET`)
     - Australia: 102/100 verified (`TARGET_MET`)
     - India: 103/100 verified (`TARGET_MET`)
   - **Exhaustive National Directories for Nations < 100 HEIs:** Never invent fake institutions to reach 100. For countries with fewer than 100 accredited higher education providers nationwide, all eligible providers are indexed and marked with explicit transparent disclaimers:
     - Finland: 35/35 (`35 verified institutions — fewer than 100 currently verified or available`)
     - Ireland: 26/25 (`26 verified institutions — fewer than 100 currently verified or available`)
     - Netherlands: 37/36 (`37 verified institutions — fewer than 100 currently verified or available`)
     - Sweden: 31/31, Lithuania: 20/20, Estonia: 15/15, Denmark: 18/18, Norway: 23/22, New Zealand: 18/18, Singapore: 14/14.
   - **Separate Institution Types & Qualification Tracking:**
     - Universities, Colleges, Business Schools (e.g., LBS, INSEAD, WHU, ESMT), Universities of Applied Sciences (Fachhochschulen / UAS), Institutes of Technology, Community Colleges, Pathway Providers (INTO, Kaplan, Navitas), and Vocational/TAFE institutes.
     - Discrete qualification level tracking: Bachelor's, Master's, Doctoral, Foundation/Pathway, Associate, Vocational Certificate.
   - **Automated Collection Pipeline & 3-Tier Deduplication:**
     - Normalization of institution names, domains, WHED references, and country codes.
     - 3-tier duplicate detection: (1) Domain/Host match, (2) Normalized Name match, (3) WHED IAU reference match.
     - Unverified, uncertain, or duplicate candidate records are safely routed to the `InstitutionCandidate` review queue for Super Admin resolution (`APPROVE`, `REJECT`, `RESOLVE_DUPLICATE`).
     - Idempotent upsert operations preserve all approved records without duplicate creation on repeated ingestion runs.
   - **Super Admin Country Coverage Dashboard:**
     - Displays country targets, verified counts, candidate counts, duplicate queues, official source coverage, last import date, last verification, and coverage status badge (`TARGET_MET`, `EXHAUSTIVE_COVERAGE`, `IN_PROGRESS`, `ATTENTION_NEEDED`).
     - Server-side pagination and indexed substring search without loading hundreds of records in browser memory.
     - Course discovery is kept strictly decoupled from institution discovery to prevent duplicate institution rows per program.

4. **Application Deadlines & Intakes Engine**
   - Official opening, closing, and extended application dates with timezone awareness.
   - Domestic vs. international eligibility, application fees, official admissions portal links, and last-verified timestamps.
   - Real-time intake countdown timers, ICS calendar export, and user bookmarks.

5. **Community Reports & Verified Corrections**
   - Public "Report Incorrect Information" modal on all institution and program pages.
   - Contributor resubmission workflow for "More Info Requested" statuses.
   - Super Admin review queue with one-click approval, field sync, and audit logging.

6. **Financial Document Verification & Student Contributor System**
   - Multi-tier document review queue for student financial proofs and bank statements.
   - Contributor application submission and review workflow with tiered privileges.

7. **English Test Comparison & Global University Acceptance Module**
   - **Premium Comparison Page (`/english-tests`)**: Side-by-side comparison of 7 test formats:
     - IELTS Academic, IELTS for UKVI Academic, PTE Academic, PTE Academic Online, PTE Academic UKVI, TOEFL iBT (Test Centre), and TOEFL iBT Home Edition.
     - Compares test duration, speaking format (face-to-face vs. AI dual scoring), score scale, score updates (IELTS One Skill Retake, 2-hr shorter TOEFL format), typical result turnaround with provider attribution, official preparation portals, and direct booking links.
     - Published Bangladesh exam fees from official provider sources only (IDP, British Council, Pearson, ETS) with real-time USD to BDT conversions.
     - Strict non-inference rules and critical visa restriction notices (e.g. at-home online exams rejected for UKVI Student Visa, Canada SDS, or Australian Subclass 500).
   - **University English-Test Acceptance Database (`/university-test-acceptance`)**:
     - Dedicated database model storing requirements by university, program, level, test, delivery format, overall minimums, and component scores (L, R, W, S).
     - Distinct statuses: `ACCEPTED`, `ACCEPTED_WITH_CONDITIONS`, `NOT_ACCEPTED`, `UNDER_REVIEW`, `NOT_CONFIRMED`.
     - Seeded with verified policies across initial 15 UK flagship universities (Oxford, Cambridge, Imperial, UCL, Edinburgh, Manchester, Birmingham, Bristol, Leeds, King's College London, Warwick, Glasgow, Nottingham, Southampton, Sheffield).
     - Strict non-inference: acceptance of an in-person test-centre exam never implies acceptance of its online version.
   - **Student Test Recommendation Wizard (`/english-test-advisor`)**:
     - Step-by-step advisor checking destination country, degree level, university shortlist, delivery preference, and budget.
     - Automatically flags conflicts (e.g., when a shortlisted university strictly refuses at-home online exams) and recommends the test format accepted by the largest proportion of shortlisted courses.
   - **Super Admin Governance & Student Reporting**:
     - "English Tests & Acceptance" tab in Super Admin dashboard for fee management, policy creation, and stale source review (>180 days).
     - "Report incorrect information" modal on every fee and acceptance record. Student submissions are queued for admin review with revision history and audit logging.

8. **Medium of Instruction (MOI) Acceptance & English-Test Waiver Directory**
   - **MOI Acceptance Directory (`/moi-acceptance`)**:
     - Authoritative database defining official university Medium of Instruction certificates and language exemptions.
     - Tracks degree duration requirements (e.g. 2, 3, or 4 years), graduation validity windows (2, 3, or 5 years), and official wording requirements.
     - Distinct acceptance statuses: `ACCEPTED_FOR_SPECIFIED_COURSES`, `ACCEPTED_WITH_CONDITIONS`, `NOT_ACCEPTED`, `ACCEPTED_ONLY_FOR_SELECTED_INSTITUTIONS`, `OFFICIAL_POLICY_NOT_VERIFIED`, `POLICY_REQUIRES_DIRECT_CONFIRMATION`.
     - Seeded initial benchmarks: Aston University (Bangladesh vetted roster: BUET, DU IBA, NSU, BRAC, etc.), University of Alberta (2+ yr graduate instruction), University of Ottawa (3-yr recency limit), McGill University (GPS 2-yr degree rule with departmental discretion), Maynooth University (2-yr validity with Irish ISD visa alerts), plus Oxford and Cambridge (`NOT_ACCEPTED`).
     - Explicit regulatory distinction: Emphasizes that university academic acceptance does NOT automatically satisfy immigration or visa requirements.
   - **Interactive MOI Eligibility Checker (`/moi-eligibility-checker`)**:
     - Questionnaire evaluating target country, university, completed degree, awarding institution, 100% English medium delivery, graduation year, and official letter availability.
     - Returns 4 distinct outcomes: `POTENTIALLY_ELIGIBLE`, `CONDITIONAL_OR_ADDITIONAL_EVIDENCE`, `SEPARATE_TEST_NECESSARY`, `POLICY_UNCLEAR_CONTACT_UNI`.
     - Direct primary policy links, applicable submission conditions, and transparent disclaimers.
   - **Super Admin Governance & Community Reports**:
     - "MOI & Language Waivers" tab in Super Admin dashboard for policy creation, editing, and outdated policy review (>180 days).
     - Dedicated student reporting modal and approval queue with immutable revision tracking (`MoiPolicyRevision`).

---

## 🗄️ Database Setup (SQLite & Prisma ORM)

The application uses **SQLite** for zero-configuration, robust local development paired with **Prisma ORM (v5/v6)**.

### Database Connection

Configured in `server/prisma/schema.prisma` and `server/.env`:
```env
DATABASE_URL="file:./dev.db"
```

The SQLite database file is stored locally at `server/prisma/dev.db`.

### Prisma Models Included
- **User & Role**: Super Admin, Admin, Moderator, Data Editor, Contributor, Student.
- **StudentProfile**: 1-to-1 profile tracking degree, target country, GPA, and test scores.
- **ContributorApplication**: Student applications for contributor status.
- **University, Program & Scholarship**: Post-secondary institutions, degree offerings, and funding programs.
- **ApplicationDeadline**: Intake deadlines, dates, timezones, and verification status.
- **OfficialSource**: Verifiable primary URLs (university registrar, ministry of education, embassy).
- **InformationReport & CorrectionProposal**: Community feedback, diffs, and change proposals.
- **Post & ModerationReview**: Student community posts and administrative reviews.
- **FinancialDocumentSubmission & DocumentReviewHistory**: Document verification pipeline.
- **English Test Models**:
  - `EnglishTestProvider`: Official test vendors (IDP, British Council, Pearson, ETS).
  - `EnglishTestFormat`: Exam types and delivery modalities (IELTS Academic, IELTS for UKVI, PTE Academic, PTE Online, PTE UKVI, TOEFL iBT, TOEFL Home Edition).
  - `EnglishTestFee`: Official registration fees, Bangladesh pricing (BDT/USD), exchange rate timestamps, and verification metadata.
  - `UniversityTestPolicy`: University and program-level score requirements, minimum components (L, R, W, S), and non-inferred acceptance statuses (`ACCEPTED`, `ACCEPTED_WITH_CONDITIONS`, `NOT_ACCEPTED`, `UNDER_REVIEW`, `NOT_CONFIRMED`).
  - `TestPolicyRevision`: Traceable audit trail of policy updates with reviewer ID and previous value diffs.
  - `TestSource`: Primary official documentation URLs and verification timestamps.
  - `TestAcceptanceCorrection`: Student-submitted fee and policy correction queue.
  - `StudentTestPreference`: Student advisor shortlist and preference persistence.
- **Medium of Instruction (MOI) Models**:
  - `MoiPolicy`: University and course-level MOI rules, degree duration, graduation validity windows, certificate wording, and visa separation notes.
  - `MoiEligibilityCondition`: Mandatory or optional criteria (e.g. transcript notation, institutional roster).
  - `EnglishLanguageExemption`: Specific university exemptions (majority English countries, native degrees).
  - `MoiPolicySource`: Primary institutional calendar and admissions sources.
  - `MoiPolicyRevision`: Audit trail of policy edits and administrative actions.
  - `MoiCorrectionReport`: Student-submitted policy corrections review queue.
- **Notification & AuditLog**: Security audit trails and user notifications.

---

## 💻 Package Manager & CLI Commands

You can run Borno Higher Study using either **npm** or **pnpm**.

### 1. Initial Setup & Prisma Generation

```bash
# Using npm
npm install
npm --prefix server run prisma:generate

# Or using pnpm
pnpm install
pnpm --filter ./server prisma:generate
```

### 2. Database Migrations & Push

To sync schema changes to your local SQLite database without wiping existing data:

```bash
# Using npm
npm run db:push

# Using pnpm (or direct prisma CLI)
pnpm --filter ./server prisma db push
# or to record a formal migration:
pnpm --filter ./server prisma migrate dev --name init
```

### 3. Idempotent Database Seeding

The seed script is safe to run multiple times (`upsert` logic prevents duplicate entries or record deletion):

```bash
# Using npm
npm run db:seed

# Using pnpm
pnpm --filter ./server run prisma:seed
```

### 4. Running the Development Server

```bash
# Run both client (port 5173) and backend server (port 5001)
npm run dev

# Or run client and server independently:
npm run dev:client
npm run dev:server
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Super Admin Login:** [http://localhost:5173/super-admin/login](http://localhost:5173/super-admin/login)
- **Student Login:** [http://localhost:5173/student/login](http://localhost:5173/student/login)
- **Backend API:** [http://localhost:5001/api](http://localhost:5001/api)
- **API Health Check:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 🔑 Development Credentials & Environment Configuration

Copy the template environment file to configure your local credentials:

```bash
cp server/.env.example server/.env
```

### Environment Variables (`server/.env`)

```env
PORT=5001
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secure-jwt-secret-here

# Local Development Credentials for Initial Seed
SUPER_ADMIN_EMAIL=superadmin@borno.edu
SUPER_ADMIN_PASSWORD=SuperAdmin@Borno2026!

DEMO_STUDENT_EMAIL=student@borno.edu
DEMO_STUDENT_PASSWORD=StudentDemo@Borno2026!

DEMO_CONTRIBUTOR_EMAIL=contributor@borno.edu
DEMO_CONTRIBUTOR_PASSWORD=ContributorDemo@Borno2026!
```

> **Security Note:** In production, never commit `.env` or set default passwords. Demo accounts should be disabled or protected with strong, random credentials generated at deployment time.

### Quick Login Credentials (Development)

| Role | Route | Email | Default Local Password |
|---|---|---|---|
| **Super Admin** | `/super-admin/login` | `superadmin@borno.edu` | `SuperAdmin@Borno2026!` |
| **Demo Student** | `/student/login` | `student@borno.edu` | `StudentDemo@Borno2026!` |
| **Approved Contributor** | `/student/login` | `contributor@borno.edu` | `ContributorDemo@Borno2026!` |

---

## 🧪 Automated Testing

An automated test suite validates login, role isolation, password hashing, password reset, and permission enforcement:

```bash
# Run auth & permissions verification test suite
npm run test:auth

# Run Global Institution Coverage & Ingestion test suite (Section 13)
npm run test:coverage

# Run Technical SEO & QA audit suite
npm run test:seo

# Run English Test Comparison & Acceptance test suite
npm run test:english-tests

# Run MOI Acceptance & English Waiver test suite
npm run test:moi
```

### Verified Test Suites:
- **Authentication & Role Isolation (`test:auth`)**: 12/12 automated checks verifying Super Admin, Student, and Contributor permissions, role isolation, password hashing, and token safeguards.
- **Global Institution Coverage & Ingestion Pipeline (`test:coverage`)**: 12/12 automated checks validating >=100 targets in US/UK/DE/CA/AU/IN, capped national directories (<100 HEIs), server-side pagination, indexed search, qualification tracking, candidate deduplication, idempotent upserts, and administrative role protections.
- **Technical SEO & Quality Assurance (`test:seo`)**: 24/24 automated checks verifying robots.txt, XML sitemap index, country & university sitemaps, duplicate slug prevention, and canonical metadata.
- **English Test Comparison & Acceptance Module (`test:english-tests`)**: 12/12 automated checks verifying matrix generation (IELTS/PTE/TOEFL test-centre vs. at-home), official Bangladesh fee tracking, non-inference of online exams, course-specific and degree-specific requirements, stale source detection, student reporting queue, admin-only fee/policy updates, and complete revision audit trails.
- **MOI Acceptance & English Waiver Module (`test:moi`)**: 12/12 automated checks validating public directory queries, initial benchmark examples (Aston, Alberta, Ottawa, McGill, Maynooth), non-acceptance handling (Oxford & Cambridge), visa vs. academic separation notices, interactive eligibility questionnaire outcomes, student correction reporting, and Super Admin approval with revision logging.

---

## 🔒 Production Safeguards & SQLite Concurrency Notes

1. **SQLite Concurrency & WAL Mode**
   - SQLite is ideal for local development, testing, and low-to-medium write traffic deployments.
   - For production SQLite instances, enable Write-Ahead Logging (`PRAGMA journal_mode=WAL;`) to permit concurrent readers while a write transaction is in progress.
   - For high-concurrency multi-region write workloads, migrate connection to PostgreSQL using Prisma's provider switch (`provider = "postgresql"`).
2. **Backups & Recovery**
   - To safely back up an active SQLite database without stopping the application, run:
     ```bash
     sqlite3 server/prisma/dev.db ".backup 'server/prisma/backup-$(date +%Y%m%d%H%M%S).db'"
     ```
3. **Data Preservation Guarantee**
   - Never run `prisma migrate reset` in production environments. Seeding logic is 100% idempotent and checks existing records using unique identifiers before insertion.
4. **Creating Initial Administrator in Production**
   - Set `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` in your secure environment secret manager.
   - Run `npx prisma db seed` during the release pipeline, or use a restricted administrative CLI tool.
   - Immediately rotate credentials if exposed in any build log or staging environment.

---

## 📄 License

MIT License. Designed and maintained by the Borno Higher Study Engineering Team.
