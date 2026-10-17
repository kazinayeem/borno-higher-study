import fs from 'fs';
import path from 'path';

function getAllFiles(dir: string, ext = ['.tsx', '.ts']): string[] {
  let files: string[] = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(getAllFiles(full, ext));
    } else if (ext.some(e => full.endsWith(e))) {
      files.push(full);
    }
  }
  return files;
}

// 1. Get routes from App.tsx
const appTsx = fs.readFileSync('client/src/App.tsx', 'utf-8');
const definedRoutes = new Set(
  [...appTsx.matchAll(/path=[\"']([^\"']+)[\"']/g)].map(m => m[1])
);

console.log(`Loaded ${definedRoutes.size} route patterns from App.tsx`);

// Helper to check if a concrete path matches any route pattern in App.tsx
function matchesRoute(concretePath: string): boolean {
  if (concretePath === '' || concretePath === '/') return true;
  // Clean query strings and hashes
  const clean = concretePath.split(/[?#]/)[0];
  
  if (definedRoutes.has(clean)) return true;

  for (const route of definedRoutes) {
    if (route.includes(':')) {
      // Convert e.g. /countries/:slug -> ^/countries/[^/]+$
      const regexStr = '^' + route.replace(/:[a-zA-Z0-9_]+/g, '[^/]+') + '$';
      const regex = new RegExp(regexStr);
      if (regex.test(clean)) return true;
    }
  }
  return false;
}

const files = getAllFiles('client/src');
interface DetectedLink {
  file: string;
  line: number;
  type: 'INTERNAL_STATIC' | 'INTERNAL_DYNAMIC' | 'EXTERNAL' | 'HASH_OR_EMPTY';
  target: string;
  rawSnippet: string;
}

const detected: DetectedLink[] = [];

for (const file of files) {
  const relFile = path.relative('.', file);
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // 1. match to="..."
    const toMatches = [...line.matchAll(/to=[\"']([^\"']+)[\"']/g)];
    for (const m of toMatches) {
      const target = m[1];
      detected.push({
        file: relFile,
        line: idx + 1,
        type: target.startsWith('/') ? 'INTERNAL_STATIC' : (target.startsWith('http') ? 'EXTERNAL' : 'HASH_OR_EMPTY'),
        target,
        rawSnippet: line.trim()
      });
    }

    // 2. match to={`...`}
    const toTemplateMatches = [...line.matchAll(/to=\{`([^`]+)`\}/g)];
    for (const m of toTemplateMatches) {
      detected.push({
        file: relFile,
        line: idx + 1,
        type: 'INTERNAL_DYNAMIC',
        target: m[1],
        rawSnippet: line.trim()
      });
    }

    // 3. match href="..."
    const hrefMatches = [...line.matchAll(/href=[\"']([^\"']+)[\"']/g)];
    for (const m of hrefMatches) {
      const target = m[1];
      if (target.startsWith('/') && !target.startsWith('//')) {
        detected.push({
          file: relFile,
          line: idx + 1,
          type: 'INTERNAL_STATIC',
          target,
          rawSnippet: line.trim()
        });
      } else if (target.startsWith('http://') || target.startsWith('https://')) {
        detected.push({
          file: relFile,
          line: idx + 1,
          type: 'EXTERNAL',
          target,
          rawSnippet: line.trim()
        });
      } else {
        detected.push({
          file: relFile,
          line: idx + 1,
          type: 'HASH_OR_EMPTY',
          target,
          rawSnippet: line.trim()
        });
      }
    }

    // 4. match navigate("...")
    const navMatches = [...line.matchAll(/navigate\([\"']([^\"']+)[\"']/g)];
    for (const m of navMatches) {
      const target = m[1];
      detected.push({
        file: relFile,
        line: idx + 1,
        type: target.startsWith('/') ? 'INTERNAL_STATIC' : 'INTERNAL_DYNAMIC',
        target,
        rawSnippet: line.trim()
      });
    }
  });
}

console.log(`Discovered ${detected.length} total link instances in client code.`);

const invalidInternal: DetectedLink[] = [];
const externalInCode: DetectedLink[] = [];
const hashOrEmpty: DetectedLink[] = [];

for (const link of detected) {
  if (link.type === 'INTERNAL_STATIC') {
    if (!matchesRoute(link.target)) {
      invalidInternal.push(link);
    }
  } else if (link.type === 'EXTERNAL') {
    externalInCode.push(link);
  } else if (link.type === 'HASH_OR_EMPTY') {
    hashOrEmpty.push(link);
  }
}

console.log(`\n--- AUDIT SUMMARY FOR CLIENT CODEBASE ---`);
console.log(`Invalid / Unmatched Internal Static Routes: ${invalidInternal.length}`);
invalidInternal.forEach(i => {
  console.log(`  ❌ ${i.file}:${i.line} -> target: "${i.target}" | snippet: ${i.rawSnippet.slice(0, 80)}`);
});

console.log(`\nExternal URLs in Code: ${externalInCode.length}`);
externalInCode.forEach(e => {
  console.log(`  🌐 ${e.file}:${e.line} -> ${e.target}`);
});

console.log(`\nHash or Empty Hrefs (potential dead links): ${hashOrEmpty.length}`);
hashOrEmpty.forEach(h => {
  console.log(`  ⚠️ ${h.file}:${h.line} -> "${h.target}" | snippet: ${h.rawSnippet.slice(0, 80)}`);
});

const dynamicPatterns = new Set<string>();
for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = [...content.matchAll(/to=\{`([^`]+)`\}/g)];
  for (const m of matches) {
    dynamicPatterns.add(m[1]);
  }
}
console.log(`\nDynamic Link Template Patterns (${dynamicPatterns.size}):`);
dynamicPatterns.forEach(p => console.log(`  🔹 ${p}`));

