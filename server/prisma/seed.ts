import { PrismaClient } from '@prisma/client';
import { COUNTRIES_DATA } from '../src/data/countriesData.js';
import { UNIVERSITIES_DATA } from '../src/data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../src/data/scholarshipsData.js';
import { SUBJECTS_DATA } from '../src/data/subjectsData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Borno Higher Study database...');

  // 1. Seed Subjects
  for (const s of SUBJECTS_DATA) {
    await prisma.subject.upsert({
      where: { slug: s.slug },
      update: {},
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

  // 2. Seed 30 Countries
  for (const c of COUNTRIES_DATA) {
    await prisma.country.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        code: c.code,
        flagEmoji: c.flagEmoji,
        currencyCode: c.currencyCode,
        currencySymbol: c.currencySymbol,
        exchangeRateToBdt: c.exchangeRateToBdt,
        overview: c.overview,
        capitalCity: c.capitalCity,
        majorCities: c.majorCities,
        avgLivingCostMonthly: c.avgLivingCostMonthly,
        avgTuitionMin: c.avgTuitionMin,
        avgTuitionMax: c.avgTuitionMax,
        postStudyWorkVisa: c.postStudyWorkVisa,
        visaGuideUrl: c.visaGuideUrl,
        officialPortalUrl: c.officialPortalUrl,
      },
    });
  }
  console.log(`✔ Seeded ${COUNTRIES_DATA.length} International Study Destinations`);

  console.log('🌟 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
