import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { COUNTRIES_DATA } from '../src/data/countriesData.js';
import { UNIVERSITIES_DATA } from '../src/data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../src/data/scholarshipsData.js';
import { SUBJECTS_DATA } from '../src/data/subjectsData.js';
import { IngestionService } from '../src/services/ingestionService.js';
import { EnglishTestService } from '../src/services/englishTestService.js';
import { MoiService } from '../src/services/moiService.js';
import { VisaIntelligenceService } from '../src/services/visaIntelligenceService.js';
import { AcademicEligibilityService } from '../src/services/academicEligibilityService.js';
import { contentPlatformService } from '../src/services/contentPlatformService.js';
import { careerToolkitService } from '../src/services/careerToolkitService.js';
import { countryWorkGuideService } from '../src/services/countryWorkGuideService.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Borno Higher Study SQLite database (dev.db)...');

  // Development Credentials from environment (with fallback for local dev)
  const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || 'superadmin@borno.edu').toLowerCase().trim();
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@Borno2026!';
  const demoStudentEmail = (process.env.DEMO_STUDENT_EMAIL || 'student@borno.edu').toLowerCase().trim();
  const demoStudentPassword = process.env.DEMO_STUDENT_PASSWORD || 'StudentDemo@Borno2026!';

  // 1. Seed Users (Super Admin & Student) with salted bcrypt hashes
  const adminHash = bcrypt.hashSync(superAdminPassword, 10);
  const studentHash = bcrypt.hashSync(demoStudentPassword, 10);

  let superAdminUser = await prisma.user.findFirst({
    where: { OR: [{ email: superAdminEmail }, { id: 'usr-admin-1' }] },
  });
  if (superAdminUser) {
    superAdminUser = await prisma.user.update({
      where: { id: superAdminUser.id },
      data: {
        email: superAdminEmail,
        passwordHash: adminHash,
        name: 'Borno System Administrator',
        role: 'SUPER_ADMIN',
      },
    });
  } else {
    superAdminUser = await prisma.user.create({
      data: {
        id: 'usr-admin-1',
        email: superAdminEmail,
        passwordHash: adminHash,
        name: 'Borno System Administrator',
        role: 'SUPER_ADMIN',
        targetCountry: 'finland',
        targetDegree: 'MASTER',
      },
    });
  }

  let studentUser = await prisma.user.findFirst({
    where: { OR: [{ email: demoStudentEmail }, { id: 'usr-student-1' }] },
  });
  if (studentUser) {
    studentUser = await prisma.user.update({
      where: { id: studentUser.id },
      data: {
        email: demoStudentEmail,
        passwordHash: studentHash,
        name: 'Rahim Chowdhury (Demo Student)',
        role: 'STUDENT',
      },
    });
  } else {
    studentUser = await prisma.user.create({
      data: {
        id: 'usr-student-1',
        email: demoStudentEmail,
        passwordHash: studentHash,
        name: 'Rahim Chowdhury (Demo Student)',
        role: 'STUDENT',
        targetCountry: 'finland',
        targetDegree: 'MASTER',
      },
    });
  }

  // Seed StudentProfile
  await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      educationLevel: 'BACHELOR',
      currentInstitution: 'University of Dhaka',
      gpa: 3.82,
      preferredCountries: JSON.stringify(['ireland', 'germany', 'finland', 'lithuania']),
      preferredSubjects: JSON.stringify(['Computer Science', 'Data Analytics', 'Software Engineering']),
      englishTestTaken: 'IELTS',
      englishScore: 7.5,
      targetIntakeSeason: 'Autumn 2026',
      budgetAnnualUsd: 15000,
    },
  });

  console.log(`✔ Seeded Super Admin (${superAdminEmail}) and Demo Student (${demoStudentEmail})`);

  // 2. Seed Academic Subjects
  for (const s of SUBJECTS_DATA) {
    await prisma.subject.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        category: s.category,
        description: s.description,
      },
      create: {
        id: s.id,
        name: s.name,
        slug: s.slug,
        category: s.category,
        description: s.description,
      },
    });
  }
  console.log(`✔ Seeded ${SUBJECTS_DATA.length} Academic Subjects`);

  // 3. Seed Countries
  const countryIdMap = new Map<string, string>();

  for (const c of COUNTRIES_DATA) {
    const record = await prisma.country.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        code: c.code,
        flagEmoji: c.flagEmoji,
        continent: c.continent,
        region: c.region,
        currencyCode: c.currencyCode,
        currencySymbol: c.currencySymbol,
        exchangeRateToBdt: c.exchangeRateToBdt,
        overview: c.overview,
        capitalCity: c.capitalCity,
        majorCities: JSON.stringify(c.majorCities || []),
        languages: JSON.stringify(c.languages || []),
        avgLivingCostMonthly: c.avgLivingCostMonthly,
        avgTuitionMin: c.avgTuitionMin,
        avgTuitionMax: c.avgTuitionMax,
        postStudyWorkVisa: c.postStudyWorkVisa,
        visaGuideUrl: c.visaGuideUrl,
        officialPortalUrl: c.officialPortalUrl,
        isFeatured: !!c.isFeatured,
      },
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        code: c.code,
        flagEmoji: c.flagEmoji,
        continent: c.continent,
        region: c.region,
        currencyCode: c.currencyCode,
        currencySymbol: c.currencySymbol,
        exchangeRateToBdt: c.exchangeRateToBdt,
        overview: c.overview,
        capitalCity: c.capitalCity,
        majorCities: JSON.stringify(c.majorCities || []),
        languages: JSON.stringify(c.languages || []),
        avgLivingCostMonthly: c.avgLivingCostMonthly,
        avgTuitionMin: c.avgTuitionMin,
        avgTuitionMax: c.avgTuitionMax,
        postStudyWorkVisa: c.postStudyWorkVisa,
        visaGuideUrl: c.visaGuideUrl,
        officialPortalUrl: c.officialPortalUrl,
        isFeatured: !!c.isFeatured,
      },
    });
    countryIdMap.set(c.slug, record.id);
  }
  console.log(`✔ Seeded ${COUNTRIES_DATA.length} Countries in SQLite`);

  // 4. Seed Universities and their Programs (Batched for 5,000+ Institutions)
  let totalProgramsCount = 0;
  const uniSlugToIdMap = new Map<string, string>();

  const existingUnis = await prisma.university.findMany({
    select: { id: true, slug: true },
  });
  for (const u of existingUnis) {
    uniSlugToIdMap.set(u.slug, u.id);
  }

  const newUnisToCreate: any[] = [];
  for (const u of UNIVERSITIES_DATA) {
    const countryId = countryIdMap.get(u.countrySlug);
    if (!countryId) continue;

    if (!uniSlugToIdMap.has(u.slug)) {
      newUnisToCreate.push({
        id: u.id,
        name: u.name,
        slug: u.slug,
        countryId,
        cityName: u.cityName,
        type: u.type,
        institutionType: u.institutionType || 'UNIVERSITY',
        accreditationStatus: u.accreditationStatus || 'RECOGNIZED',
        accreditationBody: u.accreditationBody || null,
        levelsOffered: 'BACHELOR,MASTER,PHD',
        qualificationsOffered: (u.qualificationsOffered || ['BACHELOR', 'MASTER', 'PHD']).join(','),
        qsRanking: u.qsRanking || null,
        timesRanking: u.timesRanking || null,
        acceptanceRate: u.acceptanceRate || null,
        websiteUrl: u.websiteUrl,
        admissionsUrl: u.admissionsUrl,
        sourceUrl: u.sourceUrl,
        internationalOfficeEmail: u.internationalOfficeEmail,
        verificationStatus: u.verificationStatus || 'VERIFIED',
      });
      uniSlugToIdMap.set(u.slug, u.id);
    }
  }

  if (newUnisToCreate.length > 0) {
    const CHUNK_SIZE = 250;
    for (let i = 0; i < newUnisToCreate.length; i += CHUNK_SIZE) {
      const chunk = newUnisToCreate.slice(i, i + CHUNK_SIZE);
      await prisma.university.createMany({ data: chunk });
    }
  }

  // Seed Programs in batches
  const existingPrograms = await prisma.program.findMany({
    select: { id: true },
  });
  const existingProgramIds = new Set(existingPrograms.map((p) => p.id));

  const newProgramsToCreate: any[] = [];
  const newEngReqsToCreate: any[] = [];

  for (const u of UNIVERSITIES_DATA) {
    const uniId = uniSlugToIdMap.get(u.slug);
    if (!uniId || !u.programs) continue;

    for (const p of u.programs) {
      if (!existingProgramIds.has(p.id)) {
        newProgramsToCreate.push({
          id: p.id,
          name: p.name,
          slug: p.slug,
          universityId: uniId,
          subjectName: p.subject,
          subjectCategory: p.subjectCategory,
          degreeLevel: p.degreeLevel,
          durationMonths: p.durationMonths,
          creditsEcts: p.creditsEcts,
          languageOfInstruction: p.language || 'English',
          annualTuitionLocal: p.annualTuitionLocal,
          currencyCode: p.currencyCode,
          applicationFeeLocal: p.applicationFeeLocal || 0,
          programUrl: p.programUrl,
          prerequisites: p.prerequisites,
        });
        existingProgramIds.add(p.id);

        if (p.ieltsOverall) {
          newEngReqsToCreate.push({
            programId: p.id,
            ieltsOverall: p.ieltsOverall,
            ieltsReading: p.ieltsSubscoreMin,
            ieltsListening: p.ieltsSubscoreMin,
            ieltsSpeaking: p.ieltsSubscoreMin,
            ieltsWriting: p.ieltsSubscoreMin,
            toeflIbtOverall: p.toeflOverall,
            pteOverall: p.pteOverall,
            sourceUrl: p.programUrl,
          });
        }
      }
    }
  }

  if (newProgramsToCreate.length > 0) {
    const CHUNK_SIZE = 250;
    for (let i = 0; i < newProgramsToCreate.length; i += CHUNK_SIZE) {
      const chunk = newProgramsToCreate.slice(i, i + CHUNK_SIZE);
      await prisma.program.createMany({ data: chunk });
    }
  }

  if (newEngReqsToCreate.length > 0) {
    const CHUNK_SIZE = 250;
    for (let i = 0; i < newEngReqsToCreate.length; i += CHUNK_SIZE) {
      const chunk = newEngReqsToCreate.slice(i, i + CHUNK_SIZE);
      await prisma.englishRequirement.createMany({ data: chunk });
    }
  }

  totalProgramsCount = existingProgramIds.size;
  console.log(`✔ Seeded ${UNIVERSITIES_DATA.length} Universities and ${totalProgramsCount} Programs in SQLite`);

  // 5. Seed Scholarships
  for (const sch of SCHOLARSHIPS_DATA) {
    const countryId = countryIdMap.get(sch.countrySlug) || null;

    await prisma.scholarship.upsert({
      where: { id: sch.id },
      update: {
        name: sch.name,
        provider: sch.provider,
        type: sch.type,
        countryId,
        degreeLevels: sch.degreeLevels.join(','),
        coveragePercent: sch.coveragePercent,
        stipendMonthlyLocal: sch.stipendMonthlyLocal || 0,
        travelAllowanceLocal: sch.travelAllowanceLocal || 0,
        currencyCode: sch.currencyCode,
        isFullyFunded: sch.isFullyFunded,
        openToBangladesh: sch.openToBangladesh,
        eligibleNationalities: JSON.stringify(sch.eligibleNationalities || []),
        academicRequirements: sch.academicRequirements,
        languageRequirements: sch.languageRequirements,
        deadlineDate: sch.deadlineDate ? new Date(sch.deadlineDate) : null,
        deadlineText: sch.deadlineText,
        officialApplicationUrl: sch.officialApplicationUrl,
        sourceUrl: sch.sourceUrl,
      },
      create: {
        id: sch.id,
        name: sch.name,
        provider: sch.provider,
        type: sch.type,
        countryId,
        degreeLevels: sch.degreeLevels.join(','),
        coveragePercent: sch.coveragePercent,
        stipendMonthlyLocal: sch.stipendMonthlyLocal || 0,
        travelAllowanceLocal: sch.travelAllowanceLocal || 0,
        currencyCode: sch.currencyCode,
        isFullyFunded: sch.isFullyFunded,
        openToBangladesh: sch.openToBangladesh,
        eligibleNationalities: JSON.stringify(sch.eligibleNationalities || []),
        academicRequirements: sch.academicRequirements,
        languageRequirements: sch.languageRequirements,
        deadlineDate: sch.deadlineDate ? new Date(sch.deadlineDate) : null,
        deadlineText: sch.deadlineText,
        officialApplicationUrl: sch.officialApplicationUrl,
        sourceUrl: sch.sourceUrl,
      },
    });
  }
  console.log(`✔ Seeded ${SCHOLARSHIPS_DATA.length} Scholarships in SQLite`);

  // 6. Seed Contributor Account & Application
  const demoContributorEmail = (process.env.DEMO_CONTRIBUTOR_EMAIL || 'contributor@borno.edu').toLowerCase().trim();
  const demoContributorPassword = process.env.DEMO_CONTRIBUTOR_PASSWORD || 'ContributorDemo@Borno2026!';
  const contributorHash = bcrypt.hashSync(demoContributorPassword, 10);

  let contributorUser = await prisma.user.findFirst({
    where: { OR: [{ email: demoContributorEmail }, { id: 'usr-contributor-1' }] },
  });
  if (contributorUser) {
    contributorUser = await prisma.user.update({
      where: { id: contributorUser.id },
      data: {
        email: demoContributorEmail,
        passwordHash: contributorHash,
        name: 'Fatima Rahman (Approved Contributor)',
        role: 'CONTRIBUTOR',
      },
    });
  } else {
    contributorUser = await prisma.user.create({
      data: {
        id: 'usr-contributor-1',
        email: demoContributorEmail,
        passwordHash: contributorHash,
        name: 'Fatima Rahman (Approved Contributor)',
        role: 'CONTRIBUTOR',
        targetCountry: 'ireland',
        targetDegree: 'MASTER',
      },
    });
  }

  await prisma.contributorApplication.upsert({
    where: { userId: contributorUser.id },
    update: { status: 'APPROVED' },
    create: {
      userId: contributorUser.id,
      studyDestination: 'Ireland',
      currentInstitution: 'University College Dublin (UCD)',
      qualificationEnrolled: 'MSc Computer Science',
      statementOfIntent: 'I want to write practical guides on Irish immigration, part-time work regulations, and budget living in Dublin for students from Bangladesh.',
      writingSampleUrl: 'https://linkedin.com/in/fatima-rahman-ucd',
      status: 'APPROVED',
      adminFeedback: 'Excellent academic background and clear writing sample.',
      reviewedBy: 'usr-admin-1',
      reviewedAt: new Date(),
    },
  });
  console.log('✔ Seeded verified contributor and application');

  // 7. Seed Sample Community Posts
  const samplePosts = [
    {
      id: 'post-ireland-visa-guide',
      title: 'Complete Guide: Applying for MSc in Ireland (UCD & Dublin Business School)',
      slug: 'applying-for-msc-in-ireland-guide',
      category: 'APPLICATION_GUIDE',
      destinationCountry: 'Ireland',
      institutionName: 'University College Dublin',
      excerpt: 'Everything you need to know about Irish AVATS visa application, proof of €10,000 living expense, and post-study work visa (Stamp 1G).',
      content: `## My Journey to Ireland: Step-by-Step Experience

When applying for higher study in Ireland from Bangladesh, there are three critical phases every student must navigate:

### 1. Choosing University vs. Business School / College
Ireland has both prestigious research universities (like **UCD** and **Trinity College Dublin**) and career-focused private colleges (like **Dublin Business School** and **Griffith College**). Both are fully accredited under QQI, but admission fees and tuition deadlines vary:
- UCD fees range between €19,000 - €29,000/year.
- DBS and Griffith fees are around €12,000 - €15,000/year.

### 2. Irish AVATS Visa Requirements
- **Financial Proof:** You need to show minimum €10,000 immediate access living expense plus tuition fee payment receipt.
- **Police Clearance & Medical Insurance:** Both must be verified before biometric appointment at VFS Global Dhaka.

### 3. Stamp 1G Stayback Option
Ireland gives international Master's graduates a **2-year Third Level Graduate Scheme (Stamp 1G)** allowing 40 hours/week full-time employment across Silicon Docks tech giants (Google, Meta, Stripe, LinkedIn in Dublin).`,
      authorId: contributorUser.id,
      status: 'APPROVED',
      publishedAt: new Date(),
    },
    {
      id: 'post-vilnius-lithuania-student-life',
      title: 'Studying in Lithuania (Vilnius & Kaunas): Low Tuition & Schengen Travel',
      slug: 'studying-in-lithuania-student-life-guide',
      category: 'STUDY_ABROAD_EXPERIENCE',
      destinationCountry: 'Lithuania',
      institutionName: 'Vilnius University',
      excerpt: 'Real breakdown of monthly living costs (€350 - €450), TRP residence permit processing, and English-taught engineering programs at Vilnius Tech.',
      content: `## Why Lithuania is a Hidden Gem for International Students

Lithuania offers world-class education within the European Union with tuition fees as low as €3,500 - €4,500 per year at **Vilnius University**, **KTU**, and **VILNIUS TECH**.

### Monthly Living Budget in Vilnius (2025)
- **Dormitory / Shared Flat:** €150 - €250 / month
- **Groceries (Maxima, Lidl):** €120 - €150 / month
- **Vilnius Student Public Transport Card:** €5.80 / month (80% discount for students!)
- **Total:** Around €350 - €450 / month (approx. 45,000 - 58,000 BDT).

### TRP (Temporary Residence Permit)
The Migration Department of Lithuania issues digital residence permits. International students are allowed to work up to **20 hours per week** during study terms and full-time during vacations.`,
      authorId: contributorUser.id,
      status: 'APPROVED',
      publishedAt: new Date(),
    },
  ];

  for (const p of samplePosts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log(`✔ Seeded ${samplePosts.length} Approved Community Posts`);

  // 8. Seed Sample Shared Workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: 'ws-europe-2025' },
    update: {},
    create: {
      id: 'ws-europe-2025',
      name: 'Europe Autumn 2025 Study Circle',
      description: 'Collaborative group for sharing university shortlist documents and visa application SOP reviews.',
      ownerId: 'usr-student-1',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: 'usr-student-1',
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: 'usr-student-1',
      role: 'OWNER',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: contributorUser.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: contributorUser.id,
      role: 'EDITOR',
    },
  });
  console.log('✔ Seeded collaborative workspace with multi-user access');

  // 9. Seed Sample Financial Document Submission
  await prisma.financialDocumentSubmission.upsert({
    where: { id: 'doc-student-1' },
    update: {},
    create: {
      id: 'doc-student-1',
      userId: 'usr-student-1',
      documentCategory: 'BANK_STATEMENT',
      title: 'City Bank 6-Month Savings Account Statement',
      originalFilename: 'CityBank_Statement_RahimChowdhury_Jan2025.pdf',
      storagePath: 'private_documents/usr-student-1/doc-student-1.pdf',
      fileSizeBytes: 245100,
      mimeType: 'application/pdf',
      status: 'UNDER_REVIEW',
      currency: 'BDT',
      balanceAmount: 2850000,
      bankName: 'The City Bank PLC (Gulshan Branch)',
      accountHolderType: 'STUDENT',
      verificationDisclaimer: 'Internal document review completed. This does not constitute legal banking verification or guarantee visa issuance.',
      reviewerNotes: 'Document uploaded cleanly with seal and barcode. Under verification for Germany Blocked Account / Ireland proof of funds adequacy.',
    },
  });
  // 10. Seed Application Deadlines & Intakes
  const sampleDeadlines = [
    {
      id: 'dl-dbs-autumn-2026',
      universityId: uniSlugToIdMap.get('dublin-business-school') || null,
      intakeSemester: 'Autumn 2026',
      academicYear: '2026-2027',
      applicationType: 'POSTGRADUATE',
      targetAudience: 'INTERNATIONAL',
      roundName: 'General International Intake',
      openDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      closeDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now -> CLOSING_SOON
      openTime: '09:00',
      closeTime: '23:59',
      timeZone: 'Europe/Dublin',
      isRolling: false,
      status: 'OPEN',
      applicationFee: 50,
      currencyCode: 'EUR',
      officialAppUrl: 'https://www.dbs.ie/apply',
      officialSourceUrl: 'https://www.dbs.ie/international-students/admissions-process',
    },
    {
      id: 'dl-ucd-msc-cs-round1',
      universityId: uniSlugToIdMap.get('university-college-dublin') || null,
      intakeSemester: 'Autumn 2026',
      academicYear: '2026-2027',
      applicationType: 'POSTGRADUATE',
      targetAudience: 'INTERNATIONAL',
      roundName: 'Round 1 Priority Evaluation',
      openDate: new Date('2025-10-01T00:00:00Z'),
      closeDate: new Date('2026-07-01T23:59:00Z'),
      openTime: '00:00',
      closeTime: '23:59',
      timeZone: 'Europe/Dublin',
      isRolling: false,
      status: 'OPEN',
      applicationFee: 60,
      currencyCode: 'EUR',
      officialAppUrl: 'https://www.ucd.ie/apply',
      officialSourceUrl: 'https://www.ucd.ie/registry/prospectivestudents/admissions/',
    },
    {
      id: 'dl-griffith-spring-2027',
      universityId: uniSlugToIdMap.get('griffith-college-ireland') || null,
      intakeSemester: 'Spring 2027',
      academicYear: '2026-2027',
      applicationType: 'POSTGRADUATE',
      targetAudience: 'ALL',
      roundName: 'Early Application Round',
      openDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days in future -> UPCOMING
      closeDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      openTime: '09:00',
      closeTime: '17:00',
      timeZone: 'Europe/Dublin',
      isRolling: false,
      status: 'UPCOMING',
      applicationFee: 0,
      currencyCode: 'EUR',
      officialAppUrl: 'https://www.griffith.ie/apply-online',
      officialSourceUrl: 'https://www.griffith.ie/admissions',
    },
    {
      id: 'dl-mbs-rolling-2026',
      universityId: uniSlugToIdMap.get('munich-business-school') || null,
      intakeSemester: 'Rolling Admissions 2026',
      academicYear: '2026-2027',
      applicationType: 'POSTGRADUATE',
      targetAudience: 'INTERNATIONAL',
      roundName: 'Continuous Evaluation',
      openDate: null,
      closeDate: null,
      timeZone: 'Europe/Berlin',
      isRolling: true,
      status: 'ROLLING',
      applicationFee: 60,
      currencyCode: 'EUR',
      officialAppUrl: 'https://www.munich-business-school.de/en/apply',
      officialSourceUrl: 'https://www.munich-business-school.de/en/international',
    },
    {
      id: 'dl-tafe-sem1-2026',
      universityId: uniSlugToIdMap.get('tafe-nsw-australia') || null,
      intakeSemester: 'Semester 1 2026',
      academicYear: '2026',
      applicationType: 'VOCATIONAL',
      targetAudience: 'INTERNATIONAL',
      roundName: 'Main Vocational Intake',
      openDate: new Date('2025-08-01T00:00:00Z'),
      closeDate: new Date('2026-01-15T23:59:00Z'), // Past -> CLOSED
      timeZone: 'Australia/Sydney',
      isRolling: false,
      status: 'CLOSED',
      applicationFee: 100,
      currencyCode: 'AUD',
      officialAppUrl: 'https://www.tafensw.edu.au/international',
      officialSourceUrl: 'https://www.tafensw.edu.au/international/apply',
    },
  ];

  for (const d of sampleDeadlines) {
    await prisma.applicationDeadline.upsert({
      where: { id: d.id },
      update: {},
      create: d,
    });
  }

  // Seed Deadline Revision audit entry for DBS
  await prisma.deadlineRevision.upsert({
    where: { id: 'dbrev-dbs-1' },
    update: {},
    create: {
      id: 'dbrev-dbs-1',
      deadlineId: 'dl-dbs-autumn-2026',
      changedBy: 'Super Admin',
      previousCloseDate: new Date('2026-06-30T23:59:00Z'),
      newCloseDate: new Date('2026-07-31T23:59:00Z'),
      previousStatus: 'OPEN',
      newStatus: 'OPEN',
      reason: 'Admissions committee extended non-EU application window by one calendar month.',
      sourceEvidenceUrl: 'https://www.dbs.ie/international-students/admissions-updates',
    },
  });

  console.log(`✔ Seeded ${sampleDeadlines.length} Verified Application Deadlines & Intakes`);

  // 11. Seed Student Information Reports & Revision History
  const rpt1 = await prisma.informationReport.upsert({
    where: { reportNumber: 'RPT-2026-001' },
    update: {},
    create: {
      id: 'rpt-seed-1',
      reportNumber: 'RPT-2026-001',
      reporterId: contributorUser.id,
      reporterEmail: contributorUser.email,
      entityType: 'DEADLINE',
      entityId: 'dl-ucd-msc-cs-round1',
      entityName: 'UCD MSc Computer Science Autumn 2026 Intake',
      entitySlug: 'university-college-dublin',
      fieldBelievedIncorrect: 'CLOSE_DATE',
      reasonCategory: 'INCORRECT_DATE',
      description: 'The UCD admissions office announced an international round extension to July 15, 2026 on their official portal.',
      currentValue: '2026-07-01',
      proposedCorrection: '2026-07-15',
      officialEvidenceUrl: 'https://www.ucd.ie/registry/prospectivestudents/admissions/',
      status: 'PENDING_REVIEW',
    },
  });

  const rpt2 = await prisma.informationReport.upsert({
    where: { reportNumber: 'RPT-2026-002' },
    update: {},
    create: {
      id: 'rpt-seed-2',
      reportNumber: 'RPT-2026-002',
      reporterId: 'usr-student-1',
      reporterEmail: 'student@borno.edu',
      entityType: 'PROGRAM',
      entityId: 'prog-dbs-mba-cloud',
      entityName: 'Dublin Business School - MBA in Cloud Computing',
      entitySlug: 'dublin-business-school',
      fieldBelievedIncorrect: 'TUITION_FEE',
      reasonCategory: 'WRONG_TUITION',
      description: 'The 2026 tuition fee on DBS international prospectus lists €13,500 instead of €12,500.',
      currentValue: '12500',
      proposedCorrection: '13500',
      officialEvidenceUrl: 'https://www.dbs.ie/courses/postgraduate',
      status: 'MORE_INFO_REQUESTED',
      adminFeedback: 'Please provide the direct link to the 2026 International Fee Schedule PDF for verification.',
      reviewedBy: 'usr-admin-1',
      reviewedAt: new Date(),
    },
  });

  await prisma.reportComment.upsert({
    where: { id: 'comm-rpt2-1' },
    update: {},
    create: {
      id: 'comm-rpt2-1',
      reportId: rpt2.id,
      authorId: 'usr-admin-1',
      authorName: 'Borno System Administrator',
      authorRole: 'ADMIN',
      message: 'Please provide the direct link to the 2026 International Fee Schedule PDF for verification.',
    },
  });

  const tuDublinId = uniSlugToIdMap.get('technological-university-dublin') || 'tu-dublin';

  const rpt3 = await prisma.informationReport.upsert({
    where: { reportNumber: 'RPT-2026-003' },
    update: {},
    create: {
      id: 'rpt-seed-3',
      reportNumber: 'RPT-2026-003',
      reporterId: contributorUser.id,
      reporterEmail: contributorUser.email,
      entityType: 'UNIVERSITY',
      entityId: tuDublinId,
      entityName: 'Technological University Dublin',
      entitySlug: 'technological-university-dublin',
      fieldBelievedIncorrect: 'OFFICIAL_LINK',
      reasonCategory: 'BROKEN_OR_UNOFFICIAL_LINK',
      description: 'Admissions portal URL was updated after the campus merger.',
      currentValue: 'https://tudublin.ie/admissions-old',
      proposedCorrection: 'https://www.tudublin.ie/study/international-students/',
      officialEvidenceUrl: 'https://www.tudublin.ie/study/international-students/',
      status: 'APPROVED',
      adminFeedback: 'Verified against official tudublin.ie registrar domain. Published.',
      reviewedBy: 'usr-admin-1',
      reviewedAt: new Date(),
    },
  });

  await prisma.dataRevisionHistory.upsert({
    where: { id: 'rev-rpt3-1' },
    update: {},
    create: {
      id: 'rev-rpt3-1',
      reportId: rpt3.id,
      entityType: 'UNIVERSITY',
      entityId: tuDublinId,
      fieldName: 'admissionsUrl',
      previousValue: 'https://tudublin.ie/admissions-old',
      newValue: 'https://www.tudublin.ie/study/international-students/',
      sourceUrl: 'https://www.tudublin.ie/study/international-students/',
      reviewerId: 'usr-admin-1',
      reviewerName: 'Borno System Administrator',
      reason: 'Updated following verified student report #RPT-2026-003.',
    },
  });

  // Seed sample CorrectionProposal
  await prisma.correctionProposal.upsert({
    where: { id: 'prop-sample-1' },
    update: {},
    create: {
      id: 'prop-sample-1',
      reportId: rpt1.id,
      entityType: 'DEADLINE',
      entityId: 'dl-ucd-msc-cs-round1',
      fieldName: 'CLOSE_DATE',
      currentValue: '2026-07-01',
      proposedValue: '2026-07-15',
      sourceEvidenceUrl: 'https://www.ucd.ie/registry/prospectivestudents/admissions/',
      status: 'PENDING',
    },
  });

  console.log('✔ Seeded student information reports, proposals, and data revision audit log');

  console.log('🏛 Running automated institution registry ingestion in seed...');
  await IngestionService.runIngestion();
  console.log('✔ Global institution registries synchronized (100+ target & exhaustive national directories)');

  console.log('🇬🇧 Seeding English test catalog, Bangladesh fees, and UK university acceptance policies...');
  await EnglishTestService.seedAllEnglishTestData();
  console.log('✔ English tests and UK acceptance policies synchronized');

  console.log('📜 Seeding MOI & English Language Exemption policies...');
  await MoiService.seedAllMoiData();
  console.log('✔ MOI and exemption policies synchronized');

  console.log('🛂 Seeding Live Global Visa Intelligence, Statistics & Application Centres...');
  await VisaIntelligenceService.seedAllVisaData();
  console.log('✔ Global Visa Intelligence synchronized');

  console.log('🎓 Seeding Global Academic Eligibility, Grade Scales & Subject Prerequisites...');
  await AcademicEligibilityService.seedAllAcademicData();
  console.log('✔ Academic Eligibility and Subject Requirements synchronized');

  console.log('📚 Seeding Premium Educational Content, 100+ Articles, Research Papers & Comparisons...');
  await contentPlatformService.seedAllContentData();
  console.log('✔ Educational Articles, Research Papers, and Comparison Guides synchronized');

  console.log('💼 Seeding Complete Career Toolkit, 52 Research Records, 12 CV Examples & Guides...');
  await careerToolkitService.seedCareerToolkitData();
  console.log('✔ Career Toolkit, 52 Research Records, 12 CV Examples & Guides synchronized');

  console.log('🌐 Seeding Country Work Guide: Languages, Minimum Wages, Student Work & Career Roadmaps...');
  await countryWorkGuideService.seedCountryWorkGuideData();
  console.log('✔ Country Work Guide dataset synchronized');

  console.log('🎉 SQLite database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
