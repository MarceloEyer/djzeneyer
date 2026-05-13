---
name: wp-interactivity-api
description: "Use when the user mentions Interactivity API, @wordpress/interactivity, data-wp-* directives, or reactive behaviors in WordPress blocks/templates."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
compatibility: "Targets WordPress 6.9+ (PHP 7.2.24+)."
---

# WP Interactivity API

## When to use

Use this skill when the task involves:
- Adding or modifying reactive behaviors in WordPress blocks (e.g., a "Load More" button, live filters, or interactive gamification elements).
- Using `@wordpress/interactivity` or `data-wp-interactive` directives.
- Building reactive components that need to run *inside* the WordPress context (admin or frontend) while maintaining performance.
- **For djzeneyer.com:** Use this for interactive GamiPress elements or custom dashboards within the WordPress admin that require React-like reactivity without a full SPA context.

## Inputs required

- Repo root + which plugin/theme surface is affected.
- User intent for the interaction (e.g., "update score live", "toggle visibility").

## Procedure

### 1) Detect Interactivity API usage
Search for:
- `data-wp-interactive`
- `@wordpress/interactivity`
- `viewScriptModule` in `block.json`

### 2) Identify the store(s)
Locate store definitions (actions, state, callbacks). In this project, if we add interactivity, we'll keep stores in a predictable place (e.g., `assets/js/interactivity/`).

### 3) Server-Side Rendering (Best Practice)
Always pre-render HTML in PHP to avoid layout shifts (CLS).

**Initialize state in PHP:**
```php
wp_interactivity_state( 'zenGame', array(
  'points'    => 150,
  'rank'      => 'Silver',
  'isUpdated' => true,
));
```

**Initialize context in PHP:**
```php
<?php $context = array( 'isOpen' => false ); ?>
<div <?php echo wp_interactivity_data_wp_context( $context ); ?>>
  ...
</div>
```

### 4) Implement Directives Safely
- Use `data-wp-on--click`, `data-wp-bind--*`, `data-wp-text`, etc.
- **WordPress 6.9:** Avoid `data-wp-ignore` (deprecated).
- Use `---` for unique directive IDs if multiple plugins touch the same element.

### 5) Build/Tooling
The plugins in this project don't currently use `@wordpress/scripts` for bundling. If we add Interactivity API usage, we may need to introduce a build step or enqueue modules via `wp_enqueue_script_module()`.

## Verification Checklist

- [ ] Directives are present in the server-rendered HTML.
- [ ] No layout shift (CLS) during hydration.
- [ ] State updates correctly on interaction (smoke test).
- [ ] No JavaScript errors in the browser console.
- [ ] `wp_interactivity_process_directives()` is called if using custom markup outside blocks.

## Failure Modes / Debugging

- **Directives don't fire:** Check if `data-wp-interactive` is on a parent element and matches the store name.
- **Hydration mismatch:** PHP state doesn't match the JS initial state.
- **Script module error:** Ensure the browser supports `<script type="module">` or a polyfill is present.

## Escalation

- Official Documentation: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/
- Consult `wp-plugin-development` for how to enqueue the necessary scripts.
