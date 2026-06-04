import { describe, it, expect } from 'vitest';
import * as useQueries from '../../hooks/useQueries';

describe('useQueries barrel export', () => {
  it('exports hooks from usePublicQueries, useAuthenticatedQueries, and useMutations', () => {
    // Just verify a few known exports exist
    expect(useQueries.useMenuQuery).toBeDefined();
    expect(useQueries.useEventsQuery).toBeDefined();
    expect(useQueries.useProfileQuery).toBeDefined();
    expect(useQueries.useAddToCartMutation).toBeDefined();
  });
});
