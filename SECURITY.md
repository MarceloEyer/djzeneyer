# Security Policy

## Supported Versions

The following versions of **DJ Zen Eyer** project are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

If you discover a potential security vulnerability in this project, please report it responsibly by:

1.  **Emailing**: [booking@djzeneyer.com](mailto:booking@djzeneyer.com)
2.  **Subject**: `SECURITY VULNERABILITY - [Brief Description]`
3.  **Details**: Provide a detailed description of the vulnerability, including steps to reproduce it and its potential impact.

Please **do not** open a public issue on GitHub for security vulnerabilities. We will acknowledge your report within 48 hours and provide a timeline for a fix.

## Security Practices

-   **Secret Management**: We use GitHub Secrets for all sensitive credentials.
-   **Dependency Scanning**: Dependabot is active and monitored.
-   **JWT Auth**: We follow industry standards for JWT implementation in the `zeneyer-auth` plugin.

## Dependencies and updates

This project uses GitHub Dependabot to keep dependencies up to date. Configuration lives at `.github/dependabot.yml`.

### Triage process

1. Let all CI and quality gate checks run — tests, type checks, i18n, UTF-8, perf budget, and sitemap validation must pass.
2. Review the changelog of each upgraded package, with extra care for:
   - WordPress-related plugins and PHP libraries.
   - React, Vite, Tailwind, and the broader Node.js ecosystem.
3. Classify the update before merging:
   - **Security** — merge as soon as CI passes, prioritised over all other work.
   - **Patch / minor** — merge when CI passes and there are no conflicting changes in flight.
   - **Major** — review breaking changes manually; document the decision in the pull request and, when needed, in `.context/OPERATIONS.md`.
4. Updates that conflict with the current stack or deployment schedule may be batched or postponed — document the reason in the PR.
