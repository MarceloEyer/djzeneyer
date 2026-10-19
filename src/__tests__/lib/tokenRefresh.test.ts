import { describe, it, expect, beforeEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { waitFor } from '@testing-library/react';
import { server } from '../../test/mocks/server';
import { renderHookWithProviders } from '../../test/utils';
import { refreshAccessToken, TOKEN_REFRESHED_EVENT, SESSION_EXPIRED_EVENT } from '../../lib/tokenRefresh';
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
