import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const manifestPath = path.join(distDir, '.vite', 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('manifest not found: dist/.vite/manifest.json');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const getSize = (relPath) => {
  const filePath = path.join(distDir, relPath);
  if (!fs.existsSync(filePath)) return 0;
  return fs.statSync(filePath).size;
};

const getCompressedSize = (relPath, ext) => {
  const filePath = path.join(distDir, `${relPath}${ext}`);
  if (!fs.existsSync(filePath)) return 0;
  return fs.statSync(filePath).size;
};

const findEntryKeys = () =>
  Object.keys(manifest).filter((k) => manifest[k]?.isEntry && typeof manifest[k]?.file === 'string');

const walkStaticImports = (entryKey, visited = new Set()) => {
  if (visited.has(entryKey)) return visited;
  visited.add(entryKey);

  const node = manifest[entryKey];
  const imports = node?.imports || [];
  for (const dep of imports) {
    walkStaticImports(dep, visited);
  }

  return visited;
};

const toRows = (keys) => {
  const rows = [];

  for (const key of keys) {
    const item = manifest[key];
    if (!item?.file) continue;

    rows.push({
      key,
      file: item.file,
      raw: getSize(item.file),
      gzip: getCompressedSize(item.file, '.gz'),
      brotli: getCompressedSize(item.file, '.br'),
      isEntry: !!item.isEntry,
      isDynamicEntry: !!item.isDynamicEntry,
    });
  }

  return rows.sort((a, b) => b.raw - a.raw);
};

const sum = (items, field) => items.reduce((acc, cur) => acc + (cur[field] || 0), 0);

const entryKeys = findEntryKeys();
const allRows = toRows(Object.keys(manifest));
const jsRows = allRows.filter((r) => r.file.endsWith('.js'));
const cssRows = allRows.filter((r) => r.file.endsWith('.css'));

const entryImportKeys = new Set();
for (const entry of entryKeys) {
  for (const k of walkStaticImports(entry)) {
    entryImportKeys.add(k);
  }
}
const initialRows = toRows([...entryImportKeys]).filter((r) => r.file.endsWith('.js'));

const report = {
  generatedAt: new Date().toISOString(),
  entryKeys,
  totals: {
    jsRaw: sum(jsRows, 'raw'),
    jsGzip: sum(jsRows, 'gzip'),
    jsBrotli: sum(jsRows, 'brotli'),
    cssRaw: sum(cssRows, 'raw'),
    cssGzip: sum(cssRows, 'gzip'),
    cssBrotli: sum(cssRows, 'brotli'),
    initialJsRaw: sum(initialRows, 'raw'),
    initialJsGzip: sum(initialRows, 'gzip'),
    initialJsBrotli: sum(initialRows, 'brotli'),
  },
  topJsByRaw: jsRows.slice(0, 12),
  initialJsRows: initialRows,
};

const outDir = path.resolve('.agents');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'perf-baseline.json'), JSON.stringify(report, null, 2));

console.log('Performance baseline generated: .agents/perf-baseline.json');
console.log(`Initial JS: ${report.totals.initialJsRaw} B raw | ${report.totals.initialJsGzip} B gzip | ${report.totals.initialJsBrotli} B brotli`);
console.log(`Total JS  : ${report.totals.jsRaw} B raw | ${report.totals.jsGzip} B gzip | ${report.totals.jsBrotli} B brotli`);
