import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const manifestPath = path.join(distDir, '.vite', 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('manifest not found: dist/.vite/manifest.json');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const budget = {
  maxInitialJsGzip: Number(process.env.PERF_BUDGET_INITIAL_JS_GZIP || 181 * 1024),
  maxEntryJsGzip: Number(process.env.PERF_BUDGET_ENTRY_JS_GZIP || 130 * 1024),
  maxI18nChunkGzip: Number(process.env.PERF_BUDGET_I18N_GZIP || 55 * 1024),
  maxLargestChunkGzip: Number(process.env.PERF_BUDGET_LARGEST_CHUNK_GZIP || 120 * 1024),
};

const sizeOf = (relPath) => {
  const p = path.join(distDir, relPath);
  return fs.existsSync(p) ? fs.statSync(p).size : 0;
};

const gzipSizeOf = (relPath) => {
  const p = path.join(distDir, `${relPath}.gz`);
  return fs.existsSync(p) ? fs.statSync(p).size : 0;
};

const entryKeys = Object.keys(manifest).filter((k) => manifest[k]?.isEntry && manifest[k]?.file);
if (entryKeys.length === 0) {
  console.error('no manifest entry files found');
  process.exit(1);
}

const walkImports = (key, visited = new Set()) => {
  if (visited.has(key)) return visited;
  visited.add(key);
  const imports = manifest[key]?.imports || [];
  for (const dep of imports) {
    walkImports(dep, visited);
  }
  return visited;
};

const initialKeys = new Set();
for (const key of entryKeys) {
  for (const dep of walkImports(key)) {
    initialKeys.add(dep);
  }
}

const jsFiles = Object.values(manifest)
  .map((item) => item?.file)
  .filter((f) => typeof f === 'string' && f.endsWith('.js'));

const initialJsFiles = [...initialKeys]
  .map((k) => manifest[k]?.file)
  .filter((f) => typeof f === 'string' && f.endsWith('.js'));

const initialJsGzip = initialJsFiles.reduce((acc, file) => acc + gzipSizeOf(file), 0);
const entryJsGzip = entryKeys.reduce((acc, key) => acc + gzipSizeOf(manifest[key].file), 0);

let largestChunk = { file: '', gzip: 0, raw: 0 };
for (const file of jsFiles) {
  const gz = gzipSizeOf(file);
  if (gz > largestChunk.gzip) {
    largestChunk = { file, gzip: gz, raw: sizeOf(file) };
  }
}

const i18nChunk = jsFiles
  .map((file) => ({ file, gzip: gzipSizeOf(file) }))
  .find((c) => c.file.toLowerCase().includes('i18n'));

const failures = [];
if (initialJsGzip > budget.maxInitialJsGzip) {
  failures.push(`Initial JS gzip ${initialJsGzip} > ${budget.maxInitialJsGzip}`);
}
if (entryJsGzip > budget.maxEntryJsGzip) {
  failures.push(`Entry JS gzip ${entryJsGzip} > ${budget.maxEntryJsGzip}`);
}
if (largestChunk.gzip > budget.maxLargestChunkGzip) {
  failures.push(`Largest chunk gzip (${largestChunk.file}) ${largestChunk.gzip} > ${budget.maxLargestChunkGzip}`);
}
if (i18nChunk && i18nChunk.gzip > budget.maxI18nChunkGzip) {
  failures.push(`i18n chunk gzip (${i18nChunk.file}) ${i18nChunk.gzip} > ${budget.maxI18nChunkGzip}`);
}

console.log('Performance budgets');
console.log(`- Initial JS gzip: ${initialJsGzip} (max ${budget.maxInitialJsGzip})`);
console.log(`- Entry JS gzip: ${entryJsGzip} (max ${budget.maxEntryJsGzip})`);
console.log(`- Largest chunk gzip: ${largestChunk.gzip} (${largestChunk.file}) (max ${budget.maxLargestChunkGzip})`);
if (i18nChunk) {
  console.log(`- i18n chunk gzip: ${i18nChunk.gzip} (${i18nChunk.file}) (max ${budget.maxI18nChunkGzip})`);
}

if (failures.length > 0) {
  console.error('Performance budget check failed:');
  for (const msg of failures) {
    console.error(`- ${msg}`);
  }
  process.exit(1);
}

console.log('Performance budget check passed.');

