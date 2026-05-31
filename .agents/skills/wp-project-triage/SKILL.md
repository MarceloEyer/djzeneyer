---
name: wp-project-triage
description: "Use for deterministic inspection of the djzeneyer.com WordPress/React repo: theme, custom plugins, tooling, tests, PHP/Node version hints and structure changes that should update context files."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
updated: "2026-05-30"
compatibility: "Targets WordPress 6.9+ and PHP 8.3+ for this project. Filesystem-based agent with bash + node. Some workflows require WP-CLI."
---

# WP Project Triage — djzeneyer.com

## When to use

Use this skill to inspect repository structure before WordPress/plugin/backend changes, especially when:

- a new plugin/theme/build config may have been added;
- a skill needs current project classification;
- tooling/tests/version hints are unclear;
- docs/context may be stale;
- a PR touches plugin, theme, REST, build, scripts or workflows.

Do not use it for simple copy-only tasks.

## Inputs required

- Repo root.
- Branch/PR under inspection.
- Whether the task is read-only or may update context after triage.

## Procedure

1. Run the detector if available:

```bash
node .agents/skills/wp-project-triage/scripts/detect_wp_project.mjs
```

2. Confirm the report includes:

- `project.kind`.
- `signals`.
- `tooling`.
- WordPress/theme/plugin hints.
- Node/PHP/composer/npm hints.

3. For this repo, verify expected structure:

```text
src/                       React SPA
inc/                       WordPress theme bootstrap/API/CSP/AI endpoints
plugins/zen-bit/           Events + MusicEvent
plugins/zengame/           Gamification
plugins/zeneyer-auth/      JWT/Google OAuth/profile/newsletter/orders
plugins/zen-seo-lite/      Metadata/schema/sitemap
plugins/zen-mailer/        Mail support when present
plugins/zen-plugins-overview/ Admin overview when present
scripts/                   build/prerender/sitemap/markdown/IndexNow/DNS-AID
public/                    root-public assets and AI/search resources
.agents/                   agent personas and skills
.context/                  shared project context
.human/                    human backlog/audits/handoffs
```

4. If structure changed, update the relevant context owner:

- `AI_CONTEXT_INDEX.md` if hierarchy/map changed.
- `.context/ARCHITECTURE.md` if boundaries changed.
- `.context/SITE_RESOURCES.md` if capabilities/resources changed.
- `.context/API.md` if REST routes changed.
- `.context/IMPLEMENTATION_STATUS.md` if recent feature/TODO status changed.
- `.agents/skills/README.md` if skill navigation changed.

## Verification

- JSON parses.
- Expected first-party paths are detected.
- No generated/vendor directories dominate the report.
- New plugin/theme/tooling changes are reflected in the correct context file.

## Failure modes

- Reports `unknown`: wrong repo root or detector needs updating.
- Scanning slow: ignore generated/vendor/build directories.
- Report conflicts with code: code wins; fix detector or context.
- New project capability found but `SITE_RESOURCES.md` not updated.