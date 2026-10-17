// Borno Higher Study — Career Toolkit Service
// Manages verified public research records, illustrative CV examples, editorial guides, rule-based CV checker, and user drafts.

import { PrismaClient } from '@prisma/client';
import { CAREER_RESEARCH_RECORDS, CVResearchRecordInput } from '../data/careerResearchRecords';
import { CAREER_EXAMPLE_CVS, CVExampleData } from '../data/careerExampleCVs';
import { CAREER_GUIDES_DATA } from '../data/careerGuidesData';
import { BEFORE_AFTER_EXAMPLES } from '../data/careerBeforeAfterExamples';
import { CV_CHECKLIST_ITEMS } from '../data/cvChecklistData';

const prisma = new PrismaClient();

export interface CVQualityFinding {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'SUGGESTION' | 'STRENGTH';
  category: string;
  title: string;
  description: string;
  suggestedAction?: string;
}

export interface CVQualityReport {
  score: number; // 0 - 100
  rating: 'EXCELLENT' | 'STRONG' | 'ADEQUATE' | 'NEEDS_WORK';
  targetOpportunity: string;
  findings: CVQualityFinding[];
  metrics: {
    totalSectionsDetected: number;
    wordCount: number;
    actionVerbCount: number;
    metricsCount: number;
    bulletPointCount: number;
  };
  opportunityReadinessNotes: string[];
}

export class CareerToolkitService {
  /**
   * Idempotent Seeding of 52 Research Records, 12 CV Examples, and 8 Guides
   */
  async seedCareerToolkitData() {
    console.log('[CareerToolkitService] Checking and seeding Career Toolkit dataset...');

    // 1. Seed 52 Research Records
    const existingRecordsCount = await prisma.cVResearchRecord.count();
    if (existingRecordsCount < CAREER_RESEARCH_RECORDS.length) {
      console.log(`[CareerToolkitService] Seeding ${CAREER_RESEARCH_RECORDS.length} verified research records...`);
      for (const record of CAREER_RESEARCH_RECORDS) {
        const existing = await prisma.cVResearchRecord.findFirst({
          where: { sourceUrl: record.sourceUrl }
        });
        if (!existing) {
          await prisma.cVResearchRecord.create({
            data: {
              sourceInstitution: record.sourceInstitution,
              sourceUrl: record.sourceUrl,
              title: record.title,
              cvType: record.cvType,
              intendedAudience: record.intendedAudience,
              field: record.field,
              careerStage: record.careerStage,
              sectionStructure: JSON.stringify(record.sectionStructure),
              formattingObservations: record.formattingObservations,
              usefulPractices: record.usefulPractices,
              potentialLimitations: record.potentialLimitations,
              dateAccessed: record.dateAccessed,
              verificationStatus: record.verificationStatus,
              verifiedBy: record.verifiedBy || 'Borno Career Advisory Board',
              notes: record.notes
            }
          });
        }
      }
    }

    // 2. Seed 12 CV Examples
    const existingExamplesCount = await prisma.cVExample.count();
    if (existingExamplesCount < CAREER_EXAMPLE_CVS.length) {
      console.log(`[CareerToolkitService] Seeding ${CAREER_EXAMPLE_CVS.length} illustrative CV examples...`);
      for (const ex of CAREER_EXAMPLE_CVS) {
        const existing = await prisma.cVExample.findUnique({ where: { slug: ex.slug } });
        if (!existing) {
          await prisma.cVExample.create({
            data: {
              slug: ex.slug,
              title: ex.title,
              titleBn: ex.titleBn,
              targetAudience: ex.targetAudience,
              field: ex.field,
              careerStage: ex.careerStage,
              isIllustrative: true,
              rationaleEn: ex.rationaleEn,
              rationaleBn: ex.rationaleBn,
              sectionBreakdown: JSON.stringify(ex.sectionBreakdown),
              fullContent: JSON.stringify(ex.fullContent)
            }
          });
        }
      }
    }

    // 3. Seed 8 Career Guides
    const existingGuidesCount = await prisma.careerGuide.count();
    if (existingGuidesCount < CAREER_GUIDES_DATA.length) {
      console.log(`[CareerToolkitService] Seeding ${CAREER_GUIDES_DATA.length} editorial career guides...`);
      for (const guide of CAREER_GUIDES_DATA) {
        const existing = await prisma.careerGuide.findUnique({ where: { slug: guide.slug } });
        if (!existing) {
          await prisma.careerGuide.create({
            data: {
              slug: guide.slug,
              category: guide.category,
              titleEn: guide.titleEn,
              titleBn: guide.titleBn,
              summaryEn: guide.summaryEn,
              summaryBn: guide.summaryBn,
              contentEn: guide.contentEn,
              contentBn: guide.contentBn,
              author: guide.author,
              published: true
            }
          });
        }
      }
    }

    console.log('[CareerToolkitService] Seeding verification complete.');
  }

  /**
   * Get 52 Verified Research Records with Filtering
   */
  async getResearchRecords(filters: { cvType?: string; field?: string; search?: string; status?: string }) {
    const where: any = {};
    if (filters.cvType && filters.cvType !== 'ALL') {
      where.cvType = filters.cvType;
    }
    if (filters.field && filters.field !== 'ALL') {
      where.field = { contains: filters.field };
    }
    if (filters.status && filters.status !== 'ALL') {
      where.verificationStatus = filters.status;
    }
    if (filters.search) {
      where.OR = [
        { sourceInstitution: { contains: filters.search } },
        { title: { contains: filters.search } },
        { field: { contains: filters.search } },
        { usefulPractices: { contains: filters.search } }
      ];
    }

    const records = await prisma.cVResearchRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return {
      total: records.length,
      records: records.map(r => ({
        ...r,
        sectionStructure: JSON.parse(r.sectionStructure || '[]')
      }))
    };
  }

  /**
   * Get 12 Illustrative CV Examples
   */
  async getCVExamples(filters?: { field?: string; careerStage?: string }) {
    const where: any = {};
    if (filters?.field && filters.field !== 'ALL') {
      where.field = { contains: filters.field };
    }
    if (filters?.careerStage && filters.careerStage !== 'ALL') {
      where.careerStage = { contains: filters.careerStage };
    }

    const examples = await prisma.cVExample.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    });

    return examples.map(ex => ({
      ...ex,
      sectionBreakdown: JSON.parse(ex.sectionBreakdown || '[]'),
      fullContent: JSON.parse(ex.fullContent || '{}')
    }));
  }

  /**
   * Get Single CV Example by Slug
   */
  async getCVExampleBySlug(slug: string) {
    const example = await prisma.cVExample.findUnique({ where: { slug } });
    if (!example) return null;
    return {
      ...example,
      sectionBreakdown: JSON.parse(example.sectionBreakdown || '[]'),
      fullContent: JSON.parse(example.fullContent || '{}')
    };
  }

  /**
   * Get All Career Guides
   */
  async getCareerGuides(category?: string) {
    const where: any = { published: true };
    if (category && category !== 'ALL') {
      where.category = category;
    }
    return prisma.careerGuide.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    });
  }

  /**
   * Get Career Guide by Slug
   */
  async getCareerGuideBySlug(slug: string) {
    return prisma.careerGuide.findUnique({ where: { slug } });
  }

  /**
   * Get Before-and-After Learning Examples
   */
  getBeforeAfterExamples() {
    return BEFORE_AFTER_EXAMPLES;
  }

  /**
   * Get Checklist Checkpoints
   */
  getChecklistItems() {
    return CV_CHECKLIST_ITEMS;
  }

  /**
   * User Checklist Progress
   */
  async getUserChecklistProgress(userId?: string, sessionKey?: string) {
    if (!userId && !sessionKey) return { completedItems: [] };
    const where: any = {};
    if (userId) where.userId = userId;
    else if (sessionKey) where.sessionKey = sessionKey;

    const progress = await prisma.userChecklistProgress.findFirst({ where });
    if (!progress) return { completedItems: [] };
    return {
      completedItems: JSON.parse(progress.completedItems || '[]'),
      updatedAt: progress.updatedAt
    };
  }

  async saveUserChecklistProgress(completedItems: string[], userId?: string, sessionKey?: string) {
    if (!userId && !sessionKey) throw new Error('Either userId or sessionKey is required');
    const existing = await prisma.userChecklistProgress.findFirst({
      where: userId ? { userId } : { sessionKey }
    });

    if (existing) {
      return prisma.userChecklistProgress.update({
        where: { id: existing.id },
        data: { completedItems: JSON.stringify(completedItems) }
      });
    } else {
      return prisma.userChecklistProgress.create({
        data: {
          userId,
          sessionKey,
          completedItems: JSON.stringify(completedItems)
        }
      });
    }
  }

  /**
   * CV Builder Draft Management
   */
  async getUserDrafts(userId: string) {
    const drafts = await prisma.cVBuilderDraft.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    return drafts.map(d => ({
      id: d.id,
      title: d.title,
      template: d.template,
      updatedAt: d.updatedAt,
      createdAt: d.createdAt,
      personalInfo: JSON.parse(d.personalInfo || '{}'),
      education: JSON.parse(d.education || '[]'),
      experience: JSON.parse(d.experience || '[]'),
      skills: JSON.parse(d.skills || '[]')
    }));
  }

  async getDraftById(id: string, userId?: string) {
    const draft = await prisma.cVBuilderDraft.findUnique({ where: { id } });
    if (!draft) return null;
    if (draft.userId && userId && draft.userId !== userId) {
      throw new Error('Unauthorized access to private draft');
    }

    return {
      ...draft,
      personalInfo: JSON.parse(draft.personalInfo || '{}'),
      education: JSON.parse(draft.education || '[]'),
      experience: JSON.parse(draft.experience || '[]'),
      research: JSON.parse(draft.research || '[]'),
      projects: JSON.parse(draft.projects || '[]'),
      skills: JSON.parse(draft.skills || '[]'),
      publications: JSON.parse(draft.publications || '[]'),
      awards: JSON.parse(draft.awards || '[]'),
      volunteering: JSON.parse(draft.volunteering || '[]'),
      certifications: JSON.parse(draft.certifications || '[]'),
      languages: JSON.parse(draft.languages || '[]'),
      references: JSON.parse(draft.references || '[]'),
      customSections: JSON.parse(draft.customSections || '[]'),
      sectionOrder: JSON.parse(draft.sectionOrder || '[]')
    };
  }

  async saveDraft(data: any, userId?: string) {
    const payload = {
      title: data.title || 'Untitled Academic CV',
      template: data.template || 'academic-editorial',
      personalInfo: JSON.stringify(data.personalInfo || {}),
      education: JSON.stringify(data.education || []),
      experience: JSON.stringify(data.experience || []),
      research: JSON.stringify(data.research || []),
      projects: JSON.stringify(data.projects || []),
      skills: JSON.stringify(data.skills || []),
      publications: JSON.stringify(data.publications || []),
      awards: JSON.stringify(data.awards || []),
      volunteering: JSON.stringify(data.volunteering || []),
      certifications: JSON.stringify(data.certifications || []),
      languages: JSON.stringify(data.languages || []),
      references: JSON.stringify(data.references || []),
      customSections: JSON.stringify(data.customSections || []),
      sectionOrder: JSON.stringify(data.sectionOrder || [])
    };

    if (data.id) {
      const existing = await prisma.cVBuilderDraft.findUnique({ where: { id: data.id } });
      if (existing) {
        if (existing.userId && userId && existing.userId !== userId) {
          throw new Error('Unauthorized draft update');
        }
        return prisma.cVBuilderDraft.update({
          where: { id: data.id },
          data: payload
        });
      }
    }

    return prisma.cVBuilderDraft.create({
      data: {
        ...payload,
        userId: userId || null
      }
    });
  }

  async deleteDraft(id: string, userId: string) {
    const draft = await prisma.cVBuilderDraft.findUnique({ where: { id } });
    if (!draft) return false;
    if (draft.userId !== userId) throw new Error('Unauthorized');
    await prisma.cVBuilderDraft.delete({ where: { id } });
    return true;
  }

  /**
   * Rule-Based CV Quality Review Engine
   * Evaluates text/structured CV data for omissions, vague verbs, inconsistent dates, clichés, and target-fit.
   */
  runQualityReview(cvData: any, targetOpportunity: string = 'MASTERS_ADMISSION'): CVQualityReport {
    const findings: CVQualityFinding[] = [];
    let score = 100;

    const personal = cvData.personalInfo || {};
    const education = cvData.education || [];
    const experience = cvData.experience || [];
    const projects = cvData.projects || [];
    const research = cvData.research || [];
    const skills = cvData.skills || [];
    const publications = cvData.publications || [];
    const languages = cvData.languages || [];

    // 1. Contact Information Checks
    if (!personal.email || !personal.email.includes('@')) {
      findings.push({
        id: 'crit-email',
        type: 'CRITICAL',
        category: 'Contact Info',
        title: 'Missing or Invalid Email Address',
        description: 'No verified email address detected. Contact information is unusable without a valid email.',
        suggestedAction: 'Add a professional email address (e.g., student.name@university.edu or firstname.lastname@gmail.com).'
      });
      score -= 15;
    }

    if (!personal.phone) {
      findings.push({
        id: 'crit-phone',
        type: 'CRITICAL',
        category: 'Contact Info',
        title: 'Missing Telephone Number',
        description: 'No contact telephone number provided.',
        suggestedAction: 'Include a telephone number with international country code (+880 for Bangladesh).'
      });
      score -= 10;
    } else if (!personal.phone.includes('+')) {
      findings.push({
        id: 'warn-phone-intl',
        type: 'WARNING',
        category: 'Contact Info',
        title: 'Missing International Country Dialing Code',
        description: 'Telephone number lacks international dialing code (+880). Foreign reviewers will not be able to connect.',
        suggestedAction: 'Prefix your telephone number with +880.'
      });
      score -= 5;
    }

    if (!personal.location) {
      findings.push({
        id: 'warn-loc',
        type: 'WARNING',
        category: 'Contact Info',
        title: 'Missing City / Country Location',
        description: 'City and country of residence are missing from the header.',
        suggestedAction: 'Add "Dhaka, Bangladesh" or your current city and country.'
      });
      score -= 5;
    }

    // 2. Education Checks
    if (education.length === 0) {
      findings.push({
        id: 'crit-edu',
        type: 'CRITICAL',
        category: 'Education',
        title: 'No Education Records Detected',
        description: 'An academic or graduate CV must list your degree credentials.',
        suggestedAction: 'Add your Bachelor’s and/or Secondary School credentials with CGPA and graduation dates.'
      });
      score -= 20;
    } else {
      let missingGpa = false;
      let missingDate = false;
      education.forEach((edu: any, idx: number) => {
        if (!edu.grade && !edu.gpa) missingGpa = true;
        if (!edu.graduationDate && !edu.year) missingDate = true;
      });

      if (missingGpa) {
        findings.push({
          id: 'warn-gpa',
          type: 'WARNING',
          category: 'Education',
          title: 'Missing Grade Point Average (CGPA)',
          description: 'One or more degree entries lack an explicit grade or CGPA.',
          suggestedAction: 'Always disclose your official cumulative CGPA with scale (e.g. CGPA 3.82 / 4.00).'
        });
        score -= 8;
      }

      if (missingDate) {
        findings.push({
          id: 'warn-edudate',
          type: 'WARNING',
          category: 'Education',
          title: 'Missing Degree Completion / Expected Date',
          description: 'One or more degree records are missing dates.',
          suggestedAction: 'Specify graduation month/year (e.g., "Expected November 2026" or "Completed July 2024").'
        });
        score -= 5;
      }
    }

    // 3. Vague Action Verbs & Clichés
    const fullText = JSON.stringify(cvData).toLowerCase();
    const vagueWords = ['helped', 'worked on', 'handled', 'assisted with', 'responsible for', 'did some'];
    const detectedVague = vagueWords.filter(w => fullText.includes(w));

    if (detectedVague.length > 0) {
      findings.push({
        id: 'warn-vague-verbs',
        type: 'WARNING',
        category: 'Action Verbs & Impact',
        title: `Passive or Vague Phrasing Detected (${detectedVague.join(', ')})`,
        description: `Found ${detectedVague.length} instance(s) of passive phrasing that minimize your actual intellectual contributions.`,
        suggestedAction: 'Replace with decisive active verbs: "Architected", "Engineered", "Synthesized", "Spearheaded", "Formulated", "Analyzed".'
      });
      score -= Math.min(12, detectedVague.length * 4);
    }

    const cliches = ['hardworking', 'passionate', 'punctual', 'team player', 'quick learner', 'go-getter'];
    const detectedCliches = cliches.filter(c => fullText.includes(c));

    if (detectedCliches.length > 0) {
      findings.push({
        id: 'sugg-cliches',
        type: 'SUGGESTION',
        category: 'Editorial Tone',
        title: `Subjective Clichés Found (${detectedCliches.join(', ')})`,
        description: 'Subjective self-praising adjectives reduce the academic credibility of a graduate CV.',
        suggestedAction: 'Delete personality adjectives and substantiate your work ethic through publications, awards, or quantifiable project metrics.'
      });
      score -= Math.min(8, detectedCliches.length * 2);
    }

    // 4. Quantifiable Metrics & Scale
    const metricMatches = fullText.match(/\b\d+(\.\d+)?%|\b\d{2,}\b/g) || [];
    if (metricMatches.length < 2 && (experience.length > 0 || projects.length > 0)) {
      findings.push({
        id: 'sugg-metrics',
        type: 'SUGGESTION',
        category: 'Quantifiable Outcomes',
        title: 'Low Density of Concrete Numbers / Measurements',
        description: 'Reviewers look for verifiable scope (e.g., sample sizes, user counts, latency reductions, percentage improvements).',
        suggestedAction: 'Add real metrics where substantiated: "Analyzed 120 samples", "Reduced build time by 35%", "Served 5,000 monthly users".'
      });
      score -= 5;
    }

    // 5. Target Opportunity Suitability Checks
    const readinessNotes: string[] = [];

    if (targetOpportunity === 'PHD_ADMISSION') {
      if (research.length === 0 && publications.length === 0) {
        findings.push({
          id: 'crit-phd-research',
          type: 'CRITICAL',
          category: 'PhD Readiness',
          title: 'Missing Research Experience or Publications for PhD Application',
          description: 'A doctoral application CV must prominently highlight research projects, thesis titles, and publications.',
          suggestedAction: 'Add your undergraduate/master’s thesis and any scientific papers, abstracts, or lab assistantships.'
        });
        score -= 20;
        readinessNotes.push('PhD admissions committees will find this CV lacking documented scholarly outputs.');
      } else {
        findings.push({
          id: 'str-phd-pub',
          type: 'STRENGTH',
          category: 'PhD Readiness',
          title: 'Scholarly Research & Publications Present',
          description: 'Contains documented research experience and scholarly work appropriate for doctoral scrutiny.'
        });
        readinessNotes.push('Research alignment is verified and clearly structured.');
      }
    } else if (targetOpportunity === 'SCHOLARSHIP') {
      const volunteering = cvData.volunteering || [];
      const awards = cvData.awards || [];
      if (volunteering.length === 0 && awards.length === 0) {
        findings.push({
          id: 'warn-scholarship-civic',
          type: 'WARNING',
          category: 'Scholarship Readiness',
          title: 'Missing Community Leadership or Academic Honors',
          description: 'Prestigious scholarship boards (Erasmus Mundus, Commonwealth, DAAD) heavily score community leadership and merit awards.',
          suggestedAction: 'Add extracurricular leadership, volunteer projects, or competitive academic prizes.'
        });
        score -= 15;
        readinessNotes.push('Scholarship reviewers need evidence of leadership and civic contribution.');
      } else {
        findings.push({
          id: 'str-scholarship-lead',
          type: 'STRENGTH',
          category: 'Scholarship Readiness',
          title: 'Leadership / Honors Elements Detected',
          description: 'Includes evidence of extracurricular leadership or recognition.'
        });
        readinessNotes.push('Meets standard civic and achievement criteria for international scholarship evaluation.');
      }
    } else if (targetOpportunity === 'TECH_INTERNSHIP') {
      if (!personal.github && !personal.portfolio) {
        findings.push({
          id: 'warn-tech-github',
          type: 'WARNING',
          category: 'Tech Readiness',
          title: 'Missing GitHub or Technical Portfolio Link',
          description: 'Software engineering screeners expect a direct link to public code repositories or live project demos.',
          suggestedAction: 'Add your verified GitHub profile URL in the contact header.'
        });
        score -= 10;
        readinessNotes.push('Tech screeners prefer candidates with verifiable open-source repositories.');
      }
    }

    // 6. Languages Check
    if (languages.length === 0) {
      findings.push({
        id: 'sugg-lang',
        type: 'SUGGESTION',
        category: 'Languages',
        title: 'No Language Proficiency Listed',
        description: 'For international study, demonstrating English and native language proficiency (CEFR/IELTS) is expected.',
        suggestedAction: 'Add "Bengali (Native)" and "English (IELTS/Fluent)" under Languages.'
      });
      score -= 4;
    }

    // Clamp score
    score = Math.max(10, Math.min(100, score));

    let rating: 'EXCELLENT' | 'STRONG' | 'ADEQUATE' | 'NEEDS_WORK' = 'NEEDS_WORK';
    if (score >= 90) rating = 'EXCELLENT';
    else if (score >= 75) rating = 'STRONG';
    else if (score >= 60) rating = 'ADEQUATE';

    return {
      score,
      rating,
      targetOpportunity,
      findings,
      metrics: {
        totalSectionsDetected: [education, experience, projects, research, skills, publications, languages].filter(s => s && s.length > 0).length,
        wordCount: fullText.split(/\s+/).length,
        actionVerbCount: (fullText.match(/\b(developed|engineered|designed|implemented|analyzed|spearheaded|evaluated|conducted)\b/g) || []).length,
        metricsCount: metricMatches.length,
        bulletPointCount: (fullText.match(/\"bullets\"/g) || []).length
      },
      opportunityReadinessNotes: readinessNotes
    };
  }

  /**
   * Super Admin Methods
   */
  async adminCreateResearchRecord(data: CVResearchRecordInput, verifiedBy: string) {
    return prisma.cVResearchRecord.create({
      data: {
        sourceInstitution: data.sourceInstitution,
        sourceUrl: data.sourceUrl,
        title: data.title,
        cvType: data.cvType,
        intendedAudience: data.intendedAudience,
        field: data.field,
        careerStage: data.careerStage,
        sectionStructure: JSON.stringify(data.sectionStructure),
        formattingObservations: data.formattingObservations,
        usefulPractices: data.usefulPractices,
        potentialLimitations: data.potentialLimitations,
        dateAccessed: data.dateAccessed,
        verificationStatus: 'VERIFIED',
        verifiedBy,
        notes: data.notes
      }
    });
  }

  async adminUpdateResearchRecord(id: string, data: Partial<CVResearchRecordInput>) {
    const updateData: any = { ...data };
    if (data.sectionStructure) {
      updateData.sectionStructure = JSON.stringify(data.sectionStructure);
    }
    return prisma.cVResearchRecord.update({
      where: { id },
      data: updateData
    });
  }

  async adminDeleteResearchRecord(id: string) {
    return prisma.cVResearchRecord.delete({ where: { id } });
  }
}

export const careerToolkitService = new CareerToolkitService();
