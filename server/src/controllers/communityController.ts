import { Request, Response } from 'express';
import { prisma } from '../services/db.js';

export const getPosts = async (req: Request, res: Response) => {
  const { category, destination, search, page = '1', limit = '10' } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const take = parseInt(limit as string, 10) || 10;
  const skip = (pageNum - 1) * take;

  const where: any = {
    status: 'APPROVED',
  };

  if (category && category !== 'all') {
    where.category = category as string;
  }

  if (destination && destination !== 'all') {
    where.destinationCountry = {
      contains: destination as string,
    };
  }

  if (search && typeof search === 'string') {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { destinationCountry: { contains: search } },
      { institutionName: { contains: search } },
    ];
  }

  try {
    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              role: true,
              avatarUrl: true,
            },
          },
        },
      }),
    ]);

    return res.json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / take),
      posts,
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return res.status(500).json({ error: 'Failed to fetch community posts.' });
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Only allow public viewing if approved, or if the author/admin is viewing
    const user = (req as any).user;
    const isAuthor = user && user.id === post.authorId;
    const isAdmin = user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'MODERATOR');

    if (post.status !== 'APPROVED' && !isAuthor && !isAdmin) {
      return res.status(403).json({ error: 'This post is currently pending editorial review.' });
    }

    // Increment views asynchronously
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    }).catch(() => null);

    return res.json({ post });
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return res.status(500).json({ error: 'Failed to retrieve post details.' });
  }
};

export const applyForContributor = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  const {
    studyDestination,
    currentInstitution,
    qualificationEnrolled,
    statementOfIntent,
    writingSampleUrl,
  } = req.body;

  if (!studyDestination || !currentInstitution || !qualificationEnrolled || !statementOfIntent) {
    return res.status(400).json({
      error: 'Please provide destination, current institution, qualification, and statement of intent.',
    });
  }

  try {
    const existing = await prisma.contributorApplication.findUnique({
      where: { userId: user.id },
    });

    if (existing && existing.status === 'PENDING') {
      return res.status(400).json({
        error: 'You already have a pending contributor application under review.',
      });
    }

    const application = await prisma.contributorApplication.upsert({
      where: { userId: user.id },
      update: {
        studyDestination,
        currentInstitution,
        qualificationEnrolled,
        statementOfIntent,
        writingSampleUrl,
        status: 'PENDING',
        appliedAt: new Date(),
        adminFeedback: null,
      },
      create: {
        userId: user.id,
        studyDestination,
        currentInstitution,
        qualificationEnrolled,
        statementOfIntent,
        writingSampleUrl,
        status: 'PENDING',
      },
    });

    return res.status(201).json({
      message: 'Contributor application submitted successfully. An administrator will review your credentials.',
      application,
    });
  } catch (error) {
    console.error('Error submitting contributor application:', error);
    return res.status(500).json({ error: 'Failed to submit contributor application.' });
  }
};

export const getMyApplication = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const application = await prisma.contributorApplication.findUnique({
      where: { userId: user.id },
    });

    return res.json({ application });
  } catch (error) {
    console.error('Error fetching my application:', error);
    return res.status(500).json({ error: 'Failed to fetch application status.' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  // Verify contributor or admin role
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || (dbUser.role !== 'CONTRIBUTOR' && dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({
      error: 'Only approved Student Contributors and Administrators can publish articles.',
    });
  }

  const {
    title,
    category,
    destinationCountry,
    institutionName,
    content,
    excerpt,
    isDraft = false,
  } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ error: 'Title, category, and article content are required.' });
  }

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

  const autoExcerpt = excerpt || content.replace(/#|\*|`/g, '').slice(0, 160) + '...';
  const status = isDraft ? 'DRAFT' : 'PENDING_REVIEW';

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        category,
        destinationCountry,
        institutionName,
        content,
        excerpt: autoExcerpt,
        authorId: user.id,
        status,
        publishedAt: null,
      },
    });

    return res.status(201).json({
      message: isDraft
        ? 'Draft saved successfully.'
        : 'Post submitted for editorial review. Once verified by an administrator, it will be published.',
      post,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Failed to create post.' });
  }
};

export const getMyPosts = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json({ posts });
  } catch (error) {
    console.error('Error fetching my posts:', error);
    return res.status(500).json({ error: 'Failed to fetch contributor posts.' });
  }
};

// ==================== ADMIN MODERATION ====================

export const getAdminContributorApplications = async (req: Request, res: Response) => {
  try {
    const applications = await prisma.contributorApplication.findMany({
      orderBy: { appliedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    return res.json({ applications });
  } catch (error) {
    console.error('Error fetching contributor applications:', error);
    return res.status(500).json({ error: 'Failed to fetch contributor applications.' });
  }
};

export const updateContributorApplicationStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminFeedback } = req.body;
  const adminUser = (req as any).user;

  if (!status || !['APPROVED', 'REJECTED', 'SUSPENDED'].includes(status)) {
    return res.status(400).json({ error: 'Valid status (APPROVED, REJECTED, SUSPENDED) is required.' });
  }

  try {
    const app = await prisma.contributorApplication.update({
      where: { id },
      data: {
        status,
        adminFeedback,
        reviewedAt: new Date(),
        reviewedBy: adminUser.id,
      },
      include: { user: true },
    });

    // If approved, elevate user role to CONTRIBUTOR
    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: app.userId },
        data: { role: 'CONTRIBUTOR' },
      });
    } else if (status === 'SUSPENDED') {
      await prisma.user.update({
        where: { id: app.userId },
        data: { role: 'STUDENT' },
      });
    }

    // Log admin audit action
    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        action: `CONTRIBUTOR_APPLICATION_${status}`,
        entityType: 'Contributor',
        entityId: app.userId,
        details: JSON.stringify({ applicant: app.user.email, adminFeedback }),
      },
    });

    return res.json({
      message: `Contributor application marked as ${status}.`,
      application: app,
    });
  } catch (error) {
    console.error('Error updating contributor status:', error);
    return res.status(500).json({ error: 'Failed to update contributor status.' });
  }
};

export const getAdminPostsQueue = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.json({ posts });
  } catch (error) {
    console.error('Error fetching admin posts queue:', error);
    return res.status(500).json({ error: 'Failed to fetch posts queue.' });
  }
};

export const reviewPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, moderatorNotes } = req.body;
  const adminUser = (req as any).user;

  if (!status || !['APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'ARCHIVED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid post review status.' });
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        status: status === 'CHANGES_REQUESTED' ? 'DRAFT' : status,
        moderatorNotes,
        publishedAt: status === 'APPROVED' ? new Date() : undefined,
      },
      include: { author: true },
    });

    await prisma.moderationReview.create({
      data: {
        postId: post.id,
        reviewerId: adminUser.id,
        status,
        reviewNotes: moderatorNotes,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        action: `POST_${status}`,
        entityType: 'Post',
        entityId: post.id,
        details: JSON.stringify({ postTitle: post.title, author: post.author.email }),
      },
    });

    return res.json({
      message: `Post marked as ${status}.`,
      post,
    });
  } catch (error) {
    console.error('Error reviewing post:', error);
    return res.status(500).json({ error: 'Failed to update post status.' });
  }
};
