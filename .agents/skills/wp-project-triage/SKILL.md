---
name: wp-project-triage
description: "Use when you need a deterministic inspection of a WordPress repository (plugin/theme/block theme/WP core/Gutenberg/full site) including tooling/tests/version hints, and a structured JSON report to guide workflows and guardrails."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
compatibility: "Targets WordPress 6.9+ (PHP 7.2.24+). Filesystem-based agent with bash + node. Some workflows require WP-CLI."
---

# WP Project Triage

## When to use

Use this skill to quickly understand what kind of WordPress repo you’re in and what commands/conventions to follow before making changes.

## Inputs required

- Repo root (current working directory).

## Procedure

1. Run the detector (prints JSON to stdout):
   - `node .agents/skills/wp-project-triage/scripts/detect_wp_project.mjs`
2. Use the report to select workflow guardrails:
   - project kind(s)
   - PHP/Node tooling present
   - tests present
   - version hints and sources
3. **For djzeneyer.com:** This helps confirm the location of the 4 custom plugins and the primary theme, and detects if any new 3rd party plugins were added that might conflict.

## Verification

- The JSON should parse and include: `project.kind`, `signals`, and `tooling`.
- Re-run after changes that affect structure/tooling (adding `theme.json`, `block.json`, build config).

## Failure modes / debugging

- If it reports `unknown`, check whether the repo root is correct.
- If scanning is slow, add/extend ignore directories in the script.
