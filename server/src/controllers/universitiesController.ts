import { Request, Response } from 'express';
import { UNIVERSITIES_DATA, UniversityRecord } from '../data/universitiesData.js';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';

export const getUniversities = (req: Request, res: Response) => {
  const {
    country,
    level,
    subject,
    maxTuition,
    maxIelts,
    type,
    search,
  } = req.query;

  let results: UniversityRecord[] = [...UNIVERSITIES_DATA];

  if (country && typeof country === 'string' && country !== 'all') {
    results = results.filter((u) => u.countrySlug === country);
  }

  if (type && typeof type === 'string' && type !== 'all') {
    results = results.filter((u) => u.type === type.toUpperCase());
  }

  if (level && typeof level === 'string' && level !== 'all') {
    results = results.filter((u) =>
      u.programs.some((p) => p.degreeLevel === level.toUpperCase())
    );
  }

  if (subject && typeof subject === 'string' && subject !== 'all') {
    const sLower = subject.toLowerCase();
    results = results.filter((u) =>
      u.programs.some(
        (p) =>
          p.subject.toLowerCase().includes(sLower) ||
          p.subjectCategory.toLowerCase().includes(sLower)
      )
    );
  }

  if (maxTuition && typeof maxTuition === 'string') {
    const cap = parseFloat(maxTuition);
    if (!isNaN(cap)) {
      results = results.filter((u) =>
        u.programs.some((p) => {
          const country = COUNTRIES_DATA.find((c) => c.slug === u.countrySlug);
          const rate = country ? country.exchangeRateToBdt : 1;
          const tuitionInBdt = p.annualTuitionLocal * rate;
          // compare either in local or bdt depending on query
          return p.annualTuitionLocal <= cap || tuitionInBdt <= cap;
        })
      );
    }
  }

  if (maxIelts && typeof maxIelts === 'string') {
    const studentIelts = parseFloat(maxIelts);
    if (!isNaN(studentIelts)) {
      // Show universities where student's IELTS score meets the requirement
      results = results.filter((u) =>
        u.programs.some((p) => p.ieltsOverall <= studentIelts)
      );
    }
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.countryName.toLowerCase().includes(q) ||
        u.cityName.toLowerCase().includes(q) ||
        u.programs.some((p) => p.name.toLowerCase().includes(q) || p.subject.toLowerCase().includes(q))
    );
  }

  return res.json({
    total: results.length,
    universities: results,
  });
};

export const getUniversityBySlug = (req: Request, res: Response) => {
  const { slug } = req.params;
  const university = UNIVERSITIES_DATA.find((u) => u.slug === slug);

  if (!university) {
    return res.status(404).json({ error: 'University not found' });
  }

  const country = COUNTRIES_DATA.find((c) => c.slug === university.countrySlug);
  const scholarships = SCHOLARSHIPS_DATA.filter(
    (s) => s.countrySlug === university.countrySlug || s.universitySlug === university.slug
  );

  return res.json({
    university,
    country,
    scholarships,
    totalPrograms: university.programs.length,
  });
};

export const getPrograms = (req: Request, res: Response) => {
  const { search, country, level, subject } = req.query;

  // Flatten all programs
  let allPrograms = UNIVERSITIES_DATA.flatMap((u) =>
    u.programs.map((p) => ({
      ...p,
      universityName: u.name,
      universitySlug: u.slug,
      countrySlug: u.countrySlug,
      countryName: u.countryName,
      cityName: u.cityName,
      qsRanking: u.qsRanking,
      type: u.type,
    }))
  );

  if (country && typeof country === 'string' && country !== 'all') {
    allPrograms = allPrograms.filter((p) => p.countrySlug === country);
  }

  if (level && typeof level === 'string' && level !== 'all') {
    allPrograms = allPrograms.filter((p) => p.degreeLevel === level.toUpperCase());
  }

  if (subject && typeof subject === 'string' && subject !== 'all') {
    const s = subject.toLowerCase();
    allPrograms = allPrograms.filter(
      (p) =>
        p.subject.toLowerCase().includes(s) ||
        p.subjectCategory.toLowerCase().includes(s)
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    allPrograms = allPrograms.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subject.toLowerCase().includes(q) ||
        p.universityName.toLowerCase().includes(q)
    );
  }

  return res.json({
    total: allPrograms.length,
    programs: allPrograms,
  });
};

export const getProgramById = (req: Request, res: Response) => {
  const { id } = req.params;

  for (const uni of UNIVERSITIES_DATA) {
    const program = uni.programs.find((p) => p.id === id);
    if (program) {
      const country = COUNTRIES_DATA.find((c) => c.slug === uni.countrySlug);
      const scholarships = SCHOLARSHIPS_DATA.filter(
        (s) => s.countrySlug === uni.countrySlug
      );
      return res.json({
        program: {
          ...program,
          universityName: uni.name,
          universitySlug: uni.slug,
          countrySlug: uni.countrySlug,
          countryName: uni.countryName,
          cityName: uni.cityName,
          websiteUrl: uni.websiteUrl,
          admissionsUrl: uni.admissionsUrl,
          internationalOfficeEmail: uni.internationalOfficeEmail,
        },
        country,
        scholarships,
      });
    }
  }

  return res.status(404).json({ error: 'Program not found' });
};
