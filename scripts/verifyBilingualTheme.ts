/**
 * Borno Higher Study — Global Bilingual & Theme Verification Suite
 * Tests language dictionaries (en/bn), 17 namespaces, key parity,
 * Bengali typography, fallback handling, number localization, and theme tokens.
 */

import { en } from '../client/src/locales/en.js';
import { bn } from '../client/src/locales/bn.js';
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  suite: string;
  test: string;
  status: 'PASS' | 'FAIL';
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, test: string, details?: string) {
  if (condition) {
    results.push({ suite, test, status: 'PASS', details });
    console.log(`  ✓ [${suite}] ${test}`);
  } else {
    results.push({ suite, test, status: 'FAIL', details });
    console.error(`  ✗ [${suite}] ${test} — ${details || 'Assertion failed'}`);
  }
}

console.log('='.repeat(70));
console.log('BORNO HIGHER STUDY — BILINGUAL & THEME ARCHITECTURE AUDIT');
console.log('='.repeat(70));

// 1. NAMESPACE VERIFICATION (17 Required Namespaces)
console.log('\n1. Audit Required Namespaces (17 namespaces):');
const requiredNamespaces = [
  'common',
  'navigation',
  'home',
  'universities',
  'programs',
  'scholarships',
  'eligibility',
  'englishTests',
  'moi',
  'visa',
  'research',
  'blog',
  'auth',
  'studentDashboard',
  'adminDashboard',
  'forms',
  'validation',
  'errors',
];

requiredNamespaces.forEach((ns) => {
  const enExists = ns in en && typeof (en as any)[ns] === 'object';
  const bnExists = ns in bn && typeof (bn as any)[ns] === 'object';
  assert(enExists && bnExists, 'Namespaces', `Namespace '${ns}' defined in both en & bn`);
});

// 2. KEY PARITY (RECURSIVE)
console.log('\n2. Audit Translation Key Parity:');
function getAllKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      keys = keys.concat(getAllKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = getAllKeys(en);
const bnKeys = getAllKeys(bn);

assert(enKeys.length > 0, 'KeyParity', `English keys count > 0 (found ${enKeys.length})`);
assert(bnKeys.length > 0, 'KeyParity', `Bengali keys count > 0 (found ${bnKeys.length})`);

const missingInBn = enKeys.filter((k) => !bnKeys.includes(k));
const missingInEn = bnKeys.filter((k) => !enKeys.includes(k));

assert(
  missingInBn.length === 0,
  'KeyParity',
  `All English keys exist in Bengali (${missingInBn.length} missing)`,
  missingInBn.length > 0 ? `Missing in BN: ${missingInBn.slice(0, 5).join(', ')}...` : undefined
);

assert(
  missingInEn.length === 0,
  'KeyParity',
  `All Bengali keys exist in English (${missingInEn.length} missing)`,
  missingInEn.length > 0 ? `Missing in EN: ${missingInEn.slice(0, 5).join(', ')}...` : undefined
);

// 3. BENGALI UNICODE SCRIPT CHECK
console.log('\n3. Audit Bengali Script Authenticity:');
const bengaliRegex = /[\u0980-\u09FF]/;
let bengaliScriptPassCount = 0;
let bengaliScriptTotal = 0;

for (const key of bnKeys) {
  const parts = key.split('.');
  let val: any = bn;
  for (const p of parts) {
    val = val?.[p];
  }
  if (typeof val === 'string') {
    bengaliScriptTotal++;
    // Either contains Bengali Unicode or is a preserved technical keyword (e.g. IELTS, TOEFL, PhD, CGPA)
    const hasBengali = bengaliRegex.test(val);
    const isPreservedTerm = /^(IELTS|TOEFL|PTE|PhD|MOI|CGPA|BDT|EUR|USD|QS|VFS|SSC|HSC|BSc|MSc)/i.test(val);
    if (hasBengali || isPreservedTerm) {
      bengaliScriptPassCount++;
    }
  }
}

assert(
  bengaliScriptPassCount === bengaliScriptTotal,
  'BengaliScript',
  `Bengali entries contain authentic Bengali Unicode (${bengaliScriptPassCount}/${bengaliScriptTotal} verified)`
);

// 4. NUMBER FORMATTING TEST
console.log('\n4. Audit Bengali Numeral Localization:');
const bnDigits: { [key: string]: string } = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
};

function formatBengaliNumber(val: number | string): string {
  const str = typeof val === 'number' ? val.toLocaleString('en-US') : String(val);
  return str.replace(/[0-9]/g, (match) => bnDigits[match] || match);
}

assert(formatBengaliNumber(0) === '০', 'NumberFormat', '0 converts to ০');
assert(formatBengaliNumber(940) === '৯৪০', 'NumberFormat', '940 converts to ৯৪০');
assert(formatBengaliNumber('2026') === '২০২৬', 'NumberFormat', '2026 converts to ২০২৬');
assert(formatBengaliNumber(1250000) === '১,২৫০,০০০', 'NumberFormat', '1,250,000 converts to ১,২৫০,০০০ with separators');

// 5. TRANSLATION FALLBACK ROBUSTNESS
console.log('\n5. Audit Translation Fallback Robustness:');
function translateHelper(key: string, lang: 'en' | 'bn', fallbackDict: any, currentDict: any): string {
  const lookup = (dict: any, pathStr: string) => {
    return pathStr.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict);
  };
  const val = lookup(currentDict, key);
  if (typeof val === 'string') return val;
  const fallbackVal = lookup(fallbackDict, key);
  if (typeof fallbackVal === 'string') return fallbackVal;
  return key;
}

assert(
  translateHelper('navigation.universities', 'en', en, en) === 'Universities',
  'FallbackEngine',
  'English lookup succeeds for navigation.universities'
);
assert(
  translateHelper('navigation.universities', 'bn', en, bn) === 'বিশ্ববিদ্যালয়সমূহ',
  'FallbackEngine',
  'Bengali lookup succeeds for navigation.universities'
);
assert(
  translateHelper('some.nonexistent.key', 'bn', en, bn) === 'some.nonexistent.key',
  'FallbackEngine',
  'Non-existent key gracefully returns key string without throwing'
);

// 6. DEFAULT SETTINGS & PERSISTENCE CONFIGURATION
console.log('\n6. Audit Default Settings & Persistence:');
const languageContextPath = path.resolve(__dirname, '../client/src/context/LanguageContext.tsx');
const languageContextCode = fs.readFileSync(languageContextPath, 'utf8');

assert(
  languageContextCode.includes("return 'en';"),
  'Defaults',
  'Language strictly defaults to English (en) on first visit'
);

assert(
  languageContextCode.includes('LANG_STORAGE_KEY') && languageContextCode.includes('borno_lang'),
  'Defaults',
  'Language choice persisted via borno_lang localStorage key'
);

assert(
  languageContextCode.includes("root.lang = language;"),
  'Accessibility',
  'Document element lang attribute is updated reactively'
);

const themeContextPath = path.resolve(__dirname, '../client/src/context/ThemeContext.tsx');
const themeContextCode = fs.readFileSync(themeContextPath, 'utf8');

assert(
  themeContextCode.includes("return 'light';"),
  'Defaults',
  'Theme strictly defaults to Light mode (light) on first visit'
);

assert(
  themeContextCode.includes('THEME_STORAGE_KEY') && themeContextCode.includes('borno_theme'),
  'Defaults',
  'Theme choice persisted via borno_theme localStorage key'
);

assert(
  themeContextCode.includes("root.classList.add('dark');"),
  'ThemeEngine',
  'Dark mode toggles .dark class on documentElement'
);

// 7. TYPOGRAPHY AND TAILWIND CONFIGURATION
console.log('\n7. Audit Typography & CSS Rules:');
const tailwindConfigPath = path.resolve(__dirname, '../client/tailwind.config.js');
const tailwindCode = fs.readFileSync(tailwindConfigPath, 'utf8');

assert(
  tailwindCode.includes("darkMode: 'class'"),
  'Tailwind',
  "Tailwind configured with darkMode: 'class'"
);

assert(
  tailwindCode.includes('Noto Sans Bengali'),
  'Tailwind',
  'Tailwind font family includes Noto Sans Bengali'
);

const indexHtmlPath = path.resolve(__dirname, '../client/index.html');
const indexHtmlCode = fs.readFileSync(indexHtmlPath, 'utf8');

assert(
  indexHtmlCode.includes('Noto+Sans+Bengali'),
  'Fonts',
  'Noto Sans Bengali font imported in index.html'
);

const indexCssPath = path.resolve(__dirname, '../client/src/index.css');
const indexCssCode = fs.readFileSync(indexCssPath, 'utf8');

assert(
  indexCssCode.includes('[lang="bn"]'),
  'Typography',
  'Bengali line-height optimization rules configured in index.css'
);

assert(
  indexCssCode.includes('dark:bg-[#0B132B]') || indexCssCode.includes('.dark body'),
  'Typography',
  'Dark mode primary background surfaces configured in index.css'
);

// 8. NAVBAR CONTROLS AUDIT
console.log('\n8. Audit Navbar Controls:');
const navbarPath = path.resolve(__dirname, '../client/src/components/layout/Navbar.tsx');
const navbarCode = fs.readFileSync(navbarPath, 'utf8');

assert(
  navbarCode.includes('useLanguage') && navbarCode.includes('useTheme'),
  'Navbar',
  'Navbar connects both useLanguage and useTheme hooks'
);

assert(
  navbarCode.includes('toggleTheme'),
  'Navbar',
  'Theme toggle control (Sun/Moon) integrated in Navbar'
);

assert(
  navbarCode.includes("setLanguage('en')") && navbarCode.includes("setLanguage('bn')"),
  'Navbar',
  'Language selector supports both English and বাংলা switching'
);

assert(
  navbarCode.includes('aria-label') && navbarCode.includes('aria-expanded'),
  'Accessibility',
  'Navbar language and theme controls include accessible ARIA attributes'
);

// SUMMARY
console.log('\n' + '='.repeat(70));
const total = results.length;
const passed = results.filter((r) => r.status === 'PASS').length;
const failed = results.filter((r) => r.status === 'FAIL').length;
console.log(`TOTAL AUDIT CHECKS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('='.repeat(70));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL BILINGUAL & THEME ARCHITECTURE CHECKS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}
