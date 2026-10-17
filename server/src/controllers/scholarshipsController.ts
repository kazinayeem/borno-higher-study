import { Request, Response } from 'express';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';

export const getScholarships = (req: Request, res: Response) => {
  const {
    country,
    type,
    degree,
    fullyFunded,
    bangladeshOnly,
    search,
  } = req.query;

  let results = [...SCHOLARSHIPS_DATA];

  if (country && typeof country === 'string' && country !== 'all') {
    results = results.filter((s) => s.countrySlug === country);
  }

  if (type && typeof type === 'string' && type !== 'all') {
    results = results.filter((s) => s.type === type.toUpperCase());
  }

  if (degree && typeof degree === 'string' && degree !== 'all') {
    results = results.filter((s) => s.degreeLevels.includes(degree.toUpperCase() as any));
  }

  if (fullyFunded === 'true') {
    results = results.filter((s) => s.isFullyFunded === true);
  }

  if (bangladeshOnly === 'true') {
    results = results.filter((s) => s.openToBangladesh === true);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.countryName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  return res.json({
    total: results.length,
    scholarships: results,
  });
};

export const getScholarshipById = (req: Request, res: Response) => {
  const { id } = req.params;
  const scholarship = SCHOLARSHIPS_DATA.find((s) => s.id === id);

  if (!scholarship) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }

  return res.json({ scholarship });
};
