const CHUNK_RECOVERY_KEY = 'djz:chunk-recovery';

const CHUNK_ERROR_PATTERNS = [
  /ChunkLoadError/i,
  /Loading chunk \S+ failed/i,
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /error loading dynamically imported module/i,
  /Failed to load module script/i,
  /dynamically imported module/i,
];

const getErrorText = (error: unknown): string => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error ?? '');
};

export const isChunkLoadError = (error: unknown): boolean => {
  const errorText = getErrorText(error);
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(errorText));
};

const getCurrentEntryMarker = (): string => {
  const script = document.querySelector<HTMLScriptElement>(
    'script[type="module"][src*="/assets/"]'
  );

  return script?.src || 'unknown-entry';
};

const shouldReloadForChunkError = (marker: string): boolean => {
  try {
    if (window.sessionStorage.getItem(CHUNK_RECOVERY_KEY) === marker) {
      return false;
    }

    window.sessionStorage.setItem(CHUNK_RECOVERY_KEY, marker);
    return true;
  } catch {
    const windowWithRecoveryFlag = window as Window & {
      __DJZ_CHUNK_RECOVERY_MARKER__?: string;
    };

    if (windowWithRecoveryFlag.__DJZ_CHUNK_RECOVERY_MARKER__ === marker) {
      return false;
    }

    windowWithRecoveryFlag.__DJZ_CHUNK_RECOVERY_MARKER__ = marker;
    return true;
  }
};

export const recoverFromChunkLoadError = (error: unknown): boolean => {
  if (typeof window === 'undefined' || !isChunkLoadError(error)) {
    return false;
  }

  const marker = [
    getCurrentEntryMarker(),
    window.location.pathname,
    window.location.search,
    window.location.hash,
  ].join('|');

  if (!shouldReloadForChunkError(marker)) {
    return false;
  }

  try {
    window.location.reload();
    return true;
  } catch (reloadError) {
    console.error('Chunk recovery reload failed', reloadError);
    return false;
  }
};
