---
name: wp-interactivity-api
description: "Use only when the task explicitly involves WordPress Interactivity API, @wordpress/interactivity, data-wp-* directives, block/template reactivity, or admin/plugin UI that must run inside WordPress rather than the React SPA."
risk: low
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
updated: "2026-05-30"
compatibility: "Targets WordPress 6.9+ and PHP 8.3+ for this project."
---

# WP Interactivity API — djzeneyer.com

## Status in this project

This is a rare/conditional skill. The main public frontend is a React SPA, not WordPress block interactivity. Do not introduce the WordPress Interactivity API just because a UI needs state.

Use this skill only when the interaction must live inside WordPress-rendered markup, a plugin admin screen, a block/template surface, or another context where the React SPA is not the owner.

## When to use

Use this skill when the task involves:

- `@wordpress/interactivity`.
- `data-wp-interactive` or other `data-wp-*` directives.
- Reactive behavior inside WordPress blocks/templates.
- Plugin/admin UI that should not become part of the React SPA.
- Interactive GamiPress/admin elements rendered by WordPress/PHP.

Do not use it for normal React pages/components. Use `react-patterns` or `react-best-practices` instead.

## Inputs required

- Plugin/theme surface affected.
- Whether markup is server-rendered by PHP/blocks.
- Interaction goal.
- Whether a build step already exists.
- Privacy/security boundary of the state being rendered.

## Procedure

### 1) Detect existing usage

Search for:

- `data-wp-interactive`.
- `@wordpress/interactivity`.
- `viewScriptModule` in `block.json`.
- `wp_interactivity_state`.
- `wp_interactivity_data_wp_context`.

### 2) Confirm ownership

Ask:

- Is this inside WordPress/PHP/admin/block land?
- Would the React SPA be a better owner?
- Does this require server-rendered initial HTML to avoid CLS?
- Is any state private/user-specific?

### 3) Server-render first

Prefer server-rendered HTML and PHP-initialized state to avoid layout shifts.

```php
wp_interactivity_state('zenGame', [
    'points' => 150,
    'rank'   => 'Silver',
]);
```

```php
$context = ['isOpen' => false];
?>
<div <?php echo wp_interactivity_data_wp_context($context); ?>>
    ...
</div>
<?php
```

Escape output and protect private user data as usual.

### 4) Implement directives safely

- Use `data-wp-on--click`, `data-wp-bind--*`, `data-wp-text`, etc.
- Avoid deprecated directives for the target WP version.
- Keep store names unique, e.g. `zenGame`, `zenAdmin`, `zenBit`.
- Avoid mixing multiple plugin stores on the same element without clear ownership.

### 5) Build/tooling

The project plugins do not generally rely on `@wordpress/scripts` for bundling. If adding Interactivity API usage requires a build step, confirm the tradeoff before introducing new tooling.

## Verification

- Directives are present in server-rendered HTML.
- No layout shift during hydration.
- State updates correctly.
- No browser console errors.
- Private data is not printed into public HTML.
- `wp_interactivity_process_directives()` is used if needed for custom markup outside blocks.

## Failure modes

- Directives do not fire because `data-wp-interactive` parent is missing/wrong.
- Hydration mismatch between PHP and JS initial state.
- Script module enqueue/build missing.
- React SPA and WP Interactivity both try to own the same UI.
- Private user state leaked into public cached HTML.

## Escalation

Consult the official WordPress Interactivity API docs and `wp-plugin-development` before adding new build tooling or plugin architecture.
