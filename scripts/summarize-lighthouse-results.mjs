#!/usr/bin/env node
/**
 * Summarizes local Lighthouse CI JSON reports for GitHub Actions output.
 */

import fs from 'fs';
import path from 'path';

const REPORT_DIR = path.resolve(process.cwd(), '.lighthouseci');
const AUDITS_TO_TRACK = [
  'cache-insight',
  'categories.best-practices',
  'deprecations',
  'lcp-discovery-insight',
  'network-dependency-tree-insight',
  'render-blocking-insight',
  'render-blocking-resources',
  'unused-javascript',
  'cumulative-layout-shift',
  'cls-culprits-insight',
  'non-composited-animations',
  'long-tasks',
];

function scorePercent(score) {
  if (typeof score !== 'number') return 'n/a';
  return String(Math.round(score * 100));
}

function loadReports() {
  if (!fs.existsSync(REPORT_DIR)) return [];

  return fs.readdirSync(REPORT_DIR)
    .filter((file) => file.endsWith('.json'))
    .flatMap((file) => {
      const filePath = path.join(REPORT_DIR, file);
      try {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const lhr = parsed.lhr ?? parsed;
        return lhr?.categories && lhr?.audits ? [{ file, lhr }] : [];
      } catch (err) {
        console.warn(`[lighthouse-summary] Could not parse ${filePath}: ${err.message}`);
        return [];
      }
    });
}

function medianScore(scores) {
  const numericScores = scores.filter((score) => typeof score === 'number').sort((a, b) => a - b);
  if (numericScores.length === 0) return null;
  return numericScores[Math.floor(numericScores.length / 2)];
}

function groupByUrl(reports) {
  const groups = new Map();
  for (const { file, lhr } of reports) {
    const url = lhr.finalUrl || lhr.requestedUrl || file;
    const current = groups.get(url) ?? [];
    current.push(lhr);
    groups.set(url, current);
  }
  return groups;
}

function auditStatus(lhr, auditId) {
  if (auditId.startsWith('categories.')) {
    const categoryId = auditId.split('.')[1];
    const category = lhr.categories?.[categoryId];
    if (!category || typeof category.score !== 'number' || category.score >= 0.9) return null;
    return {
      id: auditId,
      title: category.title || categoryId,
      detail: `score ${scorePercent(category.score)}`,
    };
  }

  const audit = lhr.audits?.[auditId];
  if (!audit || audit.score === null || audit.score === 1) return null;

  return {
    id: auditId,
    title: audit.title || auditId,
    detail: audit.displayValue || `score ${scorePercent(audit.score)}`,
  };
}

function buildSummary(reports) {
  if (reports.length === 0) {
    return [
      '## Lighthouse Summary',
      '',
      'No `.lighthouseci` JSON reports were found.',
      '',
    ].join('\n');
  }

  const groups = groupByUrl(reports);
  const lines = [
    '## Lighthouse Summary',
    '',
    '| URL | Runs | Perf | A11y | Best Practices | SEO |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
  ];

  for (const [url, lhrs] of groups) {
    const perf = medianScore(lhrs.map((lhr) => lhr.categories.performance?.score));
    const a11y = medianScore(lhrs.map((lhr) => lhr.categories.accessibility?.score));
    const best = medianScore(lhrs.map((lhr) => lhr.categories['best-practices']?.score));
    const seo = medianScore(lhrs.map((lhr) => lhr.categories.seo?.score));
    lines.push(`| ${url} | ${lhrs.length} | ${scorePercent(perf)} | ${scorePercent(a11y)} | ${scorePercent(best)} | ${scorePercent(seo)} |`);
  }

  lines.push('', '### Tracked Warnings', '');

  let warningCount = 0;
  for (const [url, lhrs] of groups) {
    const warnings = new Map();
    for (const lhr of lhrs) {
      for (const auditId of AUDITS_TO_TRACK) {
        const status = auditStatus(lhr, auditId);
        if (status) warnings.set(status.id, status);
      }
    }

    if (warnings.size === 0) continue;
    warningCount += warnings.size;
    lines.push(`#### ${url}`);
    for (const warning of warnings.values()) {
      lines.push(`- \`${warning.id}\`: ${warning.title} (${warning.detail})`);
    }
    lines.push('');
  }

  if (warningCount === 0) {
    lines.push('No tracked Lighthouse warnings were found.', '');
  }

  return lines.join('\n');
}

const summary = buildSummary(loadReports());
console.log(summary);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}
