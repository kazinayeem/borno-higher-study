import { IngestionService } from '../server/src/services/ingestionService.js';
import { prisma } from '../server/src/services/db.js';

async function main() {
  console.log('🚀 Running Global Institution Ingestion Pipeline...');
  console.log('Target: Minimum 100 verified institutions per country wherever 100+ exist, or exhaustive capped national directories.');

  const startTime = Date.now();
  const summary = await IngestionService.runIngestion();
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n✔ Ingestion finished in ${duration}s!`);
  console.log(`Batch ID: ${summary.batchId}`);
  console.log(`Discovered: ${summary.discoveredCount}`);
  console.log(`Imported: ${summary.importedCount}`);
  console.log(`Verified (Total in run): ${summary.verifiedCount}`);
  console.log(`Duplicate / Idempotent matches: ${summary.duplicateCount}`);
  console.log(`Candidates in Review Queue: ${summary.pendingReviewCount}`);

  console.log('\n📊 Country Coverage Target Breakdown:');
  console.table(
    Object.entries(summary.countrySummaries).map(([slug, s]) => ({
      Country: s.countryName,
      Verified: s.verifiedCount,
      Target: s.targetCount,
      Capped: s.isTargetCapped ? 'YES (<100 HEIs in nation)' : 'NO (100+ Target)',
      Status: s.coverageStatus,
      Message: s.statusMessage
    }))
  );

  const totalInDb = await prisma.university.count();
  console.log(`\n🎉 Total Verified Universities/Colleges in SQLite Database: ${totalInDb}`);
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
