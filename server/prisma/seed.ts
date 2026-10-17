import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { COUNTRIES_DATA } from '../src/data/countriesData.js';
import { UNIVERSITIES_DATA } from '../src/data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../src/data/scholarshipsData.js';
import { SUBJECTS_DATA } from '../src/data/subjectsData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Borno Higher Study SQLite database (dev.db)...');

  // 1. Seed Users (Admin & Student)
  const adminHash = bcrypt.hashSync('BornoAdmin2025!', 10);
  const studentHash = bcrypt.hashSync('Student2025!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@borno.edu' },
    update: {},
    create: {
      id: 'usr-admin-1',
      email: 'admin@borno.edu',
      passwordHash: adminHash,
      name: 'Borno System Administrator',
      role: 'SUPER_ADMIN',
      targetCountry: 'finland',
      targetDegree: 'MASTER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'student@borno.edu' },
    update: {},
    create: {
      id: 'usr-student-1',
      email: 'student@borno.edu',
      passwordHash: studentHash,
      name: 'Rahim Chowdhury',
      role: 'STUDENT',
      targetCountry: 'finland',
      targetDegree: 'MASTER',
    },
  });
  console.log('✔ Seeded default admin and student accounts');

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

  // 4. Seed Universities and their Programs
  let totalProgramsCount = 0;

  for (const u of UNIVERSITIES_DATA) {
    const countryId = countryIdMap.get(u.countrySlug);
    if (!countryId) continue;

    const uniRecord = await prisma.university.upsert({
      where: { slug: u.slug },
      update: {
        name: u.name,
        countryId,
        cityName: u.cityName,
        type: u.type,
        qsRanking: u.qsRanking,
        timesRanking: u.timesRanking,
        acceptanceRate: u.acceptanceRate,
        websiteUrl: u.websiteUrl,
        admissionsUrl: u.admissionsUrl,
        sourceUrl: u.sourceUrl,
        internationalOfficeEmail: u.internationalOfficeEmail,
        verificationStatus: u.verificationStatus,
      },
      create: {
        id: u.id,
        name: u.name,
        slug: u.slug,
        countryId,
        cityName: u.cityName,
        type: u.type,
        levelsOffered: 'BACHELOR,MASTER,PHD',
        qsRanking: u.qsRanking,
        timesRanking: u.timesRanking,
        acceptanceRate: u.acceptanceRate,
        websiteUrl: u.websiteUrl,
        admissionsUrl: u.admissionsUrl,
        sourceUrl: u.sourceUrl,
        internationalOfficeEmail: u.internationalOfficeEmail,
        verificationStatus: u.verificationStatus,
      },
    });

    // Seed programs for this university
    if (u.programs && u.programs.length > 0) {
      for (const p of u.programs) {
        await prisma.program.upsert({
          where: { id: p.id },
          update: {
            name: p.name,
            slug: p.slug,
            universityId: uniRecord.id,
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
          },
          create: {
            id: p.id,
            name: p.name,
            slug: p.slug,
            universityId: uniRecord.id,
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
          },
        });

        // Seed English requirement if available
        if (p.ieltsOverall) {
          await prisma.englishRequirement.upsert({
            where: { programId: p.id },
            update: {
              ieltsOverall: p.ieltsOverall,
              ieltsReading: p.ieltsSubscoreMin,
              ieltsListening: p.ieltsSubscoreMin,
              ieltsSpeaking: p.ieltsSubscoreMin,
              ieltsWriting: p.ieltsSubscoreMin,
              toeflIbtOverall: p.toeflOverall,
              pteOverall: p.pteOverall,
              sourceUrl: p.programUrl,
            },
            create: {
              programId: p.id,
              ieltsOverall: p.ieltsOverall,
              ieltsReading: p.ieltsSubscoreMin,
              ieltsListening: p.ieltsSubscoreMin,
              ieltsSpeaking: p.ieltsSubscoreMin,
              ieltsWriting: p.ieltsSubscoreMin,
              toeflIbtOverall: p.toeflOverall,
              pteOverall: p.pteOverall,
              sourceUrl: p.programUrl,
            },
          });
        }
        totalProgramsCount++;
      }
    }
  }
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
