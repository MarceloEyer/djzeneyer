import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { recoverFromChunkLoadError } from './chunkRecovery';

type LazyComponentModule<T extends ComponentType<object>> = {
  default: T;
};

export const lazyWithRetry = <T extends ComponentType<object>>(
  factory: () => Promise<LazyComponentModule<T>>
): LazyExoticComponent<T> =>
  lazy(() =>
    factory().catch((error) => {
      if (recoverFromChunkLoadError(error)) {
        return new Promise<LazyComponentModule<T>>(() => undefined);
      }

      throw error;
    })
  );
