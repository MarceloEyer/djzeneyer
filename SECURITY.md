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
