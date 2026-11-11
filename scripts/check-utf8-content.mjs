#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TextDecoder } from 'node:util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const decoder = new TextDecoder('utf-8', { fatal: true });

const textExtensions = new Set([
  '.cjs',
  '.css',
  '.csv',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.php',
  '.sh',
  '.svg',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
]);

const textFilenames = new Set([
  '.coderabbit.yaml',
  '.editorconfig',
  '.env.example',
  '.gitattributes',
  '.gitignore',
  '.htaccess',
  'AGENTS.md',
]);

const skippedPrefixes = [
  '.claude/worktrees/',
  '.git/',
  'build/',
  'coverage/',
  'dist/',
  'node_modules/',
  'vendor/',
  'vendor-bin/',
];

const suspiciousPatterns = [
  {
    name: 'replacement character',
    regex: /\uFFFD/g,
  },
  {
    name: 'UTF-8 decoded as Windows-1252/Latin-1',
    regex:
      /(?:\u00c3[\u0080-\u00bf]|\u00c2[\u0080-\u00bf]|\u00e2(?:[\u0080-\u00bf]|\u20ac[\u0080-\u00bf\u2018-\u201d\u2020\u2021\u2026\u2122]?)|\u00f0\u0178|\u00c3\u0192|\u00c3\u201a|\u00c3\u00a2|\u00c3\u00b0\u00c5\u00b8)/g,
  },
  {
    name: 'mojibake IPA pronunciation',
    regex: /(?:z\u00c9\u203a|\u00cb\u02c6|a\u00c9\u00aa|\u00c9\u2122)/g,
  },
];

function normalizeGitPath(filePath) {
  return filePath.replaceAll('\\', '/');
}

function isTextFile(filePath) {
  const basename = path.basename(filePath);
  return textFilenames.has(basename) || textExtensions.has(path.extname(filePath).toLowerCase());
}

function shouldSkip(filePath) {
  const normalizedPath = normalizeGitPath(filePath);
  return skippedPrefixes.some((prefix) => normalizedPath.startsWith(prefix));
}

function getTrackedFiles() {
  const output = execFileSync('git', ['ls-files', '-z'], { cwd: root });
  return output
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .filter((filePath) => isTextFile(filePath) && !shouldSkip(filePath));
}

function getLine(content, index) {
  const lineNumber = content.slice(0, index).split(/\r?\n/).length;
  const lineText = content.split(/\r?\n/)[lineNumber - 1]?.trim() ?? '';
  return { lineNumber, lineText };
}

const failures = [];
const files = getTrackedFiles();

for (const relativePath of files) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    continue;
  }

  const bytes = fs.readFileSync(absolutePath);
  let content;

  try {
    content = decoder.decode(bytes);
  } catch (error) {
    failures.push(`${relativePath}: invalid UTF-8 bytes (${error.message})`);
    continue;
  }

  for (const { name, regex } of suspiciousPatterns) {
    for (const match of content.matchAll(regex)) {
      const { lineNumber, lineText } = getLine(content, match.index);
      failures.push(`${relativePath}:${lineNumber}: ${name} marker ${JSON.stringify(match[0])} in: ${lineText}`);
    }
  }
}

if (failures.length > 0) {
  console.error('[utf8-content-check] Suspicious UTF-8/mojibake markers found:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`[utf8-content-check] OK: ${files.length} tracked text files checked.`);
