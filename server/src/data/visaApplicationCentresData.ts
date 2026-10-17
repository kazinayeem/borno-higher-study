// Bangladesh-Specific Visa Application Centre & India-Travel Arrangements
// Verified against official Embassy portals, VFS Global Bangladesh, and diplomatic missions.

export interface SeedVisaApplicationCentre {
  countryCode: string;
  countryName: string;
  embassyHandling: string;
  centreName: string;
  providerName: 'VFS_GLOBAL' | 'TLS_CONTACT' | 'EMBASSY_DIRECT' | 'BLS_INTERNATIONAL';
  city: string;
  country: string;
  address: string;
  submissionInBangladesh: boolean;
  indiaTravelRequirement: 'NO' | 'YES' | 'POSSIBLY' | 'UNKNOWN';
  indiaTravelReason?: string;
  appointmentRequired: boolean;
  biometricsRequired: boolean;
  interviewRequired: 'MANDATORY' | 'CONDITIONAL' | 'RARE' | 'NO';
  inPersonPassportSubmission: boolean;
  passportReturnAvailableInBd: boolean;
  alternateRouteNotice?: string;
  officialBookingUrl: string;
  requirements: { title: string; description: string; isMandatory: boolean }[];
}

export const INITIAL_VISA_CENTRES: SeedVisaApplicationCentre[] = [
  // 1. UNITED KINGDOM (VFS Global Dhaka & Sylhet)
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    embassyHandling: 'British High Commission Dhaka / UKVI',
    centreName: 'VFS Global UK Visa Application Centre (Dhaka)',
    providerName: 'VFS_GLOBAL',
    city: 'Dhaka',
    country: 'Bangladesh',
    address: 'Delta Life Tower (4th & 5th Floor), Plot 37, Road 90, Gulshan-2, Dhaka 1212',
    submissionInBangladesh: true,
    indiaTravelRequirement: 'NO',
    indiaTravelReason: 'Full operational Visa Application Centre (VAC) operates in Dhaka and Sylhet. No travel to India is required for any stage of UK Student Route processing.',
    appointmentRequired: true,
    biometricsRequired: true,
    interviewRequired: 'CONDITIONAL',
    inPersonPassportSubmission: true,
    passportReturnAvailableInBd: true,
    alternateRouteNotice: 'Secondary UK VAC also operates at 7th Floor, Nirvana Inn, Mirza Jungle Road, Ramer Dighir Par, Sylhet for biometric collection.',
    officialBookingUrl: 'https://visa.vfsglobal.com/bgd/en/gbr',
    requirements: [
      {
        title: 'Confirmation of Acceptance for Studies (CAS)',
        description: 'Valid CAS reference issued by an approved UK Student Sponsor university.',
        isMandatory: true,
      },
      {
        title: 'Biometrics & Passport Submission',
        description: 'Fingerprint scans and digital facial photograph taken in person at VFS Dhaka or Sylhet.',
        isMandatory: true,
      },
      {
        title: 'Financial Maintenance Proof',
        description: '28-day continuous funds covering tuition balance + 9 months living costs held in recognized bank.',
        isMandatory: true,
      },
    ],
  },

  // 2. UNITED STATES (U.S. Embassy Dhaka)
  {
    countryCode: 'US',
    countryName: 'United States',
    embassyHandling: 'Embassy of the United States of America, Dhaka',
    centreName: 'U.S. Embassy Consular Section (Dhaka)',
    providerName: 'EMBASSY_DIRECT',
    city: 'Dhaka',
    country: 'Bangladesh',
    address: 'Madani Avenue, Baridhara, Dhaka 1212, Bangladesh',
    submissionInBangladesh: true,
    indiaTravelRequirement: 'NO',
    indiaTravelReason: 'All nonimmigrant F-1 visa interviews, biometric profiling, and passport adjudication take place directly at the U.S. Embassy in Dhaka.',
    appointmentRequired: true,
    biometricsRequired: true,
    interviewRequired: 'MANDATORY',
    inPersonPassportSubmission: true,
    passportReturnAvailableInBd: true,
    alternateRouteNotice: 'Passport return arranged via designated courier pickup locations (e.g. S.A. Paribahan / U.S. Embassy partner depot in Dhaka).',
    officialBookingUrl: 'https://www.ustraveldocs.com/bd/',
    requirements: [
      {
        title: 'Form I-20 & SEVIS I-901 Fee Receipt',
        description: 'Valid signed I-20 from SEVP-certified institution and proof of SEVIS fee payment.',
        isMandatory: true,
      },
      {
        title: 'Form DS-160 Confirmation',
        description: 'Completed online nonimmigrant visa application confirmation barcode page.',
        isMandatory: true,
      },
      {
        title: 'In-Person Consular Interview',
        description: 'Mandatory verbal interview with a U.S. consular officer in Dhaka.',
        isMandatory: true,
      },
    ],
  },

  // 3. CANADA (VFS Global Canada)
  {
    countryCode: 'CA',
    countryName: 'Canada',
    embassyHandling: 'High Commission of Canada in Bangladesh / IRCC',
    centreName: 'Canada Visa Application Centre (CVAC - Dhaka)',
    providerName: 'VFS_GLOBAL',
    city: 'Dhaka',
    country: 'Bangladesh',
    address: 'Delta Life Tower (4th Floor), Plot 37, Road 90, Gulshan-2, Dhaka 1212',
    submissionInBangladesh: true,
    indiaTravelRequirement: 'NO',
    indiaTravelReason: 'Application submitted online via IRCC portal. Biometrics instruction letter (BIL) fulfilled locally in Dhaka, Chittagong, or Sylhet VFS.',
    appointmentRequired: true,
    biometricsRequired: true,
    interviewRequired: 'RARE',
    inPersonPassportSubmission: true,
    passportReturnAvailableInBd: true,
    alternateRouteNotice: 'CVAC branches in Chittagong and Sylhet also provide biometric collection upon appointment.',
    officialBookingUrl: 'https://visa.vfsglobal.com/bgd/en/can',
    requirements: [
      {
        title: 'Official Letter of Acceptance (LOA) & PAL',
        description: 'Standard LOA from a designated learning institution (DLI) and Provincial Attestation Letter (where required).',
        isMandatory: true,
      },
      {
        title: 'Biometrics Submission in Bangladesh',
        description: '10-digit fingerprinting and digital photograph at VFS Global in Dhaka, Chittagong, or Sylhet.',
        isMandatory: true,
      },
      {
        title: 'Proof of Financial Support',
        description: 'Bank certificates, tax returns, and evidence of living expenses meeting IRCC guidelines.',
        isMandatory: true,
      },
    ],
  },

  // 4. GERMANY (German Embassy Dhaka)
  {
    countryCode: 'DE',
    countryName: 'Germany',
    embassyHandling: 'Embassy of the Federal Republic of Germany, Dhaka',
    centreName: 'German Embassy Visa Section (Dhaka)',
    providerName: 'EMBASSY_DIRECT',
    city: 'Dhaka',
    country: 'Bangladesh',
    address: '11 Madani Avenue, Baridhara, Dhaka 1212, Bangladesh',
    submissionInBangladesh: true,
    indiaTravelRequirement: 'NO',
    indiaTravelReason: 'Resident German mission in Dhaka processes all National Student Visas (§ 16b AufenthG). Applicants book appointment via the Embassy portal.',
    appointmentRequired: true,
    biometricsRequired: true,
    interviewRequired: 'MANDATORY',
    inPersonPassportSubmission: true,
    passportReturnAvailableInBd: true,
    alternateRouteNotice: 'VFS Global Germany appointment slot system manages queuing and appointment allocation for Embassy interviews.',
    officialBookingUrl: 'https://dhaka.diplo.de/bd-en/service/visa-einreise',
    requirements: [
      {
        title: 'Admission Letter / University Offer',
        description: 'Zulassungsbescheid or formal confirmation of application from a German university / uni-assist.',
        isMandatory: true,
      },
      {
        title: 'Sperrkonto (Blocked Account) Proof',
        description: 'Confirmed blocked account of at least €11,904/year (€992/month) with approved provider (Coracle, Expatrio, Fintiba).',
        isMandatory: true,
      },
      {
        title: 'In-Person Embassy Interview',
        description: 'Personal appearance at the Embassy in Baridhara, Dhaka.',
        isMandatory: true,
      },
    ],
  },

  // 5. IRELAND (VFS Global Ireland Dhaka)
  {
    countryCode: 'IE',
    countryName: 'Ireland',
    embassyHandling: 'Embassy of Ireland, New Delhi (Visa Office) / Irish ISD',
    centreName: 'VFS Global Ireland Visa Application Centre (Dhaka)',
    providerName: 'VFS_GLOBAL',
    city: 'Dhaka',
    country: 'Bangladesh',
    address: 'Borak Mehnur, 51/B Kemal Ataturk Avenue, Banani, Dhaka 1213',
    submissionInBangladesh: true,
    indiaTravelRequirement: 'NO',
    indiaTravelReason: 'Applicants submit online via AVATS and lodge physical documents & passports at VFS Global in Dhaka. Documents are securely dispatched to the Irish Visa Office in New Delhi without requiring applicant travel to India.',
    appointmentRequired: true,
    biometricsRequired: true,
    interviewRequired: 'CONDITIONAL',
    inPersonPassportSubmission: true,
    passportReturnAvailableInBd: true,
    alternateRouteNotice: 'Passport return and stamped visas are delivered back to VFS Dhaka for applicant collection.',
    officialBookingUrl: 'https://visa.vfsglobal.com/bgd/en/irl',
    requirements: [
      {
        title: 'AVATS Summary Sheet & Fee Receipt',
        description: 'Printed online AVATS application summary sheet signed by applicant.',
        isMandatory: true,
      },
      {
        title: 'Letter of Acceptance & Fee Receipt',
        description: 'Unconditional offer and proof of tuition fee transfer (minimum €6,000 or full first-year fee).',
        isMandatory: true,
      },
      {
        title: 'Evidence of Immediate Living Funds',
        description: 'Proof of €10,000 immediate access funds plus history of past 6 months financial backing.',
        isMandatory: true,
      },
    ],
  },

  // 6. LITHUANIA (Mandatory Travel to New Delhi, India)
  {
    countryCode: 'LT',
    countryName: 'Lithuania',
    embassyHandling: 'Embassy of the Republic of Lithuania in New Delhi, India',
    centreName: 'Embassy of Lithuania Consular Section (New Delhi)',
    providerName: 'EMBASSY_DIRECT',
    city: 'New Delhi',
    country: 'India',
    address: 'C-93, Anand Niketan, New Delhi 110021, India',
    submissionInBangladesh: false,
    indiaTravelRequirement: 'YES',
    indiaTravelReason: 'Lithuania does NOT maintain a resident diplomatic mission or authorized long-stay student visa collection center in Bangladesh. Under official Lithuanian consular regulations, all Bangladeshi citizens applying for a National D-Visa for studies must travel to the Embassy of Lithuania in New Delhi, India for personal biometric registration and consular interview.',
    appointmentRequired: true,
    biometricsRequired: true,
    interviewRequired: 'MANDATORY',
    inPersonPassportSubmission: true,
    passportReturnAvailableInBd: false,
    alternateRouteNotice: 'Applicants must obtain an Indian Double-Entry / Multiple-Entry Tourist/Business Visa to attend their appointment in New Delhi.',
    officialBookingUrl: 'https://in.mfa.lt/in/en/travel-and-residence/coming-to-lithuania/visas',
    requirements: [
      {
        title: 'MIGRIS Electronic Application & Mediation Letter',
        description: 'Completed application via MIGRIS portal with mediation letter code from Lithuanian university.',
        isMandatory: true,
      },
      {
        title: 'Travel to Embassy of Lithuania in New Delhi',
        description: 'Mandatory personal attendance in New Delhi, India. Indian visa required for transit.',
        isMandatory: true,
      },
      {
        title: 'Apostilled / Attested Academic Documents',
        description: 'All certificates and police clearance attested by Ministry of Foreign Affairs (MOFA) Dhaka and Apostilled.',
        isMandatory: true,
      },
    ],
  },

  // 7. PORTUGAL (Mandatory Travel to New Delhi, India)
  {
    countryCode: 'PT',
    countryName: 'Portugal',
    embassyHandling: 'Embassy of Portugal in New Delhi, India',
    centreName: 'VFS Global Portugal / Embassy of Portugal (New Delhi)',
    providerName: 'EMBASSY_DIRECT',
    city: 'New Delhi',
    country: 'India',
    address: '4, Panchsheel Marg, Chanakyapuri, New Delhi 110021, India',
    submissionInBangladesh: false,
    indiaTravelRequirement: 'YES',
    indiaTravelReason: 'Portugal has no resident diplomatic mission in Bangladesh. Consular jurisdiction for long-stay National Study Visas (D4 / D5) covering Bangladeshi nationals is strictly vested in the Embassy of Portugal in New Delhi, India.',
    appointmentRequired: true,
    biometricsRequired: true,
    interviewRequired: 'MANDATORY',
    inPersonPassportSubmission: true,
    passportReturnAvailableInBd: false,
    alternateRouteNotice: 'Applicants must plan travel to New Delhi, India to lodge their National D-visa file.',
    officialBookingUrl: 'https://nova-deli.embaixadaportugal.mne.gov.pt/en/consular-services/visas',
    requirements: [
      {
        title: 'Acceptance Letter from Portuguese Institution',
        description: 'Official enrollment confirmation from a recognized Portuguese higher education institution.',
        isMandatory: true,
      },
      {
        title: 'Consular Submission in New Delhi',
        description: 'Physical submission and biometric enrolment at the Portuguese Embassy or designated VAC in New Delhi.',
        isMandatory: true,
      },
      {
        title: 'Police Clearance with MOFA Attestation',
        description: 'Crime-free certificate issued within 90 days and attested by MOFA Bangladesh.',
        isMandatory: true,
      },
    ],
  },

  // 8. POLAND (VFS Dhaka Quota or New Delhi Embassy)
  {
    countryCode: 'PL',
    countryName: 'Poland',
    embassyHandling: 'Embassy of the Republic of Poland in New Delhi, India',
    centreName: 'VFS Global Poland (Dhaka) / Embassy in New Delhi',
    providerName: 'VFS_GLOBAL',
    city: 'Dhaka / New Delhi',
    country: 'Bangladesh / India',
    address: 'Delta Life Tower, Gulshan-2, Dhaka / 50-M Shantipath, Chanakyapuri, New Delhi',
    submissionInBangladesh: true,
    indiaTravelRequirement: 'POSSIBLY',
    indiaTravelReason: 'Poland permits national study visa file submission at VFS Global Dhaka through the e-Konsulat registration system. However, due to extremely constrained appointment quota slots in Dhaka, students unable to secure a local slot often must register directly with the Embassy of Poland in New Delhi, India.',
    appointmentRequired: true,
    biometricsRequired: true,
    interviewRequired: 'CONDITIONAL',
    inPersonPassportSubmission: true,
    passportReturnAvailableInBd: true,
    alternateRouteNotice: 'Monitor e-Konsulat slot openings for Dhaka VAC regularly before booking travel to New Delhi.',
    officialBookingUrl: 'https://secure.e-konsulat.gov.pl/',
    requirements: [
      {
        title: 'e-Konsulat Registered Appointment Form',
        description: 'Confirmed appointment voucher booked through official Polish government e-Konsulat system.',
        isMandatory: true,
      },
      {
        title: 'University Acceptance & Tuition Receipt',
        description: 'Zaświadczenie o przyjęciu na studia and official confirmation of 1st-year tuition payment.',
        isMandatory: true,
      },
      {
        title: 'Accommodation and Maintenance Proof',
        description: 'Confirmed dormitory lease or rental agreement + bank balance meeting statutory Polish living costs.',
        isMandatory: true,
      },
    ],
  },

  // 9. SWEDEN (Embassy of Sweden in Dhaka)
  {
    countryCode: 'SE',
    countryName: 'Sweden',
    embassyHandling: 'Embassy of Sweden in Dhaka',
    centreName: 'Embassy of Sweden Visa Section (Dhaka)',
    providerName: 'EMBASSY_DIRECT',
    city: 'Dhaka',
    country: 'Bangladesh',
    address: 'Bay\'s Edgewater, 6th Floor, Plot 12, North Avenue, Gulshan 2, Dhaka 1212',
    submissionInBangladesh: true,
    indiaTravelRequirement: 'NO',
    indiaTravelReason: 'Resident Swedish mission in Dhaka conducts passport verification and biometric capture for higher education residence permits. No travel to India is required.',
    appointmentRequired: true,
    biometricsRequired: true,
    interviewRequired: 'CONDITIONAL',
    inPersonPassportSubmission: true,
    passportReturnAvailableInBd: true,
    officialBookingUrl: 'https://www.swedenabroad.se/en/embassies/bangladesh-dhaka/',
    requirements: [
      {
        title: 'Migrationsverket Online Application',
        description: 'First application submitted online with full first-installment tuition paid.',
        isMandatory: true,
      },
      {
        title: 'Passport Verification in Dhaka',
        description: 'In-person passport check at Swedish Embassy Dhaka upon receiving Migrationsverket notification.',
        isMandatory: true,
      },
    ],
  },

  // 10. FINLAND (Enter Finland + VFS Global Dhaka)
  {
    countryCode: 'FI',
    countryName: 'Finland',
    embassyHandling: 'Embassy of Finland in New Delhi / VFS Global Dhaka',
    centreName: 'VFS Global Finland (Dhaka)',
    providerName: 'VFS_GLOBAL',
    city: 'Dhaka',
    country: 'Bangladesh',
    address: 'Delta Life Tower, Plot 37, Road 90, Gulshan-2, Dhaka 1212',
    submissionInBangladesh: true,
    indiaTravelRequirement: 'NO',
    indiaTravelReason: 'Finnish Immigration Service (Migri) permits electronic application via Enter Finland and biometric identification at VFS Global in Dhaka. Bangladeshi students do NOT need to travel to the Embassy in New Delhi under current arrangements.',
    appointmentRequired: true,
    biometricsRequired: true,
    interviewRequired: 'RARE',
    inPersonPassportSubmission: true,
    passportReturnAvailableInBd: true,
    officialBookingUrl: 'https://visa.vfsglobal.com/bgd/en/fin',
    requirements: [
      {
        title: 'Enter Finland Online Application',
        description: 'Submitted electronic residence permit application for studies.',
        isMandatory: true,
      },
      {
        title: 'Health Insurance & Sufficient Funds',
        description: 'Private student medical insurance + minimum €6,720/year (€560/month) in applicant\'s bank account.',
        isMandatory: true,
      },
    ],
  },
];
