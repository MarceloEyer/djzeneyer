## 2025-02-19 - WP REST API _embed Performance
**Learning:** Using `_embed` in WP REST API requests triggers significant overhead due to multiple internal queries (N+1) for fetching related objects like authors, terms, media, and comments. For list endpoints returning many items (e.g., 100 tracks), this causes a major performance bottleneck on the backend.
**Action:** Always prefer registering lightweight custom REST fields (e.g., `featured_image_src`) using `register_rest_field` to expose only the necessary data. This allows the frontend to remove the `_embed` parameter, drastically reducing response time and payload size.

## 2025-02-19 - Broken Lint Configuration
**Learning:** The project's `eslint.config.js` references `eslint-plugin-react-refresh`, but this package is missing from `devDependencies` in `package.json`. This causes `npm run lint` to fail out of the box.
**Action:** When setting up a new environment or diagnosing lint failures, check for missing plugins in `package.json` that are referenced in `eslint.config.js`. Installed `eslint-plugin-react-refresh` to fix the immediate issue.
