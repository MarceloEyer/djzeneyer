import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '../../lib/logger';

describe('logger', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('logger.error calls console.error in dev mode', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('TEST_CODE', 'something went wrong');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('[TEST_CODE]', 'something went wrong');
  });

  it('logger.warn calls console.warn in dev mode', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('WARN_CODE', 'heads up', { detail: 'extra' });
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('[WARN_CODE]', 'heads up', { detail: 'extra' });
  });

  it('logger.info calls console.info in dev mode', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('INFO_CODE', 'all good');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('logger.debug calls console.info in dev mode', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.debug('DEBUG_CODE', 'verbose detail');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('omits context argument when not provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('CODE', 'msg');
    // Third arg should not be passed when context is undefined
    const callArgs = spy.mock.calls[0];
    expect(callArgs).toHaveLength(2);
  });

  it('passes context object as third argument when provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const ctx = { userId: 42, endpoint: '/api/test' };
    logger.error('CODE', 'msg', ctx);
    const callArgs = spy.mock.calls[0];
    expect(callArgs[2]).toEqual(ctx);
  });
});
