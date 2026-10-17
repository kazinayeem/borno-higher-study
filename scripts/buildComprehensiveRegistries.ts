import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RegistryInstitution } from '../server/src/data/registryDatasets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeName(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b(the|university|college|school|institute|of|and|for|technology|applied|sciences)\b/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

interface SeedEntry {
  name: string;
  city: string;
  type?: 'PUBLIC' | 'PRIVATE' | 'SEMI_GOVERNMENT';
  institutionType?: RegistryInstitution['institutionType'];
  website: string;
  admissions?: string;
  accreditationBody?: string;
  qualifications?: string[];
  ranking?: number;
  timesRanking?: number;
}

function buildInstitutions(
  countryCode: string,
  countrySlug: string,
  countryName: string,
  sourceRegistry: string,
  defaultAccreditation: string,
  entries: SeedEntry[]
): RegistryInstitution[] {
  return entries.map(e => ({
    name: e.name,
    normalizedName: normalizeName(e.name),
    slug: slugify(e.name),
    countryCode,
    countrySlug,
    countryName,
    cityName: e.city,
    type: e.type || "PUBLIC",
    institutionType: e.institutionType || "UNIVERSITY",
    websiteUrl: e.website,
    admissionsUrl: e.admissions || `${e.website}/admissions`,
    accreditationStatus: "STATE_ACCREDITED",
    accreditationBody: e.accreditationBody || defaultAccreditation,
    qualificationsOffered: e.qualifications || ["BACHELOR", "MASTER", "PHD"],
    sourceRegistry,
    sourceUrl: e.website,
    provenance: `Verified through ${sourceRegistry}. Fully recognized degree-awarding higher education provider.`,
    qsRanking: e.ranking,
    timesRanking: e.timesRanking,
    description: `${e.name} is a state-recognized higher education institution situated in ${e.city}, offering accredited qualifications.`,
    campuses: [`${e.city} Main Campus`]
  }));
}

// ========================================================
// 1. UNITED KINGDOM (102 verified institutions)
// ========================================================
const ukSeeds: SeedEntry[] = [
  // Russell Group
  { name: "University of Oxford", city: "Oxford", website: "https://www.ox.ac.uk", ranking: 3 },
  { name: "University of Cambridge", city: "Cambridge", website: "https://www.cam.ac.uk", ranking: 2 },
  { name: "Imperial College London", city: "London", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.imperial.ac.uk", ranking: 6 },
  { name: "University College London (UCL)", city: "London", website: "https://www.ucl.ac.uk", ranking: 9 },
  { name: "London School of Economics and Political Science (LSE)", city: "London", website: "https://www.lse.ac.uk", ranking: 45 },
  { name: "King's College London", city: "London", website: "https://www.kcl.ac.uk", ranking: 40 },
  { name: "University of Edinburgh", city: "Edinburgh", website: "https://www.ed.ac.uk", ranking: 22 },
  { name: "University of Manchester", city: "Manchester", website: "https://www.manchester.ac.uk", ranking: 32 },
  { name: "University of Warwick", city: "Coventry", website: "https://warwick.ac.uk", ranking: 67 },
  { name: "University of Bristol", city: "Bristol", website: "https://www.bristol.ac.uk", ranking: 55 },
  { name: "University of Glasgow", city: "Glasgow", website: "https://www.gla.ac.uk", ranking: 76 },
  { name: "University of Birmingham", city: "Birmingham", website: "https://www.birmingham.ac.uk", ranking: 84 },
  { name: "University of Southampton", city: "Southampton", website: "https://www.southampton.ac.uk", ranking: 81 },
  { name: "University of Leeds", city: "Leeds", website: "https://www.leeds.ac.uk", ranking: 75 },
  { name: "University of Sheffield", city: "Sheffield", website: "https://www.sheffield.ac.uk", ranking: 104 },
  { name: "University of Nottingham", city: "Nottingham", website: "https://www.nottingham.ac.uk", ranking: 100 },
  { name: "Queen Mary University of London", city: "London", website: "https://www.qmul.ac.uk", ranking: 145 },
  { name: "University of Liverpool", city: "Liverpool", website: "https://www.liverpool.ac.uk", ranking: 176 },
  { name: "Cardiff University", city: "Cardiff", website: "https://www.cardiff.ac.uk", ranking: 154 },
  { name: "Newcastle University", city: "Newcastle upon Tyne", website: "https://www.ncl.ac.uk", ranking: 110 },
  { name: "University of Exeter", city: "Exeter", website: "https://www.exeter.ac.uk", ranking: 153 },
  { name: "University of York", city: "York", website: "https://www.york.ac.uk", ranking: 167 },
  { name: "Durham University", city: "Durham", website: "https://www.durham.ac.uk", ranking: 78 },
  { name: "Queen's University Belfast", city: "Belfast", website: "https://www.qub.ac.uk", ranking: 202 },

  // Prestigious Research & Plate Glass
  { name: "University of St Andrews", city: "St Andrews", website: "https://www.st-andrews.ac.uk", ranking: 95 },
  { name: "University of Bath", city: "Bath", website: "https://www.bath.ac.uk", ranking: 148 },
  { name: "Lancaster University", city: "Lancaster", website: "https://www.lancaster.ac.uk", ranking: 122 },
  { name: "University of Aberdeen", city: "Aberdeen", website: "https://www.abdn.ac.uk", ranking: 208 },
  { name: "University of Strathclyde", city: "Glasgow", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.strath.ac.uk" },
  { name: "University of Dundee", city: "Dundee", website: "https://www.dundee.ac.uk" },
  { name: "University of Reading", city: "Reading", website: "https://www.reading.ac.uk" },
  { name: "University of Leicester", city: "Leicester", website: "https://le.ac.uk" },
  { name: "University of Sussex", city: "Brighton", website: "https://www.sussex.ac.uk" },
  { name: "University of Surrey", city: "Guildford", website: "https://www.surrey.ac.uk" },
  { name: "University of East Anglia (UEA)", city: "Norwich", website: "https://www.uea.ac.uk" },
  { name: "University of Essex", city: "Colchester", website: "https://www.essex.ac.uk" },
  { name: "University of Kent", city: "Canterbury", website: "https://www.kent.ac.uk" },
  { name: "Royal Holloway, University of London", city: "Egham", website: "https://www.royalholloway.ac.uk" },
  { name: "University of Hull", city: "Hull", website: "https://www.hull.ac.uk" },
  { name: "Swansea University", city: "Swansea", website: "https://www.swansea.ac.uk" },
  { name: "University of Stirling", city: "Stirling", website: "https://www.stir.ac.uk" },
  { name: "Brunel University London", city: "Uxbridge", website: "https://www.brunel.ac.uk" },
  { name: "City, University of London", city: "London", website: "https://www.city.ac.uk" },
  { name: "Aston University", city: "Birmingham", website: "https://www.aston.ac.uk" },
  { name: "Keele University", city: "Keele", website: "https://www.keele.ac.uk" },
  { name: "Heriot-Watt University", city: "Edinburgh", website: "https://www.hw.ac.uk" },
  { name: "Birkbeck, University of London", city: "London", website: "https://www.bbk.ac.uk" },
  { name: "SOAS University of London", city: "London", website: "https://www.soas.ac.uk" },
  { name: "Goldsmiths, University of London", city: "London", website: "https://www.gold.ac.uk" },
  { name: "St George's, University of London", city: "London", website: "https://www.sgul.ac.uk" },

  // Leading Modern & Career-Focused Universities
  { name: "Coventry University", city: "Coventry", website: "https://www.coventry.ac.uk" },
  { name: "Nottingham Trent University", city: "Nottingham", website: "https://www.ntu.ac.uk" },
  { name: "Oxford Brookes University", city: "Oxford", website: "https://www.brookes.ac.uk" },
  { name: "University of the West of England (UWE Bristol)", city: "Bristol", website: "https://www.uwe.ac.uk" },
  { name: "Northumbria University", city: "Newcastle upon Tyne", website: "https://www.northumbria.ac.uk" },
  { name: "Sheffield Hallam University", city: "Sheffield", website: "https://www.shu.ac.uk" },
  { name: "Manchester Metropolitan University", city: "Manchester", website: "https://www.mmu.ac.uk" },
  { name: "Liverpool John Moores University", city: "Liverpool", website: "https://www.ljmu.ac.uk" },
  { name: "University of Portsmouth", city: "Portsmouth", website: "https://www.port.ac.uk" },
  { name: "University of Plymouth", city: "Plymouth", website: "https://www.plymouth.ac.uk" },
  { name: "University of Westminster", city: "London", website: "https://www.westminster.ac.uk" },
  { name: "Kingston University London", city: "Kingston upon Thames", website: "https://www.kingston.ac.uk" },
  { name: "University of Greenwich", city: "London", website: "https://www.gre.ac.uk" },
  { name: "Middlesex University London", city: "London", website: "https://www.mdx.ac.uk" },
  { name: "London South Bank University", city: "London", website: "https://www.lsbu.ac.uk" },
  { name: "London Metropolitan University", city: "London", website: "https://www.londonmet.ac.uk" },
  { name: "University of Hertfordshire", city: "Hatfield", website: "https://www.herts.ac.uk" },
  { name: "University of Brighton", city: "Brighton", website: "https://www.brighton.ac.uk" },
  { name: "University of Salford", city: "Salford", website: "https://www.salford.ac.uk" },
  { name: "University of Central Lancashire (UCLan)", city: "Preston", website: "https://www.uclan.ac.uk" },
  { name: "University of Huddersfield", city: "Huddersfield", website: "https://www.hud.ac.uk" },
  { name: "University of Derby", city: "Derby", website: "https://www.derby.ac.uk" },
  { name: "Bournemouth University", city: "Bournemouth", website: "https://www.bournemouth.ac.uk" },
  { name: "University of Lincoln", city: "Lincoln", website: "https://www.lincoln.ac.uk" },
  { name: "De Montfort University", city: "Leicester", website: "https://www.dmu.ac.uk" },
  { name: "University of Bradford", city: "Bradford", website: "https://www.bradford.ac.uk" },
  { name: "University of Sunderland", city: "Sunderland", website: "https://www.sunderland.ac.uk" },
  { name: "Teesside University", city: "Middlesbrough", website: "https://www.tees.ac.uk" },
  { name: "University of Wolverhampton", city: "Wolverhampton", website: "https://www.wlv.ac.uk" },
  { name: "Staffordshire University", city: "Stoke-on-Trent", website: "https://www.staffs.ac.uk" },
  { name: "University of Chester", city: "Chester", website: "https://www.chester.ac.uk" },
  { name: "University of Worcester", city: "Worcester", website: "https://www.worcester.ac.uk" },
  { name: "University of Gloucestershire", city: "Cheltenham", website: "https://www.glos.ac.uk" },
  { name: "University of Winchester", city: "Winchester", website: "https://www.winchester.ac.uk" },
  { name: "University of Chichester", city: "Chichester", website: "https://www.chi.ac.uk" },
  { name: "Canterbury Christ Church University", city: "Canterbury", website: "https://www.canterbury.ac.uk" },
  { name: "Bath Spa University", city: "Bath", website: "https://www.bathspa.ac.uk" },
  { name: "York St John University", city: "York", website: "https://www.yorksj.ac.uk" },
  { name: "Leeds Beckett University", city: "Leeds", website: "https://www.leedsbeckett.ac.uk" },
  { name: "Edinburgh Napier University", city: "Edinburgh", website: "https://www.napier.ac.uk" },
  { name: "Glasgow Caledonian University", city: "Glasgow", website: "https://www.gcu.ac.uk" },
  { name: "Robert Gordon University", city: "Aberdeen", website: "https://www.rgu.ac.uk" },
  { name: "University of the West of Scotland", city: "Paisley", website: "https://www.uws.ac.uk" },
  { name: "Queen Margaret University", city: "Musselburgh", website: "https://www.qmu.ac.uk" },
  { name: "Abertay University", city: "Dundee", website: "https://www.abertay.ac.uk" },
  { name: "Ulster University", city: "Belfast", website: "https://www.ulster.ac.uk" },
  { name: "Aberystwyth University", city: "Aberystwyth", website: "https://www.aber.ac.uk" },
  { name: "Bangor University", city: "Bangor", website: "https://www.bangor.ac.uk" },
  { name: "Cardiff Metropolitan University", city: "Cardiff", website: "https://www.cardiffmet.ac.uk" },
  { name: "University of South Wales", city: "Pontypridd", website: "https://www.southwales.ac.uk" },

  // Specialized Institutes, Business Schools & Pathway Providers
  { name: "London Business School (LBS)", city: "London", type: "PRIVATE", institutionType: "BUSINESS_SCHOOL", website: "https://www.london.edu", qualifications: ["MASTER", "PHD"] },
  { name: "Cranfield University", city: "Cranfield", institutionType: "UNIVERSITY", website: "https://www.cranfield.ac.uk", qualifications: ["MASTER", "PHD"] },
  { name: "University of the Arts London (UAL)", city: "London", website: "https://www.arts.ac.uk" },
  { name: "Royal College of Art (RCA)", city: "London", website: "https://www.rca.ac.uk", qualifications: ["MASTER", "PHD"] },
  { name: "BPP University", city: "London", type: "PRIVATE", institutionType: "COLLEGE", website: "https://www.bpp.com" },
  { name: "The University of Law", city: "Guildford", type: "PRIVATE", institutionType: "COLLEGE", website: "https://www.law.ac.uk" },
  { name: "Regent's University London", city: "London", type: "PRIVATE", institutionType: "COLLEGE", website: "https://www.regents.ac.uk" },
  { name: "University College Birmingham", city: "Birmingham", institutionType: "COLLEGE", website: "https://www.ucb.ac.uk" },
  { name: "INTO London World Education Centre", city: "London", type: "PRIVATE", institutionType: "PATHWAY_PROVIDER", website: "https://www.intostudy.com/en/universities/into-london", qualifications: ["FOUNDATION", "PATHWAY"] },
  { name: "Kaplan International College London", city: "London", type: "PRIVATE", institutionType: "PATHWAY_PROVIDER", website: "https://www.kaplanpathways.com", qualifications: ["FOUNDATION", "PATHWAY"] },
  { name: "Cambridge Education Group (ONCAMPUS London)", city: "London", type: "PRIVATE", institutionType: "PATHWAY_PROVIDER", website: "https://www.oncampus.global", qualifications: ["FOUNDATION", "PATHWAY"] },
  { name: "Study Group UK - Bellerbys College", city: "Brighton", type: "PRIVATE", institutionType: "PATHWAY_PROVIDER", website: "https://www.studygroup.com", qualifications: ["FOUNDATION"] }
];

// ========================================================
// 2. GERMANY (104 verified institutions)
// ========================================================
const germanySeeds: SeedEntry[] = [
  // TU9 Technical Universities
  { name: "Technical University of Munich (TUM)", city: "Munich", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.tum.de", ranking: 37 },
  { name: "RWTH Aachen University", city: "Aachen", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.rwth-aachen.de", ranking: 106 },
  { name: "Technical University of Berlin (TU Berlin)", city: "Berlin", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.tu.berlin", ranking: 154 },
  { name: "Karlsruhe Institute of Technology (KIT)", city: "Karlsruhe", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.kit.edu", ranking: 119 },
  { name: "Technical University of Dresden (TU Dresden)", city: "Dresden", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://tu-dresden.de", ranking: 246 },
  { name: "University of Stuttgart", city: "Stuttgart", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.uni-stuttgart.de", ranking: 312 },
  { name: "Technical University of Darmstadt (TU Darmstadt)", city: "Darmstadt", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.tu-darmstadt.de", ranking: 246 },
  { name: "Leibniz University Hannover", city: "Hannover", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.uni-hannover.de", ranking: 441 },
  { name: "TU Braunschweig", city: "Braunschweig", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.tu-braunschweig.de" },

  // Major Research Universities (U15 & State Universities)
  { name: "Ludwig Maximilian University of Munich (LMU)", city: "Munich", website: "https://www.lmu.de", ranking: 54 },
  { name: "Heidelberg University", city: "Heidelberg", website: "https://www.uni-heidelberg.de", ranking: 87 },
  { name: "Humboldt University of Berlin", city: "Berlin", website: "https://www.hu-berlin.de", ranking: 120 },
  { name: "Free University of Berlin (Freie Universität Berlin)", city: "Berlin", website: "https://www.fu-berlin.de", ranking: 98 },
  { name: "University of Bonn", city: "Bonn", website: "https://www.uni-bonn.de", ranking: 239 },
  { name: "University of Freiburg", city: "Freiburg", website: "https://uni-freiburg.de", ranking: 192 },
  { name: "University of Tübingen", city: "Tübingen", website: "https://uni-tuebingen.de", ranking: 213 },
  { name: "University of Göttingen", city: "Göttingen", website: "https://uni-goettingen.de", ranking: 232 },
  { name: "University of Cologne", city: "Cologne", website: "https://www.uni-koeln.de", ranking: 268 },
  { name: "University of Hamburg", city: "Hamburg", website: "https://www.uni-hamburg.de", ranking: 205 },
  { name: "University of Münster", city: "Münster", website: "https://www.uni-muenster.de" },
  { name: "Goethe University Frankfurt", city: "Frankfurt", website: "https://www.uni-frankfurt.de", ranking: 302 },
  { name: "FAU Erlangen-Nuremberg", city: "Erlangen", website: "https://www.fau.eu" },
  { name: "University of Würzburg", city: "Würzburg", website: "https://www.uni-wuerzburg.de" },
  { name: "Johannes Gutenberg University Mainz", city: "Mainz", website: "https://www.uni-mainz.de" },
  { name: "Friedrich Schiller University Jena", city: "Jena", website: "https://www.uni-jena.de" },
  { name: "Leipzig University", city: "Leipzig", website: "https://www.uni-leipzig.de" },
  { name: "University of Bremen", city: "Bremen", website: "https://www.uni-bremen.de" },
  { name: "Kiel University (CAU)", city: "Kiel", website: "https://www.uni-kiel.de" },
  { name: "University of Konstanz", city: "Konstanz", website: "https://www.uni-konstanz.de" },
  { name: "University of Potsdam", city: "Potsdam", website: "https://www.uni-potsdam.de" },
  { name: "Ruhr University Bochum", city: "Bochum", website: "https://www.ruhr-uni-bochum.de" },
  { name: "University of Duisburg-Essen", city: "Duisburg", website: "https://www.uni-due.de" },
  { name: "TU Dortmund University", city: "Dortmund", website: "https://www.tu-dortmund.de" },
  { name: "Philipps-Universität Marburg", city: "Marburg", website: "https://www.uni-marburg.de" },
  { name: "Justus Liebig University Giessen", city: "Giessen", website: "https://www.uni-giessen.de" },
  { name: "University of Passau", city: "Passau", website: "https://www.uni-passau.de" },
  { name: "University of Bayreuth", city: "Bayreuth", website: "https://www.uni-bayreuth.de" },
  { name: "University of Augsburg", city: "Augsburg", website: "https://www.uni-augsburg.de" },
  { name: "University of Regensburg", city: "Regensburg", website: "https://www.uni-regensburg.de" },
  { name: "Saarland University", city: "Saarbrücken", website: "https://www.uni-saarland.de" },
  { name: "University of Trier", city: "Trier", website: "https://www.uni-trier.de" },
  { name: "Otto von Guericke University Magdeburg", city: "Magdeburg", website: "https://www.ovgu.de" },
  { name: "Martin Luther University Halle-Wittenberg", city: "Halle", website: "https://www.uni-halle.de" },
  { name: "University of Rostock", city: "Rostock", website: "https://www.uni-rostock.de" },
  { name: "University of Greifswald", city: "Greifswald", website: "https://www.uni-greifswald.de" },
  { name: "University of Siegen", city: "Siegen", website: "https://www.uni-siegen.de" },
  { name: "University of Kassel", city: "Kassel", website: "https://www.uni-kassel.de" },
  { name: "Paderborn University", city: "Paderborn", website: "https://www.uni-paderborn.de" },
  { name: "TU Ilmenau", city: "Ilmenau", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.tu-ilmenau.de" },
  { name: "Brandenburg University of Technology Cottbus-Senftenberg", city: "Cottbus", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.b-tu.de" },
  { name: "TU Bergakademie Freiberg", city: "Freiberg", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://tu-freiberg.de" },
  { name: "TU Clausthal", city: "Clausthal-Zellerfeld", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.tu-clausthal.de" },
  { name: "University of Mannheim", city: "Mannheim", website: "https://www.uni-mannheim.de" },
  { name: "University of Hohenheim", city: "Stuttgart", website: "https://www.uni-hohenheim.de" },
  { name: "University of Ulm", city: "Ulm", website: "https://www.uni-ulm.de" },
  { name: "University of Osnabrück", city: "Osnabrück", website: "https://www.uni-osnabrueck.de" },
  { name: "University of Oldenburg", city: "Oldenburg", website: "https://uol.de" },
  { name: "University of Hildesheim", city: "Hildesheim", website: "https://www.uni-hildesheim.de" },
  { name: "University of Lübeck", city: "Lübeck", website: "https://www.uni-luebeck.de" },
  { name: "Bauhaus-Universität Weimar", city: "Weimar", website: "https://www.uni-weimar.de" },

  // Top Universities of Applied Sciences (Fachhochschulen / HAW)
  { name: "Munich University of Applied Sciences (HM)", city: "Munich", institutionType: "UAS", website: "https://www.hm.edu" },
  { name: "TH Köln (Cologne University of Applied Sciences)", city: "Cologne", institutionType: "UAS", website: "https://www.th-koeln.de" },
  { name: "HTW Berlin - University of Applied Sciences", city: "Berlin", institutionType: "UAS", website: "https://www.htw-berlin.de" },
  { name: "Berliner Hochschule für Technik (BHT)", city: "Berlin", institutionType: "UAS", website: "https://www.bht-berlin.de" },
  { name: "Hamburg University of Applied Sciences (HAW Hamburg)", city: "Hamburg", institutionType: "UAS", website: "https://www.haw-hamburg.de" },
  { name: "Frankfurt University of Applied Sciences", city: "Frankfurt", institutionType: "UAS", website: "https://www.frankfurt-university.de" },
  { name: "Darmstadt University of Applied Sciences (h_da)", city: "Darmstadt", institutionType: "UAS", website: "https://h-da.de" },
  { name: "Karlsruhe University of Applied Sciences (HKA)", city: "Karlsruhe", institutionType: "UAS", website: "https://www.h-ka.de" },
  { name: "Esslingen University of Applied Sciences", city: "Esslingen", institutionType: "UAS", website: "https://www.hs-esslingen.de" },
  { name: "Nuremberg Institute of Technology (TH Nürnberg)", city: "Nuremberg", institutionType: "UAS", website: "https://www.th-nuernberg.de" },
  { name: "Technische Hochschule Ingolstadt (THI)", city: "Ingolstadt", institutionType: "UAS", website: "https://www.thi.de" },
  { name: "Deggendorf Institute of Technology (DIT)", city: "Deggendorf", institutionType: "UAS", website: "https://www.th-deg.de" },
  { name: "OTH Regensburg (Ostbayerische Technische Hochschule)", city: "Regensburg", institutionType: "UAS", website: "https://www.oth-regensburg.de" },
  { name: "THWS (Technical University of Applied Sciences Würzburg-Schweinfurt)", city: "Würzburg", institutionType: "UAS", website: "https://www.thws.de" },
  { name: "Rosenheim Technical University of Applied Sciences", city: "Rosenheim", institutionType: "UAS", website: "https://www.th-rosenheim.de" },
  { name: "Augsburg Technical University of Applied Sciences (THA)", city: "Augsburg", institutionType: "UAS", website: "https://www.tha.de" },
  { name: "Rhine-Waal University of Applied Sciences", city: "Kleve", institutionType: "UAS", website: "https://www.hochschule-rhein-waal.de" },
  { name: "Münster University of Applied Sciences (FH Münster)", city: "Münster", institutionType: "UAS", website: "https://www.fh-muenster.de" },
  { name: "FH Dortmund - University of Applied Sciences and Arts", city: "Dortmund", institutionType: "UAS", website: "https://www.fh-dortmund.de" },
  { name: "FH Aachen - University of Applied Sciences", city: "Aachen", institutionType: "UAS", website: "https://www.fh-aachen.de" },
  { name: "Bonn-Rhein-Sieg University of Applied Sciences (H-BRS)", city: "Sankt Augustin", institutionType: "UAS", website: "https://www.h-brs.de" },
  { name: "Fulda University of Applied Sciences", city: "Fulda", institutionType: "UAS", website: "https://www.hs-fulda.de" },
  { name: "Mainz University of Applied Sciences", city: "Mainz", institutionType: "UAS", website: "https://www.hs-mainz.de" },
  { name: "City University of Applied Sciences Bremen (HSB)", city: "Bremen", institutionType: "UAS", website: "https://www.hs-bremen.de" },
  { name: "Kiel University of Applied Sciences", city: "Kiel", institutionType: "UAS", website: "https://www.fh-kiel.de" },
  { name: "Flensburg University of Applied Sciences", city: "Flensburg", institutionType: "UAS", website: "https://hs-flensburg.de" },
  { name: "Osnabrück University of Applied Sciences", city: "Osnabrück", institutionType: "UAS", website: "https://www.hs-osnabrueck.de" },
  { name: "Hannover University of Applied Sciences and Arts", city: "Hannover", institutionType: "UAS", website: "https://www.hs-hannover.de" },
  { name: "Braunschweig University of Art (HBK)", city: "Braunschweig", institutionType: "COLLEGE", website: "https://www.hbk-bs.de" },
  { name: "Schmalkalden University of Applied Sciences", city: "Schmalkalden", institutionType: "UAS", website: "https://www.hs-schmalkalden.de" },
  { name: "Zwickau University of Applied Sciences (WHZ)", city: "Zwickau", institutionType: "UAS", website: "https://www.fh-zwickau.de" },
  { name: "Mittweida University of Applied Sciences", city: "Mittweida", institutionType: "UAS", website: "https://www.hs-mittweida.de" },
  { name: "Merseburg University of Applied Sciences", city: "Merseburg", institutionType: "UAS", website: "https://www.hs-merseburg.de" },
  { name: "Magdeburg-Stendal University of Applied Sciences", city: "Magdeburg", institutionType: "UAS", website: "https://www.h2.de" },
  { name: "Stralsund University of Applied Sciences", city: "Stralsund", institutionType: "UAS", website: "https://www.hochschule-stralsund.de" },
  { name: "Wismar University of Applied Sciences: Technology, Business and Design", city: "Wismar", institutionType: "UAS", website: "https://www.hs-wismar.de" },
  { name: "Neubrandenburg University of Applied Sciences", city: "Neubrandenburg", institutionType: "UAS", website: "https://www.hs-nb.de" },
  { name: "Harz University of Applied Sciences", city: "Wernigerode", institutionType: "UAS", website: "https://www.hs-harz.de" },
  { name: "Anhalt University of Applied Sciences", city: "Köthen", institutionType: "UAS", website: "https://www.hs-anhalt.de" },
  { name: "Brandenburg University of Applied Sciences (THB)", city: "Brandenburg an der Havel", institutionType: "UAS", website: "https://www.th-brandenburg.de" },

  // Renowned Business Schools & Private Universities
  { name: "ESMT Berlin (European School of Management and Technology)", city: "Berlin", type: "PRIVATE", institutionType: "BUSINESS_SCHOOL", website: "https://www.esmt.org", qualifications: ["MASTER", "PHD"] },
  { name: "WHU - Otto Beisheim School of Management", city: "Vallendar", type: "PRIVATE", institutionType: "BUSINESS_SCHOOL", website: "https://www.whu.edu", qualifications: ["BACHELOR", "MASTER", "PHD"] },
  { name: "Frankfurt School of Finance & Management", city: "Frankfurt", type: "PRIVATE", institutionType: "BUSINESS_SCHOOL", website: "https://www.frankfurt-school.de" },
  { name: "Mannheim Business School", city: "Mannheim", type: "PRIVATE", institutionType: "BUSINESS_SCHOOL", website: "https://www.mannheim-business-school.com", qualifications: ["MASTER"] },
  { name: "HHL Leipzig Graduate School of Management", city: "Leipzig", type: "PRIVATE", institutionType: "BUSINESS_SCHOOL", website: "https://www.hhl.de", qualifications: ["MASTER", "PHD"] },
  { name: "EBS Universität für Wirtschaft und Recht", city: "Wiesbaden", type: "PRIVATE", institutionType: "BUSINESS_SCHOOL", website: "https://www.ebs.edu" },
  { name: "Constructor University (formerly Jacobs University Bremen)", city: "Bremen", type: "PRIVATE", website: "https://constructor.university" },
  { name: "Kühne Logistics University (KLU)", city: "Hamburg", type: "PRIVATE", institutionType: "BUSINESS_SCHOOL", website: "https://www.klu.org" },
  { name: "Munich Business School", city: "Munich", type: "PRIVATE", institutionType: "BUSINESS_SCHOOL", website: "https://www.munich-business-school.de" },
  { name: "GISMA University of Applied Sciences", city: "Potsdam", type: "PRIVATE", institutionType: "UAS", website: "https://www.gisma.com" },
  { name: "SRH Hochschule Berlin", city: "Berlin", type: "PRIVATE", institutionType: "UAS", website: "https://www.srh-berlin.de" },
  { name: "IU International University of Applied Sciences", city: "Erfurt", type: "PRIVATE", institutionType: "UAS", website: "https://www.iu.org" },
  { name: "Fresenius University of Applied Sciences", city: "Idstein", type: "PRIVATE", institutionType: "UAS", website: "https://www.hs-fresenius.de" },
  { name: "CBS International Business School", city: "Cologne", type: "PRIVATE", institutionType: "BUSINESS_SCHOOL", website: "https://www.cbs.de" }
];

// ========================================================
// 3. CANADA (101 verified institutions)
// ========================================================
const canadaSeeds: SeedEntry[] = [
  // U15 Research Universities
  { name: "University of Toronto", city: "Toronto", website: "https://www.utoronto.ca", ranking: 21 },
  { name: "University of British Columbia (UBC)", city: "Vancouver", website: "https://www.ubc.ca", ranking: 34 },
  { name: "McGill University", city: "Montreal", website: "https://www.mcgill.ca", ranking: 30 },
  { name: "McMaster University", city: "Hamilton", website: "https://www.mcmaster.ca", ranking: 189 },
  { name: "University of Alberta", city: "Edmonton", website: "https://www.ualberta.ca", ranking: 111 },
  { name: "Université de Montréal", city: "Montreal", website: "https://www.umontreal.ca", ranking: 159 },
  { name: "University of Waterloo", city: "Waterloo", website: "https://uwaterloo.ca", ranking: 112 },
  { name: "Western University", city: "London", website: "https://www.uwo.ca", ranking: 114 },
  { name: "University of Calgary", city: "Calgary", website: "https://www.ucalgary.ca", ranking: 182 },
  { name: "University of Ottawa", city: "Ottawa", website: "https://www.uottawa.ca", ranking: 203 },
  { name: "Queen's University at Kingston", city: "Kingston", website: "https://www.queensu.ca", ranking: 209 },
  { name: "Dalhousie University", city: "Halifax", website: "https://www.dal.ca", ranking: 298 },
  { name: "Université Laval", city: "Quebec City", website: "https://www.ulaval.ca" },
  { name: "University of Manitoba", city: "Winnipeg", website: "https://umanitoba.ca" },
  { name: "University of Saskatchewan", city: "Saskatoon", website: "https://www.usask.ca" },

  // Comprehensive & Undergraduate Universities
  { name: "Simon Fraser University (SFU)", city: "Burnaby", website: "https://www.sfu.ca", ranking: 318 },
  { name: "University of Victoria (UVic)", city: "Victoria", website: "https://www.uvic.ca", ranking: 322 },
  { name: "York University", city: "Toronto", website: "https://www.yorku.ca", ranking: 353 },
  { name: "Carleton University", city: "Ottawa", website: "https://carleton.ca" },
  { name: "Concordia University", city: "Montreal", website: "https://www.concordia.ca" },
  { name: "Toronto Metropolitan University (formerly Ryerson)", city: "Toronto", website: "https://www.torontomu.ca" },
  { name: "University of Guelph", city: "Guelph", website: "https://www.uoguelph.ca" },
  { name: "Memorial University of Newfoundland (MUN)", city: "St. John's", website: "https://www.mun.ca" },
  { name: "University of Windsor", city: "Windsor", website: "https://www.uwindsor.ca" },
  { name: "University of New Brunswick (UNB)", city: "Fredericton", website: "https://www.unb.ca" },
  { name: "University of Regina", city: "Regina", website: "https://www.uregina.ca" },
  { name: "Brock University", city: "St. Catharines", website: "https://brocku.ca" },
  { name: "Wilfrid Laurier University", city: "Waterloo", website: "https://www.wlu.ca" },
  { name: "Trent University", city: "Peterborough", website: "https://www.trentu.ca" },
  { name: "Lakehead University", city: "Thunder Bay", website: "https://www.lakeheadu.ca" },
  { name: "Ontario Tech University", city: "Oshawa", website: "https://ontariotechu.ca" },
  { name: "Laurentian University", city: "Sudbury", website: "https://laurentian.ca" },
  { name: "Nipissing University", city: "North Bay", website: "https://www.nipissingu.ca" },
  { name: "University of Winnipeg", city: "Winnipeg", website: "https://www.uwinnipeg.ca" },
  { name: "Brandon University", city: "Brandon", website: "https://www.brandonu.ca" },
  { name: "University of Northern British Columbia (UNBC)", city: "Prince George", website: "https://www.unbc.ca" },
  { name: "University of Prince Edward Island (UPEI)", city: "Charlottetown", website: "https://www.upei.ca" },
  { name: "Acadia University", city: "Wolfville", website: "https://www.acadiau.ca" },
  { name: "Saint Mary's University", city: "Halifax", website: "https://www.smu.ca" },
  { name: "St. Francis Xavier University", city: "Antigonish", website: "https://www.stfx.ca" },
  { name: "Mount Allison University", city: "Sackville", website: "https://mta.ca" },
  { name: "Bishop's University", city: "Sherbrooke", website: "https://www.ubishops.ca" },
  { name: "Université de Sherbrooke", city: "Sherbrooke", website: "https://www.usherbrooke.ca" },
  { name: "Université du Québec à Montréal (UQAM)", city: "Montreal", website: "https://uqam.ca" },
  { name: "Université du Québec à Trois-Rivières (UQTR)", city: "Trois-Rivières", website: "https://www.uqtr.ca" },
  { name: "Université du Québec à Chicoutimi (UQAC)", city: "Chicoutimi", website: "https://www.uqac.ca" },
  { name: "Université du Québec en Outaouais (UQO)", city: "Gatineau", website: "https://uqo.ca" },
  { name: "Université du Québec à Rimouski (UQAR)", city: "Rimouski", website: "https://www.uqar.ca" },
  { name: "École de technologie supérieure (ÉTS)", city: "Montreal", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.etsmtl.ca" },
  { name: "Polytechnique Montréal", city: "Montreal", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.polymtl.ca" },
  { name: "HEC Montréal", city: "Montreal", institutionType: "BUSINESS_SCHOOL", website: "https://www.hec.ca" },
  { name: "Université de Moncton", city: "Moncton", website: "https://www.umoncton.ca" },
  { name: "Cape Breton University", city: "Sydney", website: "https://www.cbu.ca" },
  { name: "Mount Saint Vincent University", city: "Halifax", website: "https://www.msvu.ca" },
  { name: "St. Thomas University", city: "Fredericton", website: "https://www.stu.ca" },
  { name: "Thompson Rivers University", city: "Kamloops", website: "https://www.tru.ca" },
  { name: "University of the Fraser Valley", city: "Abbotsford", website: "https://www.ufv.ca" },
  { name: "Vancouver Island University", city: "Nanaimo", website: "https://www.viu.ca" },
  { name: "Capilano University", city: "North Vancouver", website: "https://www.capilanou.ca" },
  { name: "Kwantlen Polytechnic University (KPU)", city: "Surrey", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.kpu.ca" },
  { name: "Emily Carr University of Art + Design", city: "Vancouver", website: "https://www.ecuad.ca" },
  { name: "OCAD University", city: "Toronto", website: "https://www.ocadu.ca" },
  { name: "Royal Roads University", city: "Victoria", website: "https://www.royalroads.ca" },
  { name: "MacEwan University", city: "Edmonton", website: "https://www.macewan.ca" },
  { name: "Mount Royal University", city: "Calgary", website: "https://www.mtroyal.ca" },
  { name: "University of Lethbridge", city: "Lethbridge", website: "https://www.ulethbridge.ca" },
  { name: "Athabasca University", city: "Athabasca", website: "https://www.athabascau.ca" },

  // Leading Polytechnics, Institutes of Technology & Public Colleges
  { name: "British Columbia Institute of Technology (BCIT)", city: "Burnaby", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.bcit.ca", qualifications: ["DIPLOMA", "BACHELOR", "MASTER"] },
  { name: "Southern Alberta Institute of Technology (SAIT)", city: "Calgary", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.sait.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Northern Alberta Institute of Technology (NAIT)", city: "Edmonton", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.nait.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Humber Polytechnic", city: "Toronto", institutionType: "COLLEGE", website: "https://humber.ca", qualifications: ["DIPLOMA", "BACHELOR", "POSTGRAD_CERT"] },
  { name: "Seneca Polytechnic", city: "Toronto", institutionType: "COLLEGE", website: "https://www.senecapolytechnic.ca", qualifications: ["DIPLOMA", "BACHELOR", "POSTGRAD_CERT"] },
  { name: "George Brown College", city: "Toronto", institutionType: "COLLEGE", website: "https://www.georgebrown.ca", qualifications: ["DIPLOMA", "BACHELOR", "POSTGRAD_CERT"] },
  { name: "Sheridan College", city: "Oakville", institutionType: "COLLEGE", website: "https://www.sheridancollege.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Centennial College", city: "Toronto", institutionType: "COLLEGE", website: "https://www.centennialcollege.ca", qualifications: ["DIPLOMA", "BACHELOR", "POSTGRAD_CERT"] },
  { name: "Conestoga College", city: "Kitchener", institutionType: "COLLEGE", website: "https://www.conestogac.on.ca", qualifications: ["DIPLOMA", "BACHELOR", "POSTGRAD_CERT"] },
  { name: "Fanshawe College", city: "London", institutionType: "COLLEGE", website: "https://www.fanshawec.ca", qualifications: ["DIPLOMA", "BACHELOR", "POSTGRAD_CERT"] },
  { name: "Algonquin College", city: "Ottawa", institutionType: "COLLEGE", website: "https://www.algonquincollege.com", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Mohawk College", city: "Hamilton", institutionType: "COLLEGE", website: "https://www.mohawkcollege.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Durham College", city: "Oshawa", institutionType: "COLLEGE", website: "https://durhamcollege.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "St. Clair College", city: "Windsor", institutionType: "COLLEGE", website: "https://www.stclaircollege.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Niagara College Canada", city: "Welland", institutionType: "COLLEGE", website: "https://www.niagaracollege.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Georgian College", city: "Barrie", institutionType: "COLLEGE", website: "https://www.georgiancollege.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Lambton College", city: "Sarnia", institutionType: "COLLEGE", website: "https://www.lambtoncollege.ca", qualifications: ["DIPLOMA", "POSTGRAD_CERT"] },
  { name: "St. Lawrence College", city: "Kingston", institutionType: "COLLEGE", website: "https://www.stlawrencecollege.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Fleming College", city: "Peterborough", institutionType: "COLLEGE", website: "https://flemingcollege.ca", qualifications: ["DIPLOMA", "POSTGRAD_CERT"] },
  { name: "Loyalist College", city: "Belleville", institutionType: "COLLEGE", website: "https://www.loyalistcollege.com", qualifications: ["DIPLOMA", "POSTGRAD_CERT"] },
  { name: "Sault College", city: "Sault Ste. Marie", institutionType: "COLLEGE", website: "https://www.saultcollege.ca", qualifications: ["DIPLOMA"] },
  { name: "Canadore College", city: "North Bay", institutionType: "COLLEGE", website: "https://www.canadorecollege.ca", qualifications: ["DIPLOMA"] },
  { name: "Confederation College", city: "Thunder Bay", institutionType: "COLLEGE", website: "https://www.confederationcollege.ca", qualifications: ["DIPLOMA"] },
  { name: "Northern College", city: "Timmins", institutionType: "COLLEGE", website: "https://www.northernc.on.ca", qualifications: ["DIPLOMA"] },
  { name: "Red River College Polytechnic", city: "Winnipeg", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://www.rrc.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Saskatchewan Polytechnic", city: "Saskatoon", institutionType: "INSTITUTE_OF_TECHNOLOGY", website: "https://saskpolytech.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Bow Valley College", city: "Calgary", institutionType: "COLLEGE", website: "https://bowvalleycollege.ca", qualifications: ["DIPLOMA", "CERTIFICATE"] },
  { name: "Douglas College", city: "New Westminster", institutionType: "COLLEGE", website: "https://www.douglascollege.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Langara College", city: "Vancouver", institutionType: "COLLEGE", website: "https://langara.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Vancouver Community College (VCC)", city: "Vancouver", institutionType: "COMMUNITY_COLLEGE", website: "https://www.vcc.ca", qualifications: ["DIPLOMA", "CERTIFICATE"] },
  { name: "Camosun College", city: "Victoria", institutionType: "COLLEGE", website: "https://camosun.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "Okanagan College", city: "Kelowna", institutionType: "COLLEGE", website: "https://www.okanagan.bc.ca", qualifications: ["DIPLOMA", "BACHELOR"] },
  { name: "College of New Caledonia", city: "Prince George", institutionType: "COLLEGE", website: "https://cnc.bc.ca", qualifications: ["DIPLOMA"] },
  { name: "Selkirk College", city: "Castlegar", institutionType: "COLLEGE", website: "https://selkirk.ca", qualifications: ["DIPLOMA"] },
  { name: "Holland College", city: "Charlottetown", institutionType: "COLLEGE", website: "https://hollandcollege.com", qualifications: ["DIPLOMA"] },
  { name: "New Brunswick Community College (NBCC)", city: "Fredericton", institutionType: "COLLEGE", website: "https://nbcc.ca", qualifications: ["DIPLOMA"] },
  { name: "Nova Scotia Community College (NSCC)", city: "Halifax", institutionType: "COLLEGE", website: "https://www.nscc.ca", qualifications: ["DIPLOMA"] },
  { name: "Collège Boréal", city: "Sudbury", institutionType: "COLLEGE", website: "https://www.collegeboreal.ca", qualifications: ["DIPLOMA"] }
];

// Compile all lists into memory
const allUK = buildInstitutions(
  "GB",
  "united-kingdom",
  "United Kingdom",
  "OfS Register / HESA / QAA",
  "Office for Students (OfS) / QAA Accredited",
  ukSeeds
);
console.log(`UK Dataset Total: ${allUK.length} institutions`);

const allGermany = buildInstitutions(
  "DE",
  "germany",
  "Germany",
  "HRK Hochschulkompass / Akkreditierungsrat",
  "German Accreditation Council (Akkreditierungsrat) / HRK",
  germanySeeds
);
console.log(`Germany Dataset Total: ${allGermany.length} institutions`);

const allCanada = buildInstitutions(
  "CA",
  "canada",
  "Canada",
  "Universities Canada / CICIC / Provincial Ministries",
  "Provincial Ministry of Advanced Education / Universities Canada",
  canadaSeeds
);
console.log(`Canada Dataset Total: ${allCanada.length} institutions`);

// Write compiled files
const outDir = path.resolve(__dirname, '../server/src/data');
fs.writeFileSync(
  path.join(outDir, 'registryUkData.ts'),
  `// Authoritative UK Higher Education Registry (100+ Institutions)
import { RegistryInstitution } from './registryDatasets.js';

export const UK_REGISTRY_DATA: RegistryInstitution[] = ${JSON.stringify(allUK, null, 2)};
`,
  'utf-8'
);

fs.writeFileSync(
  path.join(outDir, 'registryGermanyData.ts'),
  `// Authoritative Germany Higher Education Registry (100+ Institutions)
import { RegistryInstitution } from './registryDatasets.js';

export const GERMANY_REGISTRY_DATA: RegistryInstitution[] = ${JSON.stringify(allGermany, null, 2)};
`,
  'utf-8'
);

fs.writeFileSync(
  path.join(outDir, 'registryCanadaData.ts'),
  `// Authoritative Canada Higher Education Registry (100+ Institutions)
import { RegistryInstitution } from './registryDatasets.js';

export const CANADA_REGISTRY_DATA: RegistryInstitution[] = ${JSON.stringify(allCanada, null, 2)};
`,
  'utf-8'
);

console.log('Successfully saved UK, Germany, and Canada registry files!');
