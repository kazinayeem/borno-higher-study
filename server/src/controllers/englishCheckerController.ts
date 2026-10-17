import { Request, Response } from 'express';
import { UNIVERSITIES_DATA, ProgramItem } from '../data/universitiesData.js';

interface TestScores {
  testType: 'IELTS' | 'TOEFL' | 'PTE';
  overallScore: number;
  readingScore?: number;
  listeningScore?: number;
  speakingScore?: number;
  writingScore?: number;
  hasMoeCertificate?: boolean; // Medium of English instruction
}

export const checkEnglishEligibility = (req: Request, res: Response) => {
  const {
    countrySlug,
    degreeLevel,
    testType,
    overallScore,
    readingScore,
    listeningScore,
    speakingScore,
    writingScore,
    programId,
  } = req.body;

  const scoreNum = Number(overallScore);
  if (isNaN(scoreNum) || scoreNum <= 0) {
    return res.status(400).json({ error: 'Please enter a valid overall test score.' });
  }

  // Get matching programs
  let targetPrograms: { program: ProgramItem; uniName: string; uniSlug: string; countryName: string; admissionsUrl: string }[] = [];

  for (const uni of UNIVERSITIES_DATA) {
    if (countrySlug && countrySlug !== 'all' && uni.countrySlug !== countrySlug) {
      continue;
    }
    for (const prog of uni.programs) {
      if (degreeLevel && degreeLevel !== 'all' && prog.degreeLevel !== degreeLevel.toUpperCase()) {
        continue;
      }
      if (programId && prog.id !== programId) {
        continue;
      }
      targetPrograms.push({
        program: prog,
        uniName: uni.name,
        uniSlug: uni.slug,
        countryName: uni.countryName,
        admissionsUrl: uni.admissionsUrl,
      });
    }
  }

  const results = targetPrograms.map(({ program, uniName, uniSlug, countryName, admissionsUrl }) => {
    let eligible = false;
    let unmetReasons: string[] = [];
    let requiredOverall = 0;
    let requiredSubscore = 0;

    if (testType === 'IELTS') {
      requiredOverall = program.ieltsOverall;
      requiredSubscore = program.ieltsSubscoreMin;

      if (scoreNum < requiredOverall) {
        unmetReasons.push(`Overall IELTS of ${scoreNum} is below required ${requiredOverall}`);
      }

      if (readingScore !== undefined && Number(readingScore) < requiredSubscore) {
        unmetReasons.push(`Reading band ${readingScore} is below minimum subscore ${requiredSubscore}`);
      }
      if (listeningScore !== undefined && Number(listeningScore) < requiredSubscore) {
        unmetReasons.push(`Listening band ${listeningScore} is below minimum subscore ${requiredSubscore}`);
      }
      if (speakingScore !== undefined && Number(speakingScore) < requiredSubscore) {
        unmetReasons.push(`Speaking band ${speakingScore} is below minimum subscore ${requiredSubscore}`);
      }
      if (writingScore !== undefined && Number(writingScore) < requiredSubscore) {
        unmetReasons.push(`Writing band ${writingScore} is below minimum subscore ${requiredSubscore}`);
      }
    } else if (testType === 'TOEFL') {
      requiredOverall = program.toeflOverall;
      if (scoreNum < requiredOverall) {
        unmetReasons.push(`Overall TOEFL iBT of ${scoreNum} is below required ${requiredOverall}`);
      }
    } else if (testType === 'PTE') {
      requiredOverall = program.pteOverall;
      if (scoreNum < requiredOverall) {
        unmetReasons.push(`Overall PTE Academic score of ${scoreNum} is below required ${requiredOverall}`);
      }
    }

    eligible = unmetReasons.length === 0;

    return {
      programId: program.id,
      programName: program.name,
      universityName: uniName,
      universitySlug: uniSlug,
      countryName,
      degreeLevel: program.degreeLevel,
      status: eligible ? 'MEETS_REQUIREMENT' : 'DOES_NOT_MEET',
      requiredScore: requiredOverall,
      requiredSubscore: testType === 'IELTS' ? requiredSubscore : undefined,
      userScore: scoreNum,
      unmetReasons,
      officialSourceUrl: program.programUrl || admissionsUrl,
      lastVerifiedAt: program.lastVerifiedAt,
    };
  });

  const meetsCount = results.filter((r) => r.status === 'MEETS_REQUIREMENT').length;
  const notMeetsCount = results.filter((r) => r.status === 'DOES_NOT_MEET').length;

  return res.json({
    summary: {
      testedScore: scoreNum,
      testType,
      totalProgramsEvaluated: results.length,
      meetsCount,
      notMeetsCount,
    },
    evaluations: results,
  });
};
