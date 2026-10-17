import { Request, Response } from 'express';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';

export const getCountries = (req: Request, res: Response) => {
  const { search, region } = req.query;

  let results = [...COUNTRIES_DATA];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.capitalCity.toLowerCase().includes(q) ||
        c.majorCities.some((city) => city.toLowerCase().includes(q))
    );
  }

  // Enrich with count of verified universities and scholarships
  const enriched = results.map((c) => {
    const uniCount = UNIVERSITIES_DATA.filter((u) => u.countrySlug === c.slug).length;
    const schCount = SCHOLARSHIPS_DATA.filter((s) => s.countrySlug === c.slug).length;
    return {
      ...c,
      universityCount: uniCount,
      scholarshipCount: schCount,
    };
  });

  return res.json({
    total: enriched.length,
    countries: enriched,
  });
};

export const getCountryBySlug = (req: Request, res: Response) => {
  const { slug } = req.params;
  const country = COUNTRIES_DATA.find((c) => c.slug === slug);

  if (!country) {
    return res.status(404).json({ error: 'Country not found' });
  }

  const universities = UNIVERSITIES_DATA.filter((u) => u.countrySlug === country.slug);
  const scholarships = SCHOLARSHIPS_DATA.filter((s) => s.countrySlug === country.slug);

  return res.json({
    country,
    universities,
    scholarships,
    stats: {
      totalUniversities: universities.length,
      totalScholarships: scholarships.length,
      avgLivingCostBdt: Math.round(country.avgLivingCostMonthly * country.exchangeRateToBdt),
    },
  });
};
