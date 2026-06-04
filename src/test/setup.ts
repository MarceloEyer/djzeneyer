import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// Stub window.wpData so buildApiUrl uses the test base URL
Object.defineProperty(window, 'wpData', {
  value: {
    siteUrl: 'https://djzeneyer.com',
    restUrl: 'https://djzeneyer.com/wp-json/',
    nonce: 'test-nonce',
  },
  writable: true,
});

// Suppress prerender data so fetch functions always hit the network (MSW)
Object.defineProperty(window, '__PRERENDER_DATA__', { value: undefined, writable: true });

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
