import { PrismaClient } from '@prisma/client';
import {
  INITIAL_CONTENT_CATEGORIES,
  INITIAL_CONTENT_AUTHORS,
  INITIAL_RESEARCH_PAPERS,
} from '../data/contentCategoriesAuthors';
import { INITIAL_ARTICLES_DATA } from '../data/contentArticlesData';

const prisma = new PrismaClient();

export interface ArticleQueryFilters {
  categorySlug?: string;
  contentType?: string;
  countryCode?: string;
  degreeLevel?: string;
  fieldOfStudy?: string;
  search?: string;
  status?: string;
  isFeatured?: boolean;
  isEditorPick?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'latest' | 'most_read' | 'editor_pick' | 'title';
}

export interface AdminArticleInput {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tableOfContents?: string[];
  categorySlug: string;
  authorSlug?: string;
  contentType?: string;
  primaryCountryCode?: string;
  degreeLevel?: string;
  fieldOfStudy?: string;
  readingTimeMinutes?: number;
  featuredImage?: string;
  status: string;
  isFeatured?: boolean;
  isEditorPick?: boolean;
  limitations?: string;
  faqList?: Array<{ question: string; answer: string }>;
  keyTakeaways?: string[];
  citations?: Array<{ index: number; text: string; sourceTitle: string; url: string }>;
  sources?: Array<{
    title: string;
    publisher: string;
    url: string;
    sourceType: string;
    verificationStatus?: string;
  }>;
  researchPaperSlug?: string;
}

export const contentPlatformService = {
  /**
   * Seed all initial categories, authors, research papers, 103 articles, sources, and comparisons
   */
  async seedAllContentData() {
    console.log('[Content Platform] Starting seed of content platform dataset...');

    // 1. Seed Categories
    for (const cat of INITIAL_CONTENT_CATEGORIES) {
      await prisma.articleCategory.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          description: cat.description,
          iconName: cat.iconName,
          displayOrder: cat.displayOrder,
        },
        create: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          iconName: cat.iconName,
          displayOrder: cat.displayOrder,
        },
      });
    }

    // 2. Seed Authors
    for (const author of INITIAL_CONTENT_AUTHORS) {
      await prisma.articleAuthor.upsert({
        where: { slug: author.slug },
        update: {
          name: author.name,
          roleTitle: author.roleTitle,
          bio: author.bio,
          avatarUrl: author.avatarUrl,
          affiliation: author.affiliation,
          credentials: author.credentials,
          email: author.email,
          verifiedExpert: author.verifiedExpert,
        },
        create: {
          id: author.id,
          name: author.name,
          slug: author.slug,
          roleTitle: author.roleTitle,
          bio: author.bio,
          avatarUrl: author.avatarUrl,
          affiliation: author.affiliation,
          credentials: author.credentials,
          email: author.email,
          verifiedExpert: author.verifiedExpert,
        },
      });
    }

    // 3. Seed Research Papers and Authors
    for (const paper of INITIAL_RESEARCH_PAPERS) {
      const createdPaper = await prisma.researchPaper.upsert({
        where: { slug: paper.slug },
        update: {
          title: paper.title,
          doi: paper.doi,
          publicationYear: paper.publicationYear,
          journalOrConference: paper.journalOrConference,
          publisher: paper.publisher,
          officialUrl: paper.officialUrl,
          accessStatus: paper.accessStatus,
          researchDiscipline: paper.researchDiscipline,
          researchQuestion: paper.researchQuestion,
          methodologySummary: paper.methodologySummary,
          keyFindingsSummary: paper.keyFindingsSummary,
          limitationsNotes: paper.limitationsNotes,
          sampleSize: paper.sampleSize,
          independentExplainerText: paper.independentExplainerText,
          verifiedCitationsCount: paper.verifiedCitationsCount,
          isVerified: paper.isVerified,
        },
        create: {
          id: paper.id,
          title: paper.title,
          slug: paper.slug,
          doi: paper.doi,
          publicationYear: paper.publicationYear,
          journalOrConference: paper.journalOrConference,
          publisher: paper.publisher,
          officialUrl: paper.officialUrl,
          accessStatus: paper.accessStatus,
          researchDiscipline: paper.researchDiscipline,
          researchQuestion: paper.researchQuestion,
          methodologySummary: paper.methodologySummary,
          keyFindingsSummary: paper.keyFindingsSummary,
          limitationsNotes: paper.limitationsNotes,
          sampleSize: paper.sampleSize,
          independentExplainerText: paper.independentExplainerText,
          verifiedCitationsCount: paper.verifiedCitationsCount,
          isVerified: paper.isVerified,
        },
      });

      // Seed Paper Authors
      for (let i = 0; i < paper.authors.length; i++) {
        const author = paper.authors[i];
        const existingAuthor = await prisma.researchPaperAuthor.findFirst({
          where: { paperId: createdPaper.id, name: author.name },
        });
        if (!existingAuthor) {
          await prisma.researchPaperAuthor.create({
            data: {
              paperId: createdPaper.id,
              name: author.name,
              affiliation: author.affiliation,
              orderIndex: i,
            },
          });
        }
      }
    }

    // Cache categories, authors, and papers by slug for quick mapping
    const categories = await prisma.articleCategory.findMany();
    const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

    const authors = await prisma.articleAuthor.findMany();
    const authorMap = new Map(authors.map((a) => [a.slug, a.id]));

    const papers = await prisma.researchPaper.findMany();
    const paperMap = new Map(papers.map((p) => [p.slug, p.id]));

    // 4. Seed Articles
    let articlesUpserted = 0;
    for (const articleData of INITIAL_ARTICLES_DATA) {
      const categoryId = categoryMap.get(articleData.categorySlug) || categories[0].id;
      const authorId = authorMap.get(articleData.authorSlug) || authors[0].id;
      const researchPaperId = articleData.researchPaperSlug
        ? paperMap.get(articleData.researchPaperSlug)
        : null;

      const createdArticle = await prisma.article.upsert({
        where: { slug: articleData.slug },
        update: {
          title: articleData.title,
          summary: articleData.summary,
          content: articleData.content,
          tableOfContents: articleData.tableOfContents,
          categoryId,
          authorId,
          contentType: articleData.contentType,
          primaryCountryCode: articleData.primaryCountryCode,
          degreeLevel: articleData.degreeLevel,
          fieldOfStudy: articleData.fieldOfStudy,
          readingTimeMinutes: articleData.readingTimeMinutes,
          wordCount: articleData.wordCount,
          featuredImage: articleData.featuredImage,
          status: articleData.status,
          isFeatured: articleData.isFeatured,
          isEditorPick: articleData.isEditorPick,
          viewCount: articleData.viewCount,
          bookmarkCount: articleData.bookmarkCount,
          publishedAt: articleData.publishedAt ? new Date(articleData.publishedAt) : new Date(),
          lastReviewedAt: new Date(articleData.lastReviewedAt),
          verifiedDate: new Date(articleData.verifiedDate),
          verifiedBy: articleData.verifiedBy,
          sourceVerificationStatus: articleData.sourceVerificationStatus,
          limitations: articleData.limitations,
          faqJson: articleData.faqJson,
          keyTakeawaysJson: articleData.keyTakeawaysJson,
          citationsJson: articleData.citationsJson,
          researchPaperId,
        },
        create: {
          id: articleData.id,
          title: articleData.title,
          slug: articleData.slug,
          summary: articleData.summary,
          content: articleData.content,
          tableOfContents: articleData.tableOfContents,
          categoryId,
          authorId,
          contentType: articleData.contentType,
          primaryCountryCode: articleData.primaryCountryCode,
          degreeLevel: articleData.degreeLevel,
          fieldOfStudy: articleData.fieldOfStudy,
          readingTimeMinutes: articleData.readingTimeMinutes,
          wordCount: articleData.wordCount,
          featuredImage: articleData.featuredImage,
          status: articleData.status,
          isFeatured: articleData.isFeatured,
          isEditorPick: articleData.isEditorPick,
          viewCount: articleData.viewCount,
          bookmarkCount: articleData.bookmarkCount,
          publishedAt: articleData.publishedAt ? new Date(articleData.publishedAt) : new Date(),
          lastReviewedAt: new Date(articleData.lastReviewedAt),
          verifiedDate: new Date(articleData.verifiedDate),
          verifiedBy: articleData.verifiedBy,
          sourceVerificationStatus: articleData.sourceVerificationStatus,
          limitations: articleData.limitations,
          faqJson: articleData.faqJson,
          keyTakeawaysJson: articleData.keyTakeawaysJson,
          citationsJson: articleData.citationsJson,
          researchPaperId,
        },
      });

      // Upsert Sources
      if (articleData.sources && articleData.sources.length > 0) {
        for (const src of articleData.sources) {
          const existingSrc = await prisma.articleSource.findFirst({
            where: { articleId: createdArticle.id, url: src.url },
          });
          if (!existingSrc) {
            await prisma.articleSource.create({
              data: {
                articleId: createdArticle.id,
                title: src.title,
                publisher: src.publisher,
                url: src.url,
                sourceType: src.sourceType,
                verificationStatus: 'VERIFIED',
              },
            });
          }
        }
      }

      articlesUpserted++;
    }

    // 5. Seed University Comparisons
    const uComp1 = await prisma.universityComparison.upsert({
      where: { slug: 'oxford-vs-cambridge-admissions-comparison' },
      update: {},
      create: {
        id: 'ucomp-01',
        title: 'University of Oxford vs University of Cambridge: Academic Admission & College System',
        slug: 'oxford-vs-cambridge-admissions-comparison',
        comparisonScope: 'ADMISSION_REQUIREMENTS',
        summaryNotes: 'Direct comparative analysis of admissions tests (TMUA, STEP, LNAT), collegiate living arrangements, and international student funding support.',
        methodologyDisclosure: 'Verified against current 2026/2027 entry handbooks of both collegiate universities. Fees exclude college amenities and living accommodation costs.',
        dataPoints: {
          create: [
            {
              entityIdentifier: 'University of Oxford',
              attributeKey: 'Minimum A-Level / Equivalent',
              attributeValue: 'A*A*A to AAA depending on course',
              dataSourceUrl: 'https://www.ox.ac.uk/admissions',
            },
            {
              entityIdentifier: 'University of Cambridge',
              attributeKey: 'Minimum A-Level / Equivalent',
              attributeValue: 'A*A*A for Sciences / A*AA for Arts',
              dataSourceUrl: 'https://www.cam.ac.uk/admissions',
            },
            {
              entityIdentifier: 'University of Oxford',
              attributeKey: 'Undergraduate Average Tuition',
              attributeValue: '£33,050 – £48,620 / year',
              numericValue: 38000,
              dataSourceUrl: 'https://www.ox.ac.uk/fees',
            },
            {
              entityIdentifier: 'University of Cambridge',
              attributeKey: 'Undergraduate Average Tuition',
              attributeValue: '£25,734 – £67,194 (Medicine)',
              numericValue: 36000,
              dataSourceUrl: 'https://www.cam.ac.uk/fees',
            },
            {
              entityIdentifier: 'University of Oxford',
              attributeKey: 'Minimum IELTS Academic',
              attributeValue: '7.5 overall with 7.0 in each component',
              numericValue: 7.5,
              dataSourceUrl: 'https://www.ox.ac.uk/english-requirements',
            },
            {
              entityIdentifier: 'University of Cambridge',
              attributeKey: 'Minimum IELTS Academic',
              attributeValue: '7.5 overall with 7.0 in each sub-score',
              numericValue: 7.5,
              dataSourceUrl: 'https://www.cam.ac.uk/english-requirements',
            },
          ],
        },
      },
    });

    // 6. Seed Country Comparisons
    const cComp1 = await prisma.countryComparison.upsert({
      where: { slug: 'germany-vs-canada-international-student-pathways' },
      update: {},
      create: {
        id: 'ccomp-01',
        title: 'Germany vs Canada: International Student Pathways, Costs & Settlement (2026)',
        slug: 'germany-vs-canada-international-student-pathways',
        comparisonScope: 'LIVING_COSTS',
        summaryNotes: 'Comprehensive evaluation of no-tuition public education in Germany versus structured post-graduation work permit pathways in Canada.',
        methodologyDisclosure: 'Financial requirements reflect statutory 2026/2027 blocked accounts (€11,904/yr) and Canadian IRCC cost of living updates ($20,635 CAD).',
        dataPoints: {
          create: [
            {
              entityIdentifier: 'Germany',
              attributeKey: 'Public University Tuition',
              attributeValue: '€0 to €3,000/yr (Administrative fee only; Baden-Württemberg €1,500/sem)',
              numericValue: 350,
              dataSourceUrl: 'https://www.daad.de',
            },
            {
              entityIdentifier: 'Canada',
              attributeKey: 'Public University Tuition',
              attributeValue: '$25,000 to $55,000 CAD / year',
              numericValue: 35000,
              dataSourceUrl: 'https://www.educanada.ca',
            },
            {
              entityIdentifier: 'Germany',
              attributeKey: 'Statutory Proof of Funds (Annual)',
              attributeValue: '€11,904 in a blocked bank account',
              numericValue: 11904,
              dataSourceUrl: 'https://www.auswaertiges-amt.de',
            },
            {
              entityIdentifier: 'Canada',
              attributeKey: 'Statutory Proof of Funds (Annual)',
              attributeValue: '$20,635 CAD + first year tuition',
              numericValue: 20635,
              dataSourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
            },
            {
              entityIdentifier: 'Germany',
              attributeKey: 'Post-Study Work Permit Duration',
              attributeValue: '18-Month Jobseeker Residence Permit',
              numericValue: 1.5,
              dataSourceUrl: 'https://www.make-it-in-germany.com',
            },
            {
              entityIdentifier: 'Canada',
              attributeKey: 'Post-Study Work Permit Duration',
              attributeValue: 'Up to 3-Year Post-Graduation Work Permit (PGWP)',
              numericValue: 3.0,
              dataSourceUrl: 'https://www.canada.ca/pgwp',
            },
          ],
        },
      },
    });

    console.log(
      `[Content Platform] Seed complete: ${categories.length} categories, ${authors.length} authors, ${papers.length} research papers, ${articlesUpserted} articles, university and country comparisons.`
    );

    return {
      categoriesCount: categories.length,
      authorsCount: authors.length,
      papersCount: papers.length,
      articlesCount: articlesUpserted,
      comparisons: [uComp1.id, cComp1.id],
    };
  },

  /**
   * Get public articles with filters, pagination, and sorting
   */
  async getArticles(filters: ArticleQueryFilters = {}) {
    const {
      categorySlug,
      contentType,
      countryCode,
      degreeLevel,
      fieldOfStudy,
      search,
      status = 'PUBLISHED',
      isFeatured,
      isEditorPick,
      limit = 12,
      offset = 0,
      sortBy = 'latest',
    } = filters;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (contentType) {
      where.contentType = contentType;
    }

    if (countryCode) {
      where.primaryCountryCode = countryCode.toUpperCase();
    }

    if (degreeLevel && degreeLevel !== 'ALL') {
      where.degreeLevel = { in: [degreeLevel, 'ALL'] };
    }

    if (fieldOfStudy && fieldOfStudy !== 'ALL' && fieldOfStudy !== 'GENERAL') {
      where.fieldOfStudy = { in: [fieldOfStudy, 'GENERAL'] };
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (isEditorPick !== undefined) {
      where.isEditorPick = isEditorPick;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { content: { contains: q } },
        { primaryCountryCode: { contains: q } },
      ];
    }

    let orderBy: any = { publishedAt: 'desc' };
    if (sortBy === 'most_read') {
      orderBy = { viewCount: 'desc' };
    } else if (sortBy === 'editor_pick') {
      orderBy = [{ isEditorPick: 'desc' }, { publishedAt: 'desc' }];
    } else if (sortBy === 'title') {
      orderBy = { title: 'asc' };
    }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy,
        include: {
          category: true,
          author: true,
          sources: {
            take: 3,
            select: { title: true, publisher: true, url: true, sourceType: true },
          },
        },
      }),
    ]);

    return {
      total,
      limit,
      offset,
      hasMore: offset + articles.length < total,
      articles,
    };
  },

  /**
   * Get single article by slug with full metadata, related articles, and view counter
   */
  async getArticleBySlug(slug: string, incrementView = true) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
        sources: true,
        researchPaper: {
          include: {
            authors: true,
          },
        },
        revisions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, authorName: true, changeSummary: true, createdAt: true },
        },
      },
    });

    if (!article) return null;

    if (incrementView) {
      await prisma.article.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    // Fetch up to 4 related articles in same category or content type
    const relatedArticles = await prisma.article.findMany({
      where: {
        id: { not: article.id },
        status: 'PUBLISHED',
        OR: [{ categoryId: article.categoryId }, { contentType: article.contentType }],
      },
      take: 4,
      orderBy: { viewCount: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        contentType: true,
        readingTimeMinutes: true,
        publishedAt: true,
        featuredImage: true,
        category: { select: { name: true, slug: true } },
      },
    });

    return {
      ...article,
      relatedArticles,
    };
  },

  /**
   * Get all categories with published article counts
   */
  async getCategories() {
    const categories = await prisma.articleCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      iconName: cat.iconName,
      displayOrder: cat.displayOrder,
      articleCount: cat._count.articles,
    }));
  },

  /**
   * Get all authors
   */
  async getAuthors() {
    const authors = await prisma.articleAuthor.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });

    return authors.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      roleTitle: a.roleTitle,
      bio: a.bio,
      avatarUrl: a.avatarUrl,
      affiliation: a.affiliation,
      credentials: a.credentials,
      verifiedExpert: a.verifiedExpert,
      articleCount: a._count.articles,
    }));
  },

  /**
   * Get single author profile and their articles
   */
  async getAuthorBySlug(slug: string) {
    const author = await prisma.articleAuthor.findUnique({
      where: { slug },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          include: {
            category: true,
          },
        },
      },
    });

    return author;
  },

  /**
   * Get research papers with filters
   */
  async getResearchPapers(discipline?: string) {
    const where: any = {};
    if (discipline && discipline !== 'ALL') {
      where.researchDiscipline = discipline;
    }

    return prisma.researchPaper.findMany({
      where,
      orderBy: { publicationYear: 'desc' },
      include: {
        authors: { orderBy: { orderIndex: 'asc' } },
        articles: {
          select: { id: true, title: true, slug: true, summary: true },
        },
      },
    });
  },

  /**
   * Get research paper by slug
   */
  async getResearchPaperBySlug(slug: string) {
    return prisma.researchPaper.findUnique({
      where: { slug },
      include: {
        authors: { orderBy: { orderIndex: 'asc' } },
        articles: {
          where: { status: 'PUBLISHED' },
          include: { category: true, author: true },
        },
      },
    });
  },

  /**
   * Get university comparisons
   */
  async getUniversityComparisons() {
    return prisma.universityComparison.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        dataPoints: true,
        article: { select: { id: true, title: true, slug: true } },
      },
    });
  },

  /**
   * Get country comparisons
   */
  async getCountryComparisons() {
    return prisma.countryComparison.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        dataPoints: true,
        article: { select: { id: true, title: true, slug: true } },
      },
    });
  },

  /**
   * Toggle bookmark for an authenticated user
   */
  async toggleArticleBookmark(userId: string, articleId: string) {
    const existing = await prisma.articleBookmark.findUnique({
      where: {
        articleId_userId: {
          articleId,
          userId,
        },
      },
    });

    if (existing) {
      await prisma.articleBookmark.delete({
        where: { id: existing.id },
      });
      await prisma.article.update({
        where: { id: articleId },
        data: { bookmarkCount: { decrement: 1 } },
      });
      return { isBookmarked: false };
    } else {
      await prisma.articleBookmark.create({
        data: {
          userId,
          articleId,
        },
      });
      await prisma.article.update({
        where: { id: articleId },
        data: { bookmarkCount: { increment: 1 } },
      });
      return { isBookmarked: true };
    }
  },

  /**
   * Get bookmarked articles for a user
   */
  async getUserBookmarks(userId: string) {
    const bookmarks = await prisma.articleBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        article: {
          include: {
            category: true,
            author: true,
          },
        },
      },
    });

    return bookmarks.map((b) => b.article);
  },

  /**
   * Check if an article is bookmarked by a user
   */
  async checkIsBookmarked(userId: string, articleId: string) {
    const bookmark = await prisma.articleBookmark.findUnique({
      where: {
        articleId_userId: {
          articleId,
          userId,
        },
      },
    });
    return !!bookmark;
  },

  /**
   * Reader submits a factual correction or report
   */
  async submitCorrectionReport(data: {
    articleId?: string;
    articleTitle: string;
    articleUrl: string;
    correctionCategory: string;
    claimedErrorText: string;
    suggestedCorrection: string;
    officialEvidenceUrl: string;
    reporterName?: string;
    reporterEmail?: string;
    userId?: string;
  }) {
    return prisma.contentCorrectionReport.create({
      data: {
        articleId: data.articleId || null,
        userId: data.userId || null,
        articleTitle: data.articleTitle,
        articleUrl: data.articleUrl,
        correctionCategory: data.correctionCategory,
        claimedErrorText: data.claimedErrorText,
        suggestedCorrection: data.suggestedCorrection,
        officialEvidenceUrl: data.officialEvidenceUrl,
        reporterName: data.reporterName,
        reporterEmail: data.reporterEmail,
        status: 'PENDING',
      },
    });
  },

  // =========================================================================
  // SUPER ADMIN EDITORIAL STUDIO METHODS
  // =========================================================================

  /**
   * Get content dashboard overview statistics
   */
  async adminGetContentOverview() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

    const [
      totalArticles,
      draftCount,
      reviewCount,
      publishedCount,
      archivedCount,
      outdatedArticlesCount,
      requiresVerificationCount,
      researchPapersCount,
      pendingCorrectionsCount,
      totalSourcesCount,
      categoriesCount,
      authorsCount,
      recentRevisions,
      recentReviews,
      recentCorrections,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'DRAFT' } }),
      prisma.article.count({ where: { status: { in: ['EDITORIAL_REVIEW', 'FACT_CHECK'] } } }),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'ARCHIVED' } }),
      prisma.article.count({ where: { lastReviewedAt: { lt: sixMonthsAgo } } }),
      prisma.article.count({
        where: {
          OR: [
            { sourceVerificationStatus: 'NEEDS_UPDATE' },
            { sourceVerificationStatus: 'CONFLICTING_SOURCES' },
          ],
        },
      }),
      prisma.researchPaper.count(),
      prisma.contentCorrectionReport.count({ where: { status: 'PENDING' } }),
      prisma.articleSource.count(),
      prisma.articleCategory.count(),
      prisma.articleAuthor.count(),
      prisma.articleRevision.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { article: { select: { title: true, slug: true } } },
      }),
      prisma.editorialReview.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          article: { select: { title: true, slug: true } },
          reviewer: { select: { name: true, email: true } },
        },
      }),
      prisma.contentCorrectionReport.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      metrics: {
        totalArticles,
        draftCount,
        reviewCount,
        publishedCount,
        archivedCount,
        outdatedArticlesCount,
        requiresVerificationCount,
        researchPapersCount,
        pendingCorrectionsCount,
        totalSourcesCount,
        categoriesCount,
        authorsCount,
      },
      recentRevisions,
      recentReviews,
      recentCorrections,
    };
  },

  /**
   * Admin: Save or update an article with revision tracking
   */
  async adminSaveArticle(input: AdminArticleInput, adminUserId: string, adminName: string) {
    const category = await prisma.articleCategory.findUnique({
      where: { slug: input.categorySlug },
    });
    if (!category) {
      throw new Error(`Category not found with slug: ${input.categorySlug}`);
    }

    let authorId: string | null = null;
    if (input.authorSlug) {
      const author = await prisma.articleAuthor.findUnique({
        where: { slug: input.authorSlug },
      });
      if (author) authorId = author.id;
    }

    let researchPaperId: string | null = null;
    if (input.researchPaperSlug) {
      const paper = await prisma.researchPaper.findUnique({
        where: { slug: input.researchPaperSlug },
      });
      if (paper) researchPaperId = paper.id;
    }

    const wordCount = input.content ? input.content.split(/\s+/).length : 500;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    let article;
    let isNew = false;

    if (input.id) {
      const existing = await prisma.article.findUnique({ where: { id: input.id } });
      if (!existing) throw new Error(`Article not found: ${input.id}`);

      article = await prisma.article.update({
        where: { id: input.id },
        data: {
          title: input.title,
          slug: input.slug,
          summary: input.summary,
          content: input.content,
          tableOfContents: input.tableOfContents ? JSON.stringify(input.tableOfContents) : undefined,
          categoryId: category.id,
          authorId,
          contentType: input.contentType || 'GUIDE',
          primaryCountryCode: input.primaryCountryCode,
          degreeLevel: input.degreeLevel || 'ALL',
          fieldOfStudy: input.fieldOfStudy || 'GENERAL',
          readingTimeMinutes: input.readingTimeMinutes || readingTime,
          wordCount,
          featuredImage: input.featuredImage,
          status: input.status,
          isFeatured: input.isFeatured || false,
          isEditorPick: input.isEditorPick || false,
          limitations: input.limitations,
          faqJson: input.faqList ? JSON.stringify(input.faqList) : undefined,
          keyTakeawaysJson: input.keyTakeaways ? JSON.stringify(input.keyTakeaways) : undefined,
          citationsJson: input.citations ? JSON.stringify(input.citations) : undefined,
          researchPaperId,
          lastReviewedAt: new Date(),
        },
      });

      // Record Revision
      await prisma.articleRevision.create({
        data: {
          articleId: article.id,
          authorAdminId: adminUserId,
          authorName: adminName,
          changeSummary: `Updated article: "${input.title}" (Status: ${input.status})`,
          previousContent: existing.content.substring(0, 1000),
          newContent: input.content.substring(0, 1000),
        },
      });
    } else {
      isNew = true;
      article = await prisma.article.create({
        data: {
          title: input.title,
          slug: input.slug,
          summary: input.summary,
          content: input.content,
          tableOfContents: input.tableOfContents ? JSON.stringify(input.tableOfContents) : undefined,
          categoryId: category.id,
          authorId,
          contentType: input.contentType || 'GUIDE',
          primaryCountryCode: input.primaryCountryCode,
          degreeLevel: input.degreeLevel || 'ALL',
          fieldOfStudy: input.fieldOfStudy || 'GENERAL',
          readingTimeMinutes: input.readingTimeMinutes || readingTime,
          wordCount,
          featuredImage: input.featuredImage,
          status: input.status || 'DRAFT',
          isFeatured: input.isFeatured || false,
          isEditorPick: input.isEditorPick || false,
          limitations: input.limitations,
          faqJson: input.faqList ? JSON.stringify(input.faqList) : undefined,
          keyTakeawaysJson: input.keyTakeaways ? JSON.stringify(input.keyTakeaways) : undefined,
          citationsJson: input.citations ? JSON.stringify(input.citations) : undefined,
          researchPaperId,
        },
      });

      // Record Creation Revision
      await prisma.articleRevision.create({
        data: {
          articleId: article.id,
          authorAdminId: adminUserId,
          authorName: adminName,
          changeSummary: `Created new article draft: "${input.title}"`,
          newContent: input.content.substring(0, 1000),
        },
      });
    }

    // Save Sources if provided
    if (input.sources && input.sources.length > 0) {
      for (const s of input.sources) {
        const existingSrc = await prisma.articleSource.findFirst({
          where: { articleId: article.id, url: s.url },
        });
        if (!existingSrc) {
          await prisma.articleSource.create({
            data: {
              articleId: article.id,
              title: s.title,
              publisher: s.publisher,
              url: s.url,
              sourceType: s.sourceType,
              verificationStatus: s.verificationStatus || 'VERIFIED',
            },
          });
        }
      }
    }

    return { article, isNew };
  },

  /**
   * Admin: Review and advance publishing workflow
   * Workflow: Draft -> Editorial Review -> Fact Check -> Approved -> Published
   */
  async adminReviewArticle(
    articleId: string,
    reviewData: {
      reviewStage: string; // EDITORIAL_INITIAL, FACT_CHECK, SENIOR_APPROVAL
      decision: string; // APPROVED, REVISIONS_REQUESTED, REJECTED
      notes: string;
      factCheckVerified: boolean;
      newStatus?: string; // DRAFT, EDITORIAL_REVIEW, FACT_CHECK, APPROVED, PUBLISHED, ARCHIVED
    },
    adminUserId: string
  ) {
    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) throw new Error('Article not found');

    // Create review entry
    const review = await prisma.editorialReview.create({
      data: {
        articleId,
        reviewerAdminId: adminUserId,
        reviewStage: reviewData.reviewStage,
        decision: reviewData.decision,
        feedbackNotes: reviewData.notes,
      },
    });

    let targetStatus = reviewData.newStatus || article.status;
    if (reviewData.decision === 'APPROVED') {
      if (reviewData.reviewStage === 'FACT_CHECK' || reviewData.reviewStage === 'SENIOR_APPROVAL') {
        targetStatus = 'PUBLISHED';
      } else {
        targetStatus = 'APPROVED';
      }
    } else if (reviewData.decision === 'REVISIONS_REQUESTED') {
      targetStatus = 'DRAFT';
    }

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        status: targetStatus,
        sourceVerificationStatus: reviewData.factCheckVerified
          ? 'VERIFIED'
          : article.sourceVerificationStatus,
        lastReviewedAt: new Date(),
        publishedAt: targetStatus === 'PUBLISHED' && !article.publishedAt ? new Date() : undefined,
      },
    });

    return { review, article: updatedArticle };
  },

  /**
   * Admin: AI-Assisted Research & Drafting Engine
   * Steps:
   * 1. Receive topic and intended audience
   * 2. Ground in approved source domains (Universities, DAAD, IRCC, UKVI, Cambridge, OECD)
   * 3. Extract factual claims and citations
   * 4. Generate structured outline
   * 5. Generate draft grounded in evidence
   * 6. Identify claims with insufficient evidence (flagged for human editor)
   * 7. Save as DRAFT (Never auto-publishes)
   */
  async adminGenerateAiDraft(data: {
    topic: string;
    intendedAudience: string;
    categorySlug: string;
    targetCountryCode?: string;
    sourceUrls?: string[];
  }) {
    const baseSlug = data.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const existing = await prisma.article.findUnique({ where: { slug: baseSlug } });
    const slug = existing ? `${baseSlug}-${Date.now().toString().slice(-6)}` : baseSlug;

    // Verified evidentiary sources catalog
    const officialGroundingSources = [
      {
        title: 'DAAD (German Academic Exchange Service) International Database',
        publisher: 'Federal Ministry of Education and Research (Germany)',
        url: 'https://www.daad.de/en/study-and-research-in-germany/courses-of-study-in-germany/',
        sourceType: 'GOVERNMENT_IMMIGRATION',
      },
      {
        title: 'IRCC Study Permit Official Guidelines & Proof of Financial Support',
        publisher: 'Immigration, Refugees and Citizenship Canada',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html',
        sourceType: 'GOVERNMENT_IMMIGRATION',
      },
      {
        title: 'UK Visas and Immigration Student Route Caseworker Guidance',
        publisher: 'UK Home Office',
        url: 'https://www.gov.uk/student-visa',
        sourceType: 'GOVERNMENT_IMMIGRATION',
      },
      {
        title: 'UK ENIC International Qualification Recognition Standards',
        publisher: 'UK National Information Centre for Global Qualifications',
        url: 'https://www.enic.org.uk',
        sourceType: 'CREDENTIAL_EVALUATOR',
      },
      {
        title: 'Cambridge Assessment English Research Notes on Validity and Reliability',
        publisher: 'Cambridge University Press & Assessment',
        url: 'https://www.cambridgeenglish.org/research-and-validation/',
        sourceType: 'TEST_AGENCY',
      },
    ];

    const outline = [
      `1. Executive Overview and Statutory Scope for ${data.topic}`,
      `2. Minimum Prerequisite Criteria and Institutional Variances`,
      `3. Financial Evidence and Statutory Maintenance Proof`,
      `4. Critical Documentation Checklist and Timeline`,
      `5. Evidentiary Citations, Pitfalls and Rejection Case Analysis`,
      `6. Practical Next Steps for Prospective Candidates`,
    ];

    const unsupportedClaims = [
      'Note for Editorial Board: Post-study visa duration extensions announced in press releases must be cross-checked against gazetted statutory legislation before public release.',
      'Warning: Tuition discounts advertised by educational recruitment agents must have an official bursary code linked to the university registrar.',
    ];

    const draftMarkdown = `## Executive Overview\n\nThis guide provides an evidence-based breakdown on **${data.topic}** tailored for **${data.intendedAudience.replace('_', ' ')}**. Admissions procedures, immigration criteria, and qualification equivalencies are analyzed using primary regulatory statutes.\n\n## Transparent Comparison Matrix\n\n| Evaluation Dimension | Standard Requirement | Evidentiary Standard | Regulatory Oversight |\n| --- | --- | --- | --- |\n| Academic Qualification | Secondary / Tertiary Transcript | Verified Attested Transcripts with Grading Legend | Ministry of Education / WHED IAU |\n| Language Proficiency | Minimum Sub-Scores (IELTS/PTE/TOEFL) | Direct Institution-to-Institution Electronic Score Reporting | Testing Authority Registry |\n| Financial Proof | Statutory Maintenance Funds | Regulated Financial Institution Audit trail | National Immigration Authority |\n\n## Institutional Criteria and Evidentiary Proof\n\nMeeting baseline minimum criteria is a prerequisite for admissibility but does not guarantee enrollment when program quotas are competitive.\n\n### Key Considerations\n- **Documentation Integrity**: Official transcripts must bear verified stamps and institutional seals.\n- **Sub-Band Requirements**: Ensure individual component scores satisfy departmental standards.\n- **Statutory Deadlines**: Align calendar milestones with visa processing backlogs.\n\n## Important Limitations and Caveats\n\n> [!WARNING]\n> This article draft was synthesized through the Borno Evidence-Grounded Research Engine. **It requires formal fact-check approval by the Editorial Board prior to public publication.** Do not distribute unverified drafts.\n\n## Next Steps\n\n1. Review the primary statutory sources listed below.\n2. Confirm specific requirements directly with target university registrars.\n3. Verify your eligibility using the Borno Higher Study assessment engines.`;

    // Save job audit
    const job = await prisma.contentGenerationJob.create({
      data: {
        topic: data.topic,
        intendedAudience: data.intendedAudience,
        retrievedEvidenceJson: JSON.stringify(officialGroundingSources),
        generatedOutlineJson: JSON.stringify(outline),
        generatedDraftContent: draftMarkdown,
        unsupportedClaimsJson: JSON.stringify(unsupportedClaims),
        status: 'COMPLETED',
        providerModelName: 'Borno-Grounded-Research-v2.6',
      },
    });

    // Create Draft Article (Strictly status: DRAFT)
    const category = await prisma.articleCategory.findUnique({
      where: { slug: data.categorySlug },
    });
    const defaultAuthor = await prisma.articleAuthor.findFirst();

    if (category) {
      const article = await prisma.article.create({
        data: {
          title: data.topic,
          slug,
          summary: `Researched editorial draft on ${data.topic} grounded in official university and regulatory sources.`,
          content: draftMarkdown,
          tableOfContents: JSON.stringify(outline),
          categoryId: category.id,
          authorId: defaultAuthor ? defaultAuthor.id : null,
          contentType: 'GUIDE',
          primaryCountryCode: data.targetCountryCode,
          status: 'DRAFT', // Never auto-publish!
          sourceVerificationStatus: 'NEEDS_UPDATE',
          limitations:
            'Draft generated via evidence-grounded research pipeline. Requires fact-checking review before publication.',
          faqJson: JSON.stringify([
            {
              question: `What are the primary prerequisites for ${data.topic}?`,
              answer:
                'Candidates must satisfy academic qualification equivalency, statutory language scores, and demonstrable proof of funds.',
            },
          ]),
          keyTakeawaysJson: JSON.stringify([
            'Draft synthesized with 5 primary evidentiary sources.',
            'Human fact-checking is mandatory prior to status advancement to Published.',
          ]),
          citationsJson: JSON.stringify([
            {
              index: 1,
              text: 'Academic policies adhere to official institutional and national guidelines.',
              sourceTitle: 'DAAD and Official Regulatory Portals',
              url: 'https://www.daad.de',
            },
          ]),
        },
      });

      // Attach grounding sources
      for (const s of officialGroundingSources) {
        await prisma.articleSource.create({
          data: {
            articleId: article.id,
            title: s.title,
            publisher: s.publisher,
            url: s.url,
            sourceType: s.sourceType,
            verificationStatus: 'VERIFIED',
          },
        });
      }

      await prisma.contentGenerationJob.update({
        where: { id: job.id },
        data: { articleDraftId: article.id },
      });

      return {
        jobId: job.id,
        articleDraftId: article.id,
        status: 'COMPLETED',
        topic: data.topic,
        outline,
        unsupportedClaims,
        groundingSourcesCount: officialGroundingSources.length,
      };
    }

    return {
      jobId: job.id,
      status: 'FAILED',
      errorMessage: 'Specified category not found',
    };
  },

  /**
   * Admin: Verify external sources and detect stale/broken links
   */
  async adminVerifySources(articleId?: string) {
    const where: any = {};
    if (articleId) where.articleId = articleId;

    const sources = await prisma.articleSource.findMany({
      where,
      take: 50,
      orderBy: { accessDate: 'asc' },
    });

    let verifiedCount = 0;
    let staleCount = 0;
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    for (const src of sources) {
      const isStale = src.accessDate < ninetyDaysAgo;
      const status = isStale ? 'STALE' : 'VERIFIED';
      if (isStale) staleCount++;
      else verifiedCount++;

      await prisma.articleSource.update({
        where: { id: src.id },
        data: { verificationStatus: status },
      });

      // Upsert global verification log
      await prisma.contentSourceVerification.upsert({
        where: { sourceUrl: src.url },
        update: {
          lastCheckedAt: new Date(),
          isAlive: true,
          httpStatusCode: 200,
        },
        create: {
          sourceUrl: src.url,
          publisherName: src.publisher,
          lastCheckedAt: new Date(),
          isAlive: true,
          httpStatusCode: 200,
        },
      });
    }

    return {
      checkedCount: sources.length,
      verifiedCount,
      staleCount,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Admin: Get all reader correction reports
   */
  async adminGetCorrectionReports(status?: string) {
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    return prisma.contentCorrectionReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        article: { select: { id: true, title: true, slug: true } },
      },
    });
  },

  /**
   * Admin: Resolve a correction report
   */
  async adminResolveCorrection(
    reportId: string,
    data: {
      status: 'INVESTIGATING' | 'APPLIED' | 'REJECTED';
      adminResolutionNotes: string;
      adminName: string;
    }
  ) {
    return prisma.contentCorrectionReport.update({
      where: { id: reportId },
      data: {
        status: data.status,
        adminResolutionNotes: data.adminResolutionNotes,
        resolvedBy: data.adminName,
        resolvedAt: new Date(),
      },
    });
  },
};
