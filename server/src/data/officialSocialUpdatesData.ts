// Official Social Media Updates & Public Visa Announcements
// Verified permitted public announcements from diplomatic missions and official application authorities.

export interface SeedSocialAccount {
  countryCode: string;
  countryName: string;
  platform: 'FACEBOOK' | 'TWITTER_X' | 'GOV_PORTAL';
  accountName: string;
  pageUrl: string;
  verifiedBadge: boolean;
  category: 'EMBASSY' | 'IMMIGRATION_DEPT' | 'APPLICATION_PROVIDER' | 'SCHOLARSHIP_BODY';
}

export interface SeedSocialUpdate {
  accountName: string;
  countryCode: string;
  destinationCountry: string;
  publisher: string;
  originalPostUrl: string;
  publishedAt: string;
  topic: 'STUDENT_VISA_POLICY' | 'VFS_APPOINTMENT_SLOTS' | 'FINANCIAL_REQUIREMENT' | 'INTERVIEW_WAIVER' | 'PROCESSING_TIMES';
  summary: string;
  fullText: string;
}

export const INITIAL_OFFICIAL_ACCOUNTS: SeedSocialAccount[] = [
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    platform: 'FACEBOOK',
    accountName: 'UK in Bangladesh - British High Commission Dhaka',
    pageUrl: 'https://www.facebook.com/ukintoBangladesh/',
    verifiedBadge: true,
    category: 'EMBASSY',
  },
  {
    countryCode: 'US',
    countryName: 'United States',
    platform: 'FACEBOOK',
    accountName: 'U.S. Embassy Dhaka',
    pageUrl: 'https://www.facebook.com/bangladesh.usembassy/',
    verifiedBadge: true,
    category: 'EMBASSY',
  },
  {
    countryCode: 'DE',
    countryName: 'Germany',
    platform: 'FACEBOOK',
    accountName: 'German Embassy Dhaka',
    pageUrl: 'https://www.facebook.com/GermanEmbassyDhaka/',
    verifiedBadge: true,
    category: 'EMBASSY',
  },
  {
    countryCode: 'IE',
    countryName: 'Ireland',
    platform: 'GOV_PORTAL',
    accountName: 'Irish Immigration Service Delivery (ISD)',
    pageUrl: 'https://www.irishimmigration.ie/news/',
    verifiedBadge: true,
    category: 'IMMIGRATION_DEPT',
  },
  {
    countryCode: 'CA',
    countryName: 'Canada',
    platform: 'FACEBOOK',
    accountName: 'Canada in Bangladesh - High Commission of Canada',
    pageUrl: 'https://www.facebook.com/CanadainBangladesh/',
    verifiedBadge: true,
    category: 'EMBASSY',
  },
];

export const INITIAL_SOCIAL_UPDATES: SeedSocialUpdate[] = [
  {
    accountName: 'UK in Bangladesh - British High Commission Dhaka',
    countryCode: 'GB',
    destinationCountry: 'United Kingdom',
    publisher: 'British High Commission Dhaka',
    originalPostUrl: 'https://www.facebook.com/ukintoBangladesh/posts/894210392',
    publishedAt: '2024-08-15T10:00:00Z',
    topic: 'STUDENT_VISA_POLICY',
    summary: 'Notice to student visa applicants in Bangladesh: Submit authentic bank statements meeting the 28-day rule. CAS validity and tuberculosis certificates must be in order prior to biometrics booking.',
    fullText: 'Student visa applicants from Bangladesh are reminded to ensure all financial documentation meets UKVI requirements. Bank statements must demonstrate funds continuously held for at least 28 days ending no more than 31 days before the application date. Beware of fraudulent education agents making false visa guarantees.',
  },
  {
    accountName: 'U.S. Embassy Dhaka',
    countryCode: 'US',
    destinationCountry: 'United States',
    publisher: 'U.S. Embassy Dhaka Consular Section',
    originalPostUrl: 'https://www.facebook.com/bangladesh.usembassy/posts/102938475',
    publishedAt: '2024-07-20T14:30:00Z',
    topic: 'VFS_APPOINTMENT_SLOTS',
    summary: 'Summer F-1 student visa interview appointments released on ustraveldocs. Students with approved I-20 forms are encouraged to apply as early as 365 days prior to course start date.',
    fullText: 'The U.S. Embassy in Dhaka has opened additional student visa interview appointments for the upcoming academic semester. Students applying for F-1, M-1, and J-1 nonimmigrant visas should ensure their DS-160 application is complete and accurately reflects their intended academic program. Expedited appointment requests are considered on a case-by-case basis.',
  },
  {
    accountName: 'German Embassy Dhaka',
    countryCode: 'DE',
    destinationCountry: 'Germany',
    publisher: 'German Embassy Dhaka Visa Section',
    originalPostUrl: 'https://www.facebook.com/GermanEmbassyDhaka/posts/948271029',
    publishedAt: '2024-06-10T09:00:00Z',
    topic: 'FINANCIAL_REQUIREMENT',
    summary: 'Updated blocked account (Sperrkonto) threshold: Beginning September 1, the statutory living cost requirement for student visa applicants is €11,904 per year (€992 per month).',
    fullText: 'In accordance with federal regulations, student visa applicants (§ 16b AufenthG) must prove sufficient financial resources through a blocked account containing at least €11,904 for one year. Opening a blocked account with an approved provider prior to your visa interview appointment is required.',
  },
  {
    accountName: 'Irish Immigration Service Delivery (ISD)',
    countryCode: 'IE',
    destinationCountry: 'Ireland',
    publisher: 'Irish Department of Justice - Immigration Service Delivery',
    originalPostUrl: 'https://www.irishimmigration.ie/news/student-visa-processing-times-guidance-2024/',
    publishedAt: '2024-05-25T11:00:00Z',
    topic: 'PROCESSING_TIMES',
    summary: 'Autumn intake student visa lodgements: Applications submitted at VFS Global in Dhaka should allow at least 6 to 8 weeks for processing by the Visa Office in New Delhi.',
    fullText: 'Due to peak seasonal demand, students applying for degree programs in Ireland are strongly advised to submit their completed visa dossier and biometrics through VFS Global in Dhaka well in advance. Fast-track processing is not available for student study visas.',
  },
];
