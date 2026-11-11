// src/hooks/useQueries.ts
// Barrel re-export - maintains backward compatibility for all existing imports.
// Prefer importing directly from the focused modules in new code:
//   usePublicQueries -> public/unauthenticated data
//   useAuthenticatedQueries -> JWT-protected data
//   useMutations -> write operations

export * from './usePublicQueries';
export * from './useAuthenticatedQueries';
export * from './useMutations';
