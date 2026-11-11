// src/lib/logger.ts
// Centralized structured logger — replaces scattered console.error/info calls.
// Dev: human-readable. Prod: JSON ready for any log drain (Sentry, Logtail, etc.).

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  code: string;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

const isDev = import.meta.env.DEV;

function emit(level: LogLevel, code: string, message: string, context?: Record<string, unknown>) {
  // Suppress debug in production
  if (!isDev && level === 'debug') return;

  if (isDev) {
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
    fn(`[${code}]`, message, ...(context ? [context] : []));
    return;
  }

  const entry: LogEntry = { level, code, message, context, timestamp: new Date().toISOString() };
  try {
    console[level](JSON.stringify(entry));
  } catch {
    console[level](JSON.stringify({ level, code, message, timestamp: entry.timestamp }));
  }
}

export const logger = {
  debug: (code: string, message: string, context?: Record<string, unknown>) =>
    emit('debug', code, message, context),
  info: (code: string, message: string, context?: Record<string, unknown>) =>
    emit('info', code, message, context),
  warn: (code: string, message: string, context?: Record<string, unknown>) =>
    emit('warn', code, message, context),
  error: (code: string, message: string, context?: Record<string, unknown>) =>
    emit('error', code, message, context),
};
