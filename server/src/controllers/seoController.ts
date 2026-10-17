import { Request, Response } from 'express';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';

const DOMAIN = 'https://borno.edu';
const LAST_MOD = new Date().toISOString().split('T')[0];

export const getRobotsTxt = (req: Request, res: Response) => {
  const content = `# Robots.txt for Borno Higher Study
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /auth

Sitemap: ${DOMAIN}/sitemap.xml
`;
  res.type('text/plain').send(content);
};

export const getSitemapIndex = (req: Request, res: Response) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap-main.xml</loc>
    <lastmod>${LAST_MOD}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-countries.xml</loc>
    <lastmod>${LAST_MOD}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-universities.xml</loc>
    <lastmod>${LAST_MOD}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-programs.xml</loc>
    <lastmod>${LAST_MOD}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-scholarships.xml</loc>
    <lastmod>${LAST_MOD}</lastmod>
  </sitemap>
</sitemapindex>`;
  res.type('application/xml').send(xml);
};

export const getMainSitemap = (req: Request, res: Response) => {
  const routes = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/countries', priority: '0.9', changefreq: 'weekly' },
    { path: '/universities', priority: '0.9', changefreq: 'daily' },
    { path: '/courses', priority: '0.9', changefreq: 'daily' },
    { path: '/scholarships', priority: '0.9', changefreq: 'daily' },
    { path: '/calculator', priority: '0.8', changefreq: 'monthly' },
    { path: '/english-checker', priority: '0.8', changefreq: 'monthly' },
    { path: '/advisor', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.6', changefreq: 'monthly' },
    { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${DOMAIN}${r.path}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
};

export const getCountriesSitemap = (req: Request, res: Response) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${COUNTRIES_DATA.map(
  (c) => `  <url>
    <loc>${DOMAIN}/countries/${c.slug}</loc>
    <lastmod>${c.lastVerifiedAt ? c.lastVerifiedAt.split('T')[0] : LAST_MOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
).join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
};

export const getUniversitiesSitemap = (req: Request, res: Response) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${UNIVERSITIES_DATA.map(
  (u) => `  <url>
    <loc>${DOMAIN}/universities/${u.slug}</loc>
    <lastmod>${u.lastVerifiedAt ? u.lastVerifiedAt.split('T')[0] : LAST_MOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
).join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
};

export const getProgramsSitemap = (req: Request, res: Response) => {
  const programs: any[] = [];
  UNIVERSITIES_DATA.forEach((u) => {
    (u.programs || []).forEach((p) => {
      programs.push({
        id: p.id,
        lastmod: p.lastVerifiedAt ? p.lastVerifiedAt.split('T')[0] : LAST_MOD,
      });
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${programs
  .map(
    (p) => `  <url>
    <loc>${DOMAIN}/courses/${p.id}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
};

export const getScholarshipsSitemap = (req: Request, res: Response) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SCHOLARSHIPS_DATA.map(
  (s) => `  <url>
    <loc>${DOMAIN}/scholarships/${s.id}</loc>
    <lastmod>${s.lastVerifiedAt ? s.lastVerifiedAt.split('T')[0] : LAST_MOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
).join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
};
