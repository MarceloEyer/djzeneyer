# GitHub-first automation setup

This repository should prefer GitHub-hosted automation over local agent execution. The goal is to reduce paid assistant tokens while keeping quality gates strong.

## Default operating policy

- Agents should make focused edits, open a PR, and let GitHub Actions validate.
- Agents should not run local builds, tests, Lighthouse, Composer updates, or broad audits unless the maintainer explicitly asks.
- If CI fails, inspect only the failing GitHub log and patch the smallest cause.
- Prefer auto-merge for low-risk PRs once required checks pass.
- Keep PRs small so CodeRabbit, CodeQL, Snyk, Dependabot, Renovate/Jules, and GitHub Actions can review them cheaply.

## What is already configured

- GitHub Actions quality gate, tests, deploys, CodeQL, Snyk, Dependabot, Lighthouse Audit, and Maintenance Audit.
- CodeRabbit status checks are present on PRs.
- Dependabot groups npm patch/minor updates and checks Composer/GitHub Actions weekly.

## Recommended third-party services

1. CodeRabbit
   - Site: https://www.coderabbit.ai/
   - GitHub Marketplace: https://github.com/marketplace/coderabbitai
   - Recommended use: first-pass PR review, risk summaries, security and maintainability comments.
   - Configure it to review PRs automatically and avoid blocking auto-merge on purely advisory comments unless the finding is serious.

2. Jules by Google
   - Site: https://jules.google/
   - Docs: https://jules.google/docs
   - Recommended use: asynchronous GitHub tasks, issue-to-PR work, CI failure fixes, documentation updates, and small chores.
   - Add the repository in Jules, then use issues/labels for delegated tasks. Keep `.jules/instructions.md` as the source of Jules-specific rules.

3. Renovate
   - GitHub App: https://github.com/apps/renovate
   - Recommended use: smarter dependency grouping than Dependabot when dependency noise becomes expensive.
   - Start with dry/advisory mode or conservative grouping; do not allow major updates to auto-merge.

4. Snyk
   - Site: https://snyk.io/
   - GitHub Marketplace: https://github.com/marketplace/snyk
   - Recommended use: dependency and code security scanning. Keep free-plan limits in mind.

## Maintainer setup checklist

1. GitHub branch protection
   - Open the repository on GitHub.
   - Go to Settings > Branches > Branch protection rules.
   - Protect `main`.
   - Require status checks for the existing quality/test/security checks.
   - Add Lighthouse checks after they are stable.
   - Allow auto-merge.

2. GitHub Actions
   - Go to Settings > Actions > General.
   - Allow GitHub Actions and marketplace actions.
   - Enable "Allow auto-merge" under repository settings if not already enabled.

3. CodeRabbit
   - Install the GitHub app from Marketplace.
   - Grant repository access to `djzeneyer`.
   - Enable automatic PR reviews.
   - Keep reviews advisory unless a blocking mode is intentionally configured.

4. Jules
   - Visit https://jules.google/.
   - Connect the GitHub account.
   - Grant access to this repository.
   - Confirm Jules reads `.jules/instructions.md`.
   - Use Jules mainly for tasks that can wait for cloud execution.

5. Renovate
   - Install the Renovate GitHub App if dependency PR volume becomes noisy.
   - Keep Dependabot enabled for security.
   - Configure Renovate to group low-risk patch/minor updates and separate majors.

6. Manual audits
   - Open Actions > Maintenance Audit.
   - Click "Run workflow".
   - Leave Lighthouse and Composer enabled unless you want a faster run.
   - Let the workflow produce failures/logs for agents to inspect later.
