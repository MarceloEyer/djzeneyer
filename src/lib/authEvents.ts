// src/lib/authEvents.ts
// Event name constants shared between UserContext (statically imported —
// part of the app shell) and lib/tokenRefresh.ts (only dynamically imported,
// from lib/fetchWithAuthRetry.ts). Keeping these in their own file —
// instead of importing them from tokenRefresh.ts directly — lets the
// token-refresh logic itself stay out of the initial JS bundle: a static
// import of anything from tokenRefresh.ts (even just two string constants)
// would pull its whole module graph into the entry chunk's `imports`, since
// Vite can't tell "just these two exports" from "the whole module" are
// needed by the eagerly-loaded code path.

/** Dispatched on `window` with `detail: { token: string }` after a successful renewal. */
export const TOKEN_REFRESHED_EVENT = 'zen-auth:token-refreshed';
/** Dispatched on `window` when the session cannot be renewed and must end. */
export const SESSION_EXPIRED_EVENT = 'zen-auth:session-expired';
