import { queryOptions } from '@tanstack/react-query';
import { buildApiUrl } from '../config/api';

export interface AuthSettingsResponse {
  success: boolean;
  data: {
    google_client_id: string;
  };
}

export const authQueries = {
  settings: () =>
    queryOptions({
      queryKey: ['auth', 'settings'] as const,
      queryFn: async (): Promise<AuthSettingsResponse> => {
        const API_URL = buildApiUrl('zeneyer-auth/v1');
        const res = await fetch(`${API_URL}/settings`);
        const text = await res.text();

        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          throw new Error(
            'Servidor retornou HTML ao invés de JSON (Plugin inativo ou rewrite rules desatualizadas)',
          );
        }

        const data = JSON.parse(text);
        if (!data.success) {
          throw new Error('Falha ao obter configurações de Auth');
        }

        return data as AuthSettingsResponse;
      },
      staleTime: 1000 * 60 * 60 * 24,
      retry: 1,
    }),
};
