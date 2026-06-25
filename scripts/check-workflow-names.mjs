import fs from 'fs';
import path from 'path';

const expectedNames = [
  {
    file: '.github/workflows/deploy-frontend.yml',
    patterns: [
      /^name:\s*🚀 Deploy Frontend\s*$/m,
      /^\s+name:\s*🏗️ Build & Deploy · React\/Vite → Hostinger\s*$/m,
    ],
  },
  {
    file: '.github/workflows/deploy-backend.yml',
    patterns: [
      /^name:\s*🐘 Deploy · Backend PHP\s*$/m,
      /^\s+name:\s*🚀 Deploy WP Plugins and Theme PHP\s*$/m,
    ],
  },
  {
    file: '.github/workflows/lighthouse.yml',
    patterns: [
      /^name:\s*Lighthouse Audit\s*$/m,
      /workflows:\s*\["🚀 Deploy Frontend"\]/,
    ],
  },
];

const failures = [];

for (const { file, patterns } of expectedNames) {
  const absolutePath = path.resolve(file);
  const content = fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';

  if (!content) {
    failures.push(`${file}: file not found or empty`);
    continue;
  }

  for (const pattern of patterns) {
    if (!pattern.test(content)) {
      failures.push(`${file}: missing expected workflow/job name pattern ${pattern}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Workflow name check failed. Deploy workflow/job names are integration contracts.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Workflow name check passed.');
