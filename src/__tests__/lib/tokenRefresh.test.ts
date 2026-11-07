import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { waitFor } from '@testing-library/react';
import { server } from '../../test/mocks/server';
import { renderHookWithProviders } from '../../test/utils';
import { refreshAccessToken, TOKEN_REFRESHED_EVENT, SESSION_EXPIRED_EVENT } from '../../lib/tokenRefresh';
import { getTokenUserId } from '../../lib/authStorage';
import { useZenGameUserData } from '../../hooks/useAuthenticatedQueries';
import { REST_BASE } from '../../test/mocks/fixtures';

const OLD_TOKEN = 'old.jwt.token';
const NEW_TOKEN = 'new.jwt.token';
const NEW_REFRESH_TOKEN = 'new-refresh-token';

const seedSession = (refreshToken = 'valid-refresh-token', userId = 42) => {
  localStorage.setItem('zen_refresh_token', refreshToken);
  localStorage.setItem('zen_user', JSON.stringify({ id: userId }));
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  // Tests that fake the Web Locks API define it as an own property of navigator.
  Reflect.deleteProperty(navigator, 'locks');
});

describe('refreshAccessToken', () => {
  it('returns null and dispatches SESSION_EXPIRED_EVENT when nothing is stored to refresh with', async () => {
    const onExpired = vi.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);

    const result = await refreshAccessToken();

    expect(result).toBeNull();
    expect(onExpired).toHaveBeenCalledTimes(1);
    window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  });

  it('exchanges the stored refresh token for a new access token and dispatches TOKEN_REFRESHED_EVENT', async () => {
    seedSession();
    server.use(
      http.post(`${REST_BASE}/zeneyer-auth/v1/auth/refresh`, () =>
        HttpResponse.json({ success: true, data: { token: NEW_TOKEN, refresh_token: NEW_REFRESH_TOKEN } })
      )
    );

    const onRefreshed = vi.fn();
    window.addEventListener(TOKEN_REFRESHED_EVENT, onRefreshed);

    const result = await refreshAccessToken();

    expect(result).toBe(NEW_TOKEN);
    expect(localStorage.getItem('zen_jwt')).toBe(NEW_TOKEN);
    expect(localStorage.getItem('zen_refresh_token')).toBe(NEW_REFRESH_TOKEN);
    expect(onRefreshed).toHaveBeenCalledTimes(1);
    window.removeEventListener(TOKEN_REFRESHED_EVENT, onRefreshed);
  });

  it('de-duplicates concurrent callers into a single backend request', async () => {
    seedSession();
    let callCount = 0;
    server.use(
      http.post(`${REST_BASE}/zeneyer-auth/v1/auth/refresh`, () => {
        callCount += 1;
        return HttpResponse.json({ success: true, data: { token: NEW_TOKEN, refresh_token: NEW_REFRESH_TOKEN } });
      })
    );

    const [a, b, c] = await Promise.all([refreshAccessToken(), refreshAccessToken(), refreshAccessToken()]);

    expect(a).toBe(NEW_TOKEN);
    expect(b).toBe(NEW_TOKEN);
    expect(c).toBe(NEW_TOKEN);
    // The backend rotates the refresh token on every use — if each caller had
    // fired its own request, only the first would succeed and the other two
    // would fail against an already-revoked token.
    expect(callCount).toBe(1);
  });

  it('clears the refresh token and dispatches SESSION_EXPIRED_EVENT when the server rejects it', async () => {
    seedSession();
    server.use(
      http.post(`${REST_BASE}/zeneyer-auth/v1/auth/refresh`, () =>
        HttpResponse.json({ code: 'invalid_refresh_token', message: 'Invalid refresh token' }, { status: 401 })
      )
    );

    const onExpired = vi.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);

    const result = await refreshAccessToken();

    expect(result).toBeNull();
    expect(localStorage.getItem('zen_refresh_token')).toBeNull();
    expect(onExpired).toHaveBeenCalledTimes(1);
    window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  });

  describe('across browser tabs', () => {
    const countRefreshCalls = () => {
      const counter = { calls: 0 };
      server.use(
        http.post(`${REST_BASE}/zeneyer-auth/v1/auth/refresh`, () => {
          counter.calls += 1;
          return HttpResponse.json({ success: true, data: { token: 'unexpected.jwt', refresh_token: 'unexpected-refresh' } });
        })
      );
      return counter;
    };

    it('reuses the access token another tab already stored instead of redeeming the refresh token again', async () => {
      seedSession();
      localStorage.setItem('zen_jwt', NEW_TOKEN); // another tab renewed after this tab's request was rejected
      const refreshCalls = countRefreshCalls();
      const onRefreshed = vi.fn();
      window.addEventListener(TOKEN_REFRESHED_EVENT, onRefreshed);

      const result = await refreshAccessToken(OLD_TOKEN);

      expect(result).toBe(NEW_TOKEN);
      expect(refreshCalls.calls).toBe(0);
      expect(onRefreshed).toHaveBeenCalledTimes(1);
      expect((onRefreshed.mock.calls[0][0] as CustomEvent<{ token: string }>).detail.token).toBe(NEW_TOKEN);
      window.removeEventListener(TOKEN_REFRESHED_EVENT, onRefreshed);
    });

    it('takes a cross-tab Web Lock and adopts the token the previous holder stored while this tab waited', async () => {
      seedSession();
      const refreshCalls = countRefreshCalls();
      const lockNames: string[] = [];
      Object.defineProperty(navigator, 'locks', {
        configurable: true,
        value: {
          request: async (name: string, task: () => Promise<unknown>) => {
            lockNames.push(name);
            // The other tab held the lock, refreshed, and released it before this task runs.
            localStorage.setItem('zen_jwt', NEW_TOKEN);
            localStorage.setItem('zen_refresh_token', NEW_REFRESH_TOKEN);
            return task();
          },
        },
      });

      const result = await refreshAccessToken(OLD_TOKEN);

      expect(lockNames).toEqual(['zen-auth-refresh']);
      expect(result).toBe(NEW_TOKEN);
      expect(refreshCalls.calls).toBe(0);
      expect(localStorage.getItem('zen_refresh_token')).toBe(NEW_REFRESH_TOKEN);
    });

    it('keeps the other tab\'s session when its rotation made this tab\'s refresh token look invalid (no Web Locks)', async () => {
      seedSession('old-refresh-token');
      server.use(
        http.post(`${REST_BASE}/zeneyer-auth/v1/auth/refresh`, () => {
          // Meanwhile, the other tab redeemed the same token first and stored its rotated pair.
          localStorage.setItem('zen_jwt', NEW_TOKEN);
          localStorage.setItem('zen_refresh_token', NEW_REFRESH_TOKEN);
          return HttpResponse.json({ code: 'invalid_refresh_token', message: 'Invalid refresh token' }, { status: 401 });
        })
      );
      const onExpired = vi.fn();
      window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);

      const result = await refreshAccessToken(OLD_TOKEN);

      expect(result).toBe(NEW_TOKEN);
      expect(localStorage.getItem('zen_refresh_token')).toBe(NEW_REFRESH_TOKEN);
      expect(onExpired).not.toHaveBeenCalled();
      window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
    });
  });
});

describe('when the session changes during a renewal', () => {
  const OTHER_USER_ID = 7;

  // Minimal unsigned JWT carrying the claim JWT_Manager::create_token() sets.
  const jwtFor = (userId: number) => {
    const payload = btoa(JSON.stringify({ data: { user_id: userId } }))
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return `header.${payload}.signature`;
  };

  const refreshSucceeds = () =>
    HttpResponse.json({ success: true, data: { token: NEW_TOKEN, refresh_token: NEW_REFRESH_TOKEN } });

  const switchToOtherAccount = () => {
    localStorage.setItem('zen_user', JSON.stringify({ id: OTHER_USER_ID }));
    localStorage.setItem('zen_jwt', 'other.account.jwt');
    localStorage.setItem('zen_refresh_token', 'other-account-refresh');
  };

  const listen = () => {
    const onRefreshed = vi.fn();
    const onExpired = vi.fn();
    window.addEventListener(TOKEN_REFRESHED_EVENT, onRefreshed);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return {
      onRefreshed,
      onExpired,
      stop: () => {
        window.removeEventListener(TOKEN_REFRESHED_EVENT, onRefreshed);
        window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
      },
    };
  };

  it('does not restore tokens when the user logs out while the renewal is in flight', async () => {
    seedSession();
    localStorage.setItem('zen_jwt', OLD_TOKEN);
    server.use(
      http.post(`${REST_BASE}/zeneyer-auth/v1/auth/refresh`, () => {
        localStorage.clear(); // what UserContext.logout() does mid-request
        return refreshSucceeds();
      })
    );
    const events = listen();

    const result = await refreshAccessToken(OLD_TOKEN);

    expect(result).toBeNull();
    expect(localStorage.getItem('zen_jwt')).toBeNull();
    expect(localStorage.getItem('zen_refresh_token')).toBeNull();
    expect(events.onRefreshed).not.toHaveBeenCalled();
    expect(events.onExpired).not.toHaveBeenCalled(); // the user chose to log out
    events.stop();
  });

  it('keeps the new account\'s tokens when the account switches while the renewal is in flight', async () => {
    seedSession();
    localStorage.setItem('zen_jwt', OLD_TOKEN);
    server.use(
      http.post(`${REST_BASE}/zeneyer-auth/v1/auth/refresh`, () => {
        switchToOtherAccount();
        return refreshSucceeds();
      })
    );
    const events = listen();

    const result = await refreshAccessToken(OLD_TOKEN);

    expect(result).toBeNull();
    expect(localStorage.getItem('zen_jwt')).toBe('other.account.jwt');
    expect(localStorage.getItem('zen_refresh_token')).toBe('other-account-refresh');
    expect(JSON.parse(localStorage.getItem('zen_user') as string)).toMatchObject({ id: OTHER_USER_ID });
    expect(events.onRefreshed).not.toHaveBeenCalled();
    events.stop();
  });

  it('does not clear or expire the new account\'s session when the old refresh token is rejected', async () => {
    seedSession();
    localStorage.setItem('zen_jwt', OLD_TOKEN);
    server.use(
      http.post(`${REST_BASE}/zeneyer-auth/v1/auth/refresh`, () => {
        switchToOtherAccount();
        return HttpResponse.json({ code: 'invalid_refresh_token', message: 'Invalid refresh token' }, { status: 401 });
      })
    );
    const events = listen();

    const result = await refreshAccessToken(OLD_TOKEN);

    expect(result).toBeNull();
    expect(localStorage.getItem('zen_refresh_token')).toBe('other-account-refresh');
    expect(events.onExpired).not.toHaveBeenCalled();
    events.stop();
  });

  it('does not renew with the stored session when the rejected request belonged to another account', async () => {
    seedSession(); // stored session is user 42
    let refreshCalls = 0;
    server.use(
      http.post(`${REST_BASE}/zeneyer-auth/v1/auth/refresh`, () => {
        refreshCalls += 1;
        return refreshSucceeds();
      })
    );
    const events = listen();

    // The 401 came from a request sent with user 7's token, e.g. before another tab logged in as 42.
    const result = await refreshAccessToken(jwtFor(OTHER_USER_ID));

    expect(result).toBeNull();
    expect(refreshCalls).toBe(0);
    expect(localStorage.getItem('zen_refresh_token')).toBe('valid-refresh-token');
    expect(events.onRefreshed).not.toHaveBeenCalled();
    expect(events.onExpired).not.toHaveBeenCalled();
    events.stop();
  });
});

describe('getTokenUserId', () => {
  const encode = (claims: unknown) =>
    `h.${btoa(JSON.stringify(claims)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')}.s`;

  it('reads the user id claim, numeric or numeric string', () => {
    expect(getTokenUserId(encode({ data: { user_id: 42 } }))).toBe(42);
    expect(getTokenUserId(encode({ data: { user_id: '42' } }))).toBe(42);
  });

  it('returns null for anything that is not a decodable token with that claim', () => {
    expect(getTokenUserId(null)).toBeNull();
    expect(getTokenUserId('')).toBeNull();
    expect(getTokenUserId('old.jwt.token')).toBeNull();
    expect(getTokenUserId('not-a-jwt')).toBeNull();
    expect(getTokenUserId(encode({ data: {} }))).toBeNull();
    expect(getTokenUserId(encode({ data: { user_id: 'abc' } }))).toBeNull();
  });
});

describe('fetchWithAuthRetry (via useZenGameUserData)', () => {
  it('silently renews an expired access token instead of surfacing the 401 to the user', async () => {
    seedSession();

    server.use(
      http.get(`${REST_BASE}/zengame/v1/me`, ({ request }) => {
        const auth = request.headers.get('authorization');
        if (auth === `Bearer ${OLD_TOKEN}`) {
          return HttpResponse.json(
            { code: 'rest_forbidden', message: 'Sem permissão para fazer isso.', data: { status: 401 } },
            { status: 401 }
          );
        }
        // Only the renewed token reaches here — this is the regression this
        // test guards: the painel used to stay 401'd forever once the access
        // token expired, because nothing ever retried with a fresh one.
        expect(auth).toBe(`Bearer ${NEW_TOKEN}`);
        return HttpResponse.json({
          user_id: 42,
          points: { zen_points: { name: 'Zen Points', amount: 100, image: '' } },
          rank: { current: { id: 1, title: 'Beginner', image: '' }, progress: 50, requirements: [], next: null },
          achievements_earned: [],
          achievements_locked: [],
          recent_achievements: [],
          logs: [],
          stats: { totalTracks: 0, eventsAttended: 0, streak: 0, streakFire: false },
          main_points_slug: 'zen_points',
          lastUpdate: '',
          version: '1.0',
        });
      }),
      http.post(`${REST_BASE}/zeneyer-auth/v1/auth/refresh`, () =>
        HttpResponse.json({ success: true, data: { token: NEW_TOKEN, refresh_token: NEW_REFRESH_TOKEN } })
      )
    );

    const { result } = renderHookWithProviders(() => useZenGameUserData(OLD_TOKEN));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({ user_id: 42 });
    expect(localStorage.getItem('zen_jwt')).toBe(NEW_TOKEN);
  });
});
