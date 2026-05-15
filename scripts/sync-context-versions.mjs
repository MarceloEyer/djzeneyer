#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const packageJsonPath = path.join(root, 'package.json');
const claudeMdPath = path.join(root, '.agents/personas/CLAUDE.md');
const geminiMdPath = path.join(root, '.agents/personas/GEMINI.md');

function cleanVersion(value) {
  return typeof value === 'string' ? value.replace(/^[~^]/, '') : 'N/A';
}

function replaceRequired(content, pattern, replacement, label, filePath) {
  if (!pattern.test(content)) {
    throw new Error(`${path.relative(root, filePath)}: missing expected ${label} block`);
  }

  return content.replace(pattern, replacement);
}

function syncClaude(pkg, deps) {
  if (!fs.existsSync(claudeMdPath)) {
    return;
  }

  let content = fs.readFileSync(claudeMdPath, 'utf8');
  const stackLine = `| Frontend | React ${cleanVersion(deps.react)}, React DOM ${cleanVersion(deps['react-dom'])}, TypeScript ${cleanVersion(deps.typescript)}, Vite ${cleanVersion(deps.vite)}, Tailwind ${cleanVersion(deps.tailwindcss)}, React Query ${cleanVersion(deps['@tanstack/react-query'])}, React Router ${cleanVersion(deps['react-router-dom'])}, i18next ${cleanVersion(deps.i18next)}, react-i18next ${cleanVersion(deps['react-i18next'])}, Framer Motion ${cleanVersion(deps['framer-motion'])} |`;
  const buildLine = `| Build e qualidade | ESLint ${cleanVersion(deps.eslint)}, Prettier ${cleanVersion(deps.prettier)}, Puppeteer ${cleanVersion(deps.puppeteer)}, OXC como minificador padrao do Vite 8 |`;
  const baseDepsLine = `| Dependencias basicas | dompurify ${cleanVersion(deps.dompurify)}, zod ${cleanVersion(deps.zod)}, lucide-react ${cleanVersion(deps['lucide-react'])} |`;

  content = replaceRequired(content, /^\| Frontend \| React.*\|$/m, stackLine, 'Frontend', claudeMdPath);
  content = replaceRequired(content, /^\| Build e qualidade \| ESLint.*\|$/m, buildLine, 'Build e qualidade', claudeMdPath);
  content = replaceRequired(content, /^\| Dependencias basicas \| dompurify.*\|$/m, baseDepsLine, 'Dependencias basicas', claudeMdPath);

  const overrides = Object.entries(pkg.overrides ?? {});
  const overridesBlock = [
    'Overrides atualmente presentes em `package.json`:',
    ...(overrides.length > 0
      ? overrides.map(([name, version]) => `- \`${name}\`: \`${version}\``)
      : ['- Nenhum override ativo.']),
    '',
  ].join('\n');

  content = replaceRequired(
    content,
    /Overrides atualmente presentes em `package\.json`:\r?\n(?:- .*\r?\n)*/m,
    overridesBlock,
    'package overrides',
    claudeMdPath,
  );

  fs.writeFileSync(claudeMdPath, content);
  console.log('[context-sync] CLAUDE.md synchronized.');
}

function syncGemini(deps) {
  if (!fs.existsSync(geminiMdPath)) {
    return;
  }

  let content = fs.readFileSync(geminiMdPath, 'utf8');
  const stackLine = `| Frontend | React ${cleanVersion(deps.react)}, TypeScript ${cleanVersion(deps.typescript)}, Vite ${cleanVersion(deps.vite)}, Tailwind ${cleanVersion(deps.tailwindcss)}, React Query ${cleanVersion(deps['@tanstack/react-query'])}, React Router ${cleanVersion(deps['react-router-dom'])}, i18next ${cleanVersion(deps.i18next)} |`;
  const buildLine = `| Build | ESLint ${cleanVersion(deps.eslint)}, Prettier ${cleanVersion(deps.prettier)}, Puppeteer ${cleanVersion(deps.puppeteer)}, OXC como minificador padrao |`;

  content = replaceRequired(content, /^\| Frontend \| React.*\|$/m, stackLine, 'Frontend', geminiMdPath);
  content = replaceRequired(content, /^\| Build \| ESLint.*\|$/m, buildLine, 'Build', geminiMdPath);

  fs.writeFileSync(geminiMdPath, content);
  console.log('[context-sync] GEMINI.md synchronized.');
}

function sync() {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  syncClaude(pkg, deps);
  syncGemini(deps);
}

try {
  sync();
} catch (err) {
  console.error(`[context-sync] ${err.message}`);
  process.exit(1);
}
