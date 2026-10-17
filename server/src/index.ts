import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import {
  getRobotsTxt,
  getSitemapIndex,
  getMainSitemap,
  getCountriesSitemap,
  getUniversitiesSitemap,
  getProgramsSitemap,
  getScholarshipsSitemap,
} from './controllers/seoController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Technical SEO Routes (Robots.txt & XML Sitemaps)
app.get('/robots.txt', getRobotsTxt);
app.get('/sitemap.xml', getSitemapIndex);
app.get('/sitemap-main.xml', getMainSitemap);
app.get('/sitemap-countries.xml', getCountriesSitemap);
app.get('/sitemap-universities.xml', getUniversitiesSitemap);
app.get('/sitemap-programs.xml', getProgramsSitemap);
app.get('/sitemap-scholarships.xml', getScholarshipsSitemap);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Borno Higher Study API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api', apiRouter);


// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`\x1b[32m✔ Borno Higher Study API Server running on http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[36m✔ Health check: http://localhost:${PORT}/api/health\x1b[0m`);
});

export default app;
