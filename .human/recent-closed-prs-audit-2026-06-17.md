# Audit of the 10 most recent closed PRs - 2026-06-17

This audit was prepared from the local Git history because the container does not have the GitHub CLI installed and the repository checkout has no configured `origin` remote. The reviewed window is the 10 most recent merge commits visible locally with PR numbers: #752, #751, #750, #749, #748, #747, #746, #745, #744 and #729.

## Executive answer

No, not everything was perfect. The shipped code is generally healthy: lint passed, PHP syntax checks passed, SEO invariants passed, and UTF-8 checks passed. However, the review found three process/code-quality risks:

1. PR #729 was a necessary revert of PR #728, which means the previous closed-PR window included a product-policy regression around AI training signals.
2. PR #751 made the intended menu route lookup faster, but there was no focused regression test documenting the expected behavior for aliases, localized PT paths, query strings and fragments.
3. PR #750 added cache priming in the AI context builder, which is directionally correct, but the expected performance win is situational and should be measured in production-like WordPress traces rather than assumed from the diff alone.

## Reviewed PRs

| PR | Local merge commit | Area | Verdict | Notes |
|---:|---|---|---|---|
| #752 | `032a871` | Support page copy | Good | Copy is localized in EN/PT and aligned with the donation/product rule that payment support data is public by design. |
| #751 | `dc99ca1` | Menu REST routing | Good with follow-up | O(N) lookup became O(1), but the optimization needed a regression test to protect localized aliases and URL suffix preservation. |
| #750 | `df063ca` | AI context cache priming | Good with measurement caveat | `update_post_caches()` can reduce N+1 post-meta/term/user lookups when later filters touch cached objects. Needs production-like profiling to quantify. |
| #749 | `0430961` | SEO sitemap docblock cleanup | Good | Removes obsolete comment only. Low risk. |
| #748 | `08647c1` | Terms page Framer Motion references | Good | Static motion objects match the project performance guideline. |
| #747 | `2ad25e9` | npm dependency bump | Good after checks | Lint and invariant checks passed locally; full Vitest run was not completed in this environment because the runner produced no results before timeout. |
| #746 | `2bf4610` | PHP dependency lock bump | Good after checks | PHP syntax checks passed. Composer security status was not checked because no Composer command was run in this audit. |
| #745 | `233d188` | GitHub workflow dependency/action changes | Needs GitHub-side validation | Local checkout cannot verify workflow run behavior without GitHub CLI/API access. Review on GitHub should confirm bot-review triggers still comment as expected. |
| #744 | `f50d5f4` | npm audit/security updates | Good after checks | Dependency lock-only change. Local lint/invariant checks passed. |
| #729 | `1116593` | robots.txt Content-Signal restore | Corrective PR | This fixed the earlier mistake from #728. The policy is product-critical: keep `ai-train=yes, search=yes, ai-input=yes`. |

## Performance estimates

These are directional estimates, not benchmark claims. They should be validated with production traces or at least a local WordPress fixture.

| Change | Expected improvement | Confidence | Why |
|---|---:|---|---|
| #751 menu route lookup map | 50-95% less CPU inside route matching for menus with many routes/aliases | Medium | Runtime path matching changed from nested route scans to direct hash lookup after one map build. Absolute endpoint latency may improve only a few ms because WordPress boot dominates. |
| #750 post cache priming | 10-40% fewer DB reads in AI context generation when downstream formatting touches post caches | Low/Medium | The win depends on which object/meta/term caches are cold and what filters run in production. |
| #748 static motion objects | Small render allocation reduction | Medium | Prevents repeated object allocation for motion props, but page render cost is likely dominated by React and content. |

## What was wrong and how to correct it

### 1. Policy regression around AI training signals

PR #729 exists because PR #728 removed `Content-Signal` from `robots.txt`. That was wrong for this project. Public content is intentionally available for search, grounding, indexing and AI training.

Correction:

- Keep `Content-Signal: ai-train=yes, search=yes, ai-input=yes` in the wildcard and AI bot blocks.
- Keep `public/.well-known/ai-bots.txt` aligned with `allow_training: yes`.
- Keep `npm run seo:check` in the required pre-merge checklist.

### 2. Optimized menu routing needed a regression harness

PR #751 is a reasonable performance improvement, but optimizations without focused tests are fragile. The riskiest cases are localized PT aliases, root routes, query strings, fragments and unknown same-origin custom links.

Correction included in this PR:

- Add a dedicated PHP regression script for `djz_localize_menu_url()` and the O(1) route map behavior.
- Cover EN/PT aliases, query/fragment preservation, unknown path fallback, external links and path traversal normalization.

### 3. Bot-review workflow cannot be fully validated locally

PR #745 touches GitHub Actions behavior. Local static checks cannot prove the workflow still comments on PRs or evaluates other agents' suggestions correctly.

Correction:

- Verify #745 on GitHub by reading the PR body, comments, reviews, review threads and merge state when GitHub access is available.
- Ensure future reviews use `gh pr view <number> --json body,comments,reviews,reviewThreads,mergeStateStatus` and `gh pr diff <number>` before merge decisions, as required by `.agents/GUIDELINES.md`.

## Follow-up checklist for the human reviewer

- Confirm the GitHub-side comments/reviews for #745, #750, #751 and #752 because this local environment could not access PR review threads.
- Run the new menu regression script after any future change to `inc/api.php` or `src/config/routes-slugs.json`.
- If performance matters for #750/#751, measure endpoint timings before/after on a staging WordPress instance with object cache state explicitly documented.
