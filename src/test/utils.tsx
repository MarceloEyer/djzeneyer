import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import type { RenderHookOptions } from '@testing-library/react';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

interface WrapperProps {
  children: React.ReactNode;
}

export function createWrapper(initialPath = '/') {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

export function renderHookWithProviders<T>(
  hook: () => T,
  options?: Omit<RenderHookOptions<unknown>, 'wrapper'>
) {
  return renderHook(hook, { wrapper: createWrapper(), ...options });
}
