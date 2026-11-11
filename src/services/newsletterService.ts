import { buildApiUrl } from '../config/api';

interface SubscribeResponse {
  message?: string;
}

export const subscribeToNewsletter = async (email: string): Promise<SubscribeResponse> => {
  const res = await fetch(buildApiUrl('djzeneyer/v1/subscribe'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = (await res.json().catch(() => ({}))) as SubscribeResponse;
  if (!res.ok) {
    throw new Error(data.message || 'Subscription failed');
  }

  return data;
};
