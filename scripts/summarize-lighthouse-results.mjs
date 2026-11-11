#!/usr/bin/env node
/**
 * Summarizes Lighthouse CI JSON reports for the GitHub Actions job summary.
 *
 * Output (markdown): scores per URL with status icons, Core Web Vitals,
 * console errors (the usual cause of a red run), and the biggest
 * opportunities. Medians are used across runs to reduce noise.
 */

import fs from 'fs';
import path from 'path';

const REPORT_DIR = path.resolve(process.cwd(), '.lighthouseci');
const PROFILE = process.env.LIGHTHOUSE_PROFILE || 'desktop';

// Mirrors the minScore assertions in lighthouserc.cjs (used only for the icons).
const THRESHOLDS = {
  performance: PROFILE === 'mobile' ? 0.55 : 0.75,
  accessibility: 0.85,
  'best-practices': 0.85,
  seo: 0.8,
};

// Lighthouse "good" / "needs improvement" boundaries (ms, except CLS).
const VITALS = [
  { id: 'first-contentful-paint', label: 'FCP', good: 1800, poor: 3000, unit: 's' },
  { id: 'largest-contentful-paint', label: 'LCP', good: 2500, poor: 4000, unit: 's' },
  { id: 'total-blocking-time', label: 'TBT', good: 200, poor: 600, unit: 'ms' },
  { id: 'cumulative-layout-shift', label: 'CLS', good: 0.1, poor: 0.25, unit: '' },
  { id: 'speed-index', label: 'SI', good: 3400, poor: 5800, unit: 's' },
];

const TRACKED_AUDITS = [
  'cache-insight',
  'deprecations',
  'cls-culprits-insight',
  'non-composited-animations',
  'long-tasks',
  'color-contrast',
  'target-size',
  'image-delivery-insight',
  'inspector-issues',
];

const pct = (score) => (typeof score === 'number' ? Math.round(score * 100) : null);

function median(values) {
  const nums = values.filter((v) => typeof v === 'number').sort((a, b) => a - b);
  if (nums.length === 0) return null;
  const middle = Math.floor(nums.length / 2);
  return nums.length % 2 === 0 ? (nums[middle - 1] + nums[middle]) / 2 : nums[middle];
}

function icon(score, min) {
  if (typeof score !== 'number') return '⚪';
  if (score < min) return '🔴';
  return score >= 0.9 ? '🟢' : '🟡';
}

function scoreCell(score, min) {
  const value = pct(score);
  return value === null ? '⚪ n/a' : `${icon(score, min)} ${value}`;
}

function vitalCell(value, vital) {
  if (typeof value !== 'number') return '⚪ n/a';
  const status = value <= vital.good ? '🟢' : value <= vital.poor ? '🟡' : '🔴';
  if (vital.id === 'cumulative-layout-shift') return `${status} ${value.toFixed(3)}`;
  if (vital.unit === 's') return `${status} ${(value / 1000).toFixed(1)} s`;
  return `${status} ${Math.round(value)} ms`;
}

function shortUrl(url) {
  try {
    const u = new URL(url);
    return `${u.pathname}${u.search.replace(/lhci=[^&]*&?/, '')}`.replace(/\?$/, '') || '/';
  } catch {
    return url;
  }
}

function loadReports() {
  if (!fs.existsSync(REPORT_DIR)) return [];

  return fs.readdirSync(REPORT_DIR)
    .filter((file) => file.endsWith('.json') && file.startsWith('lhr-'))
    .flatMap((file) => {
      const filePath = path.join(REPORT_DIR, file);
      try {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const lhr = parsed.lhr ?? parsed;
        return lhr?.categories && lhr?.audits ? [lhr] : [];
      } catch (err) {
        console.warn(`[lighthouse-summary] Could not parse ${filePath}: ${err.message}`);
        return [];
      }
    });
}

function groupByUrl(lhrs) {
  const groups = new Map();
  for (const lhr of lhrs) {
    const url = lhr.finalUrl || lhr.requestedUrl;
    groups.set(url, [...(groups.get(url) ?? []), lhr]);
  }
  return groups;
}

function consoleErrors(lhrs) {
  const seen = new Map();
  for (const lhr of lhrs) {
    for (const item of lhr.audits?.['errors-in-console']?.details?.items ?? []) {
      const text = String(item.description || item.sourceLocation?.url || 'unknown error')
        .replace(/\s+/g, ' ')
        .slice(0, 220);
      seen.set(text, (seen.get(text) ?? 0) + 1);
    }
  }
  return [...seen.entries()];
}

function opportunities(lhrs) {
  const best = new Map();
  for (const lhr of lhrs) {
    for (const audit of Object.values(lhr.audits ?? {})) {
      const saving = audit.details?.overallSavingsMs;
      if (typeof saving !== 'number' || saving < 150) continue;
      const current = best.get(audit.id);
      if (!current || saving > current.saving) {
        best.set(audit.id, { title: audit.title, saving });
      }
    }
  }
  return [...best.values()].sort((a, b) => b.saving - a.saving).slice(0, 3);
}

function trackedWarnings(lhrs) {
  const found = new Map();
  for (const lhr of lhrs) {
    for (const id of TRACKED_AUDITS) {
      const audit = lhr.audits?.[id];
      if (!audit || audit.score === null || audit.score === undefined || audit.score >= 1) continue;
      found.set(id, `${audit.title}${audit.displayValue ? ` (${audit.displayValue})` : ''}`);
    }
  }
  return [...found.entries()];
}

function buildSummary(lhrs) {
  const heading = `## Lighthouse · ${PROFILE} · produção`;
  if (lhrs.length === 0) {
    return `${heading}\n\nNenhum relatório \`.lighthouseci\` foi encontrado (a coleta falhou antes de gerar resultados).\n`;
  }

  const groups = groupByUrl(lhrs);
  const lines = [
    heading,
    '',
    `Mediana de ${lhrs.length} execuções em ${groups.size} páginas. 🟢 ≥ 90 · 🟡 abaixo de 90 · 🔴 abaixo do mínimo configurado (` +
      `perf ${pct(THRESHOLDS.performance)}, a11y ${pct(THRESHOLDS.accessibility)}, boas práticas ${pct(THRESHOLDS['best-practices'])}, SEO ${pct(THRESHOLDS.seo)}).`,
    '',
    '### Notas',
    '',
    '| Página | Performance | Acessibilidade | Boas práticas | SEO |',
    '| --- | ---: | ---: | ---: | ---: |',
  ];

  for (const [url, runs] of groups) {
    const cell = (key) => scoreCell(median(runs.map((r) => r.categories[key]?.score)), THRESHOLDS[key]);
    lines.push(`| \`${shortUrl(url)}\` | ${cell('performance')} | ${cell('accessibility')} | ${cell('best-practices')} | ${cell('seo')} |`);
  }

  lines.push('', '### Core Web Vitals (mediana)', '', `| Página | ${VITALS.map((v) => v.label).join(' | ')} |`, `| --- | ${VITALS.map(() => '---:').join(' | ')} |`);
  for (const [url, runs] of groups) {
    const cells = VITALS.map((v) => vitalCell(median(runs.map((r) => r.audits?.[v.id]?.numericValue)), v));
    lines.push(`| \`${shortUrl(url)}\` | ${cells.join(' | ')} |`);
  }

  const problems = [];
  for (const [url, runs] of groups) {
    const errors = consoleErrors(runs);
    const warnings = trackedWarnings(runs);
    const tips = opportunities(runs);
    if (!errors.length && !warnings.length && !tips.length) continue;

    problems.push(`#### \`${shortUrl(url)}\``);
    if (errors.length) {
      problems.push('**Erros no console (derrubam o check):**');
      for (const [text, count] of errors) problems.push(`- ${text} (${count}×)`);
    }
    if (tips.length) {
      problems.push('**Maiores ganhos possíveis:**');
      for (const tip of tips) problems.push(`- ${tip.title}: ~${(tip.saving / 1000).toFixed(1)} s`);
    }
    if (warnings.length) {
      problems.push('**Avisos acompanhados:**');
      for (const [id, text] of warnings) problems.push(`- \`${id}\`: ${text}`);
    }
    problems.push('');
  }

  lines.push('', '### O que corrigir', '');
  lines.push(...(problems.length ? problems : ['Nada a corrigir nas métricas acompanhadas. ✅', '']));
  lines.push('_Relatórios completos: artefato `lighthouse-*` desta execução._', '');

  return lines.join('\n');
}

const summary = buildSummary(loadReports());
console.log(summary);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}
