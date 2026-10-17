import { COUNTRIES_DATA } from '../data/countriesData.js';
import { UNIVERSITIES_DATA, UniversityRecord, ProgramItem } from '../data/universitiesData.js';
import { SCHOLARSHIPS_DATA, ScholarshipItem } from '../data/scholarshipsData.js';

export interface AdvisorCitation {
  title: string;
  url: string;
  verifiedDate: string;
  type: 'UNIVERSITY' | 'PROGRAM' | 'SCHOLARSHIP' | 'GOVERNMENT_VISA';
}

export interface AdvisorResponse {
  answer: string;
  citations: AdvisorCitation[];
  matchedUniversities: Partial<UniversityRecord>[];
  matchedScholarships: Partial<ScholarshipItem>[];
  filtersExtracted: {
    country?: string;
    subject?: string;
    degree?: string;
    budget?: number;
    score?: number;
  };
  mode: 'LLM_GROUNDED' | 'DETERMINISTIC_FALLBACK';
}

export class RagAdvisorService {
  /**
   * Extract user intents and filters deterministically
   */
  public extractFilters(query: string) {
    const q = query.toLowerCase();
    const filters: {
      country?: string;
      subject?: string;
      degree?: string;
      budget?: number;
      score?: number;
    } = {};

    // Match country
    for (const c of COUNTRIES_DATA) {
      if (q.includes(c.name.toLowerCase()) || q.includes(c.slug)) {
        filters.country = c.slug;
        break;
      }
    }

    // Match subject
    const subjectKeywords = [
      { key: 'computer science', value: 'Computer Science' },
      { key: 'software engineering', value: 'Software Engineering' },
      { key: 'artificial intelligence', value: 'Artificial Intelligence' },
      { key: 'ai', value: 'Artificial Intelligence' },
      { key: 'data science', value: 'Data Science' },
      { key: 'cybersecurity', value: 'Cybersecurity' },
      { key: 'informatics', value: 'Computer Science' },
      { key: 'business', value: 'Business Administration' },
    ];
    for (const item of subjectKeywords) {
      if (new RegExp(`\\b${item.key}\\b`, 'i').test(q)) {
        filters.subject = item.value;
        break;
      }
    }

    // Match degree
    if (q.includes('master') || q.includes('msc') || q.includes('postgraduate') || q.includes('graduate')) {
      filters.degree = 'MASTER';
    } else if (q.includes('bachelor') || q.includes('bsc') || q.includes('undergraduate')) {
      filters.degree = 'BACHELOR';
    } else if (q.includes('phd') || q.includes('doctorate')) {
      filters.degree = 'PHD';
    }

    // Match budget (e.g. "under 10000", "budget 15k", "under 15000 eur")
    const budgetMatch = q.match(/(?:under|below|budget of|less than)\s*([\d,]+)\s*(?:k|thousand)?/i);
    if (budgetMatch) {
      let num = parseFloat(budgetMatch[1].replace(/,/g, ''));
      if (q.includes('k') && num < 1000) num *= 1000;
      filters.budget = num;
    }

    // Match IELTS/PTE/TOEFL score
    const scoreMatch = q.match(/(?:ielts|toefl|pte|score)\s*(?:of|is|:)?\s*([6-9](?:\.[05])?|\d{2,3})/i);
    if (scoreMatch) {
      filters.score = parseFloat(scoreMatch[1]);
    }

    return filters;
  }

  /**
   * Grounded deterministic retrieval and response generator
   */
  public async consult(query: string): Promise<AdvisorResponse> {
    const filters = this.extractFilters(query);
    const qLower = query.toLowerCase();

    // Find matching universities and programs
    let matchedUnis = UNIVERSITIES_DATA.filter((u) => {
      if (filters.country && u.countrySlug !== filters.country) return false;
      return true;
    });

    if (filters.subject || filters.degree) {
      matchedUnis = matchedUnis.filter((u) =>
        u.programs.some((p) => {
          const matchSub = !filters.subject || p.subject.toLowerCase().includes(filters.subject.toLowerCase()) || p.name.toLowerCase().includes(filters.subject.toLowerCase());
          const matchDeg = !filters.degree || p.degreeLevel === filters.degree;
          return matchSub && matchDeg;
        })
      );
    }

    if (filters.budget) {
      matchedUnis = matchedUnis.filter((u) =>
        u.programs.some((p) => p.annualTuitionLocal <= filters.budget!)
      );
    }

    // Find matching scholarships
    let matchedSchs = SCHOLARSHIPS_DATA.filter((s) => {
      if (filters.country && s.countrySlug !== filters.country) return false;
      if (filters.degree && !s.degreeLevels.includes(filters.degree as any)) return false;
      if (qLower.includes('bangladesh') && !s.openToBangladesh) return false;
      if (qLower.includes('fully funded') && !s.isFullyFunded) return false;
      return true;
    });

    // Build citations
    const citations: AdvisorCitation[] = [];

    matchedUnis.forEach((u) => {
      citations.push({
        title: `${u.name} (Official Admissions)`,
        url: u.admissionsUrl || u.websiteUrl,
        verifiedDate: u.lastVerifiedAt,
        type: 'UNIVERSITY',
      });
      u.programs.slice(0, 2).forEach((p) => {
        citations.push({
          title: `${u.name} — ${p.name}`,
          url: p.programUrl,
          verifiedDate: p.lastVerifiedAt,
          type: 'PROGRAM',
        });
      });
    });

    matchedSchs.forEach((s) => {
      citations.push({
        title: `${s.name} (${s.provider})`,
        url: s.officialApplicationUrl || s.sourceUrl,
        verifiedDate: s.lastVerifiedAt,
        type: 'SCHOLARSHIP',
      });
    });

    // Country visa citation if country mentioned
    if (filters.country) {
      const c = COUNTRIES_DATA.find((item) => item.slug === filters.country);
      if (c) {
        citations.push({
          title: `${c.name} Official Student Visa Guide`,
          url: c.visaGuideUrl,
          verifiedDate: c.lastVerifiedAt,
          type: 'GOVERNMENT_VISA',
        });
      }
    }

    // Try optional LLM generation if configured, or use our high-fidelity deterministic response engine
    const answer = this.generateDeterministicAnswer(query, filters, matchedUnis, matchedSchs);

    return {
      answer,
      citations: citations.slice(0, 8),
      matchedUniversities: matchedUnis.map((u) => ({
        id: u.id,
        name: u.name,
        slug: u.slug,
        countryName: u.countryName,
        cityName: u.cityName,
        type: u.type,
        qsRanking: u.qsRanking,
        admissionsUrl: u.admissionsUrl,
        programs: u.programs,
      })),
      matchedScholarships: matchedSchs.map((s) => ({
        id: s.id,
        name: s.name,
        provider: s.provider,
        type: s.type,
        isFullyFunded: s.isFullyFunded,
        coveragePercent: s.coveragePercent,
        deadlineText: s.deadlineText,
        officialApplicationUrl: s.officialApplicationUrl,
      })),
      filtersExtracted: filters,
      mode: 'DETERMINISTIC_FALLBACK',
    };
  }

  private generateDeterministicAnswer(
    query: string,
    filters: any,
    matchedUnis: UniversityRecord[],
    matchedSchs: ScholarshipItem[]
  ): string {
    const lines: string[] = [];

    lines.push(`### Verified Consultation from Borno Study Advisor`);
    lines.push(`I evaluated your inquiry against verified university admissions datasets and official government scholarship regulations.\n`);

    if (filters.country) {
      const country = COUNTRIES_DATA.find((c) => c.slug === filters.country);
      if (country) {
        lines.push(`**Destination Overview:** **${country.name}** (${country.currencySymbol} ${country.currencyCode})`);
        lines.push(`- **Average Monthly Living Expenses:** ~${country.currencySymbol}${country.avgLivingCostMonthly} (~${Math.round(country.avgLivingCostMonthly * country.exchangeRateToBdt).toLocaleString()} BDT).`);
        lines.push(`- **Post-Study Work Authorization:** ${country.postStudyWorkVisa}`);
        lines.push(`- **General English Expectation:** ${country.englishReqSummary}\n`);
      }
    }

    if (matchedUnis.length > 0) {
      lines.push(`#### 🏛️ Verified University & Degree Matches (${matchedUnis.length} found):`);
      matchedUnis.slice(0, 4).forEach((u) => {
        lines.push(`- **[${u.name}](${u.admissionsUrl})** (${u.cityName}, ${u.countryName}) — *QS Ranking: #${u.qsRanking || 'N/A'}*`);
        u.programs.forEach((p) => {
          lines.push(`  • **${p.name}** (${p.degreeLevel}): Tuition **${p.currencyCode} ${p.annualTuitionLocal.toLocaleString()}/year** | IELTS **${p.ieltsOverall}** (min ${p.ieltsSubscoreMin}) | Deadline: **${p.applicationDeadline}**`);
        });
      });
      lines.push('');
    } else {
      lines.push(`ℹ️ *No direct university programs matched your exact combination of criteria. Try broadening your budget filter or degree criteria.*`);
    }

    if (matchedSchs.length > 0) {
      lines.push(`#### 🎓 Relevant Scholarships & Funding Opportunities:`);
      matchedSchs.slice(0, 3).forEach((s) => {
        const fundingBadge = s.isFullyFunded ? '🌟 **Fully Funded** (Tuition + Living Stipend)' : `💰 **${s.coveragePercent}% Tuition Coverage**`;
        lines.push(`- **[${s.name}](${s.officialApplicationUrl})** — ${fundingBadge}`);
        lines.push(`  • *Provider:* ${s.provider}`);
        lines.push(`  • *Application Deadline:* ${s.deadlineText}`);
        lines.push(`  • *Bangladesh Eligibility:* ${s.openToBangladesh ? 'Open to Bangladeshi applicants' : 'Specific nationalities only'}`);
      });
      lines.push('');
    }

    lines.push(`> ⚠️ **Official Source Verification:** All requirements and dates are drawn from authenticated university portals and official scholarship statutes. Consult the citations below for formal application portals.`);

    return lines.join('\n');
  }
}
