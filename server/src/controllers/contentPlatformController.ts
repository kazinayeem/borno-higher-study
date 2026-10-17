import { Request, Response } from 'express';
import { contentPlatformService } from '../services/contentPlatformService';

export const getArticles = async (req: Request, res: Response) => {
  try {
    const {
      category,
      type,
      country,
      degreeLevel,
      field,
      search,
      status,
      featured,
      editorPick,
      limit,
      offset,
      sortBy,
    } = req.query;

    const result = await contentPlatformService.getArticles({
      categorySlug: category as string,
      contentType: type as string,
      countryCode: country as string,
      degreeLevel: degreeLevel as string,
      fieldOfStudy: field as string,
      search: search as string,
      status: (status as string) || 'PUBLISHED',
      isFeatured: featured === 'true' ? true : undefined,
      isEditorPick: editorPick === 'true' ? true : undefined,
      limit: limit ? parseInt(limit as string, 10) : 12,
      offset: offset ? parseInt(offset as string, 10) : 0,
      sortBy: sortBy as any,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch articles' });
  }
};

export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const article = await contentPlatformService.getArticleBySlug(slug, true);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error: any) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch article' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await contentPlatformService.getCategories();
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch categories' });
  }
};

export const getAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await contentPlatformService.getAuthors();
    res.json(authors);
  } catch (error: any) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch authors' });
  }
};

export const getAuthorBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const author = await contentPlatformService.getAuthorBySlug(slug);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(author);
  } catch (error: any) {
    console.error('Error fetching author profile:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch author' });
  }
};

export const getResearchPapers = async (req: Request, res: Response) => {
  try {
    const { discipline } = req.query;
    const papers = await contentPlatformService.getResearchPapers(discipline as string);
    res.json(papers);
  } catch (error: any) {
    console.error('Error fetching research papers:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch research papers' });
  }
};

export const getResearchPaperBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const paper = await contentPlatformService.getResearchPaperBySlug(slug);
    if (!paper) {
      return res.status(404).json({ error: 'Research paper not found' });
    }
    res.json(paper);
  } catch (error: any) {
    console.error('Error fetching research paper:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch research paper' });
  }
};

export const getUniversityComparisons = async (req: Request, res: Response) => {
  try {
    const comparisons = await contentPlatformService.getUniversityComparisons();
    res.json(comparisons);
  } catch (error: any) {
    console.error('Error fetching university comparisons:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch university comparisons' });
  }
};

export const getCountryComparisons = async (req: Request, res: Response) => {
  try {
    const comparisons = await contentPlatformService.getCountryComparisons();
    res.json(comparisons);
  } catch (error: any) {
    console.error('Error fetching country comparisons:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch country comparisons' });
  }
};

export const toggleArticleBookmark = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const { articleId } = req.params;
    const result = await contentPlatformService.toggleArticleBookmark(user.id, articleId);
    res.json(result);
  } catch (error: any) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ error: error.message || 'Failed to toggle bookmark' });
  }
};

export const getUserBookmarks = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const bookmarks = await contentPlatformService.getUserBookmarks(user.id);
    res.json(bookmarks);
  } catch (error: any) {
    console.error('Error fetching user bookmarks:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch bookmarks' });
  }
};

export const checkIsBookmarked = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      return res.json({ isBookmarked: false });
    }
    const { articleId } = req.params;
    const isBookmarked = await contentPlatformService.checkIsBookmarked(user.id, articleId);
    res.json({ isBookmarked });
  } catch (error: any) {
    res.json({ isBookmarked: false });
  }
};

export const submitCorrectionReport = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const {
      articleId,
      articleTitle,
      articleUrl,
      correctionCategory,
      claimedErrorText,
      suggestedCorrection,
      officialEvidenceUrl,
      reporterName,
      reporterEmail,
    } = req.body;

    if (!articleTitle || !articleUrl || !claimedErrorText || !officialEvidenceUrl) {
      return res.status(400).json({
        error: 'Missing required report fields (articleTitle, articleUrl, claimedErrorText, officialEvidenceUrl)',
      });
    }

    const report = await contentPlatformService.submitCorrectionReport({
      articleId,
      articleTitle,
      articleUrl,
      correctionCategory: correctionCategory || 'FACTUAL_ERROR',
      claimedErrorText,
      suggestedCorrection: suggestedCorrection || '',
      officialEvidenceUrl,
      reporterName,
      reporterEmail,
      userId: user?.id,
    });

    res.status(201).json({ success: true, reportId: report.id });
  } catch (error: any) {
    console.error('Error submitting correction report:', error);
    res.status(500).json({ error: error.message || 'Failed to submit report' });
  }
};

// ============================================================================
// SUPER ADMIN EDITORIAL STUDIO CONTROLLERS
// ============================================================================

export const adminGetContentOverview = async (req: Request, res: Response) => {
  try {
    const overview = await contentPlatformService.adminGetContentOverview();
    res.json(overview);
  } catch (error: any) {
    console.error('Error fetching content overview:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch overview' });
  }
};

export const adminSaveArticle = async (req: Request, res: Response) => {
  try {
    const adminUser = (req as any).user;
    const result = await contentPlatformService.adminSaveArticle(
      req.body,
      adminUser?.id || 'admin-system',
      adminUser?.name || 'Super Admin'
    );
    res.json(result);
  } catch (error: any) {
    console.error('Error saving article:', error);
    res.status(500).json({ error: error.message || 'Failed to save article' });
  }
};

export const adminReviewArticle = async (req: Request, res: Response) => {
  try {
    const adminUser = (req as any).user;
    const { id } = req.params;
    const { reviewStage, decision, notes, factCheckVerified, newStatus } = req.body;

    const result = await contentPlatformService.adminReviewArticle(
      id,
      { reviewStage, decision, notes, factCheckVerified, newStatus },
      adminUser?.id || 'admin-system'
    );
    res.json(result);
  } catch (error: any) {
    console.error('Error reviewing article:', error);
    res.status(500).json({ error: error.message || 'Failed to review article' });
  }
};

export const adminGenerateAiDraft = async (req: Request, res: Response) => {
  try {
    const { topic, intendedAudience, categorySlug, targetCountryCode, sourceUrls } = req.body;
    if (!topic || !categorySlug) {
      return res.status(400).json({ error: 'Topic and categorySlug are required' });
    }

    const result = await contentPlatformService.adminGenerateAiDraft({
      topic,
      intendedAudience: intendedAudience || 'BANGLADESH_APPLICANTS',
      categorySlug,
      targetCountryCode,
      sourceUrls,
    });
    res.json(result);
  } catch (error: any) {
    console.error('Error generating AI draft:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI draft' });
  }
};

export const adminVerifySources = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.body;
    const result = await contentPlatformService.adminVerifySources(articleId);
    res.json(result);
  } catch (error: any) {
    console.error('Error verifying sources:', error);
    res.status(500).json({ error: error.message || 'Failed to verify sources' });
  }
};

export const adminGetCorrectionReports = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const reports = await contentPlatformService.adminGetCorrectionReports(status as string);
    res.json(reports);
  } catch (error: any) {
    console.error('Error fetching correction reports:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch reports' });
  }
};

export const adminResolveCorrection = async (req: Request, res: Response) => {
  try {
    const adminUser = (req as any).user;
    const { id } = req.params;
    const { status, adminResolutionNotes } = req.body;

    const updated = await contentPlatformService.adminResolveCorrection(id, {
      status,
      adminResolutionNotes,
      adminName: adminUser?.name || 'Super Admin',
    });
    res.json(updated);
  } catch (error: any) {
    console.error('Error resolving correction:', error);
    res.status(500).json({ error: error.message || 'Failed to resolve report' });
  }
};

export const adminSeedContentPlatform = async (req: Request, res: Response) => {
  try {
    const result = await contentPlatformService.seedAllContentData();
    res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error seeding content platform:', error);
    res.status(500).json({ error: error.message || 'Failed to seed content platform' });
  }
};
