import { useQuery } from '@tanstack/react-query';
import { buildApiUrl } from '../config/api';

interface AuthSettingsResponse {
  success: boolean;
  data: {
    google_client_id: string;
  };
}

export const useAuthSettings = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['auth', 'settings'],
    queryFn: async (): Promise<AuthSettingsResponse> => {
      const API_URL = buildApiUrl('zeneyer-auth/v1');
      const res = await fetch(`${API_URL}/settings`);
      const text = await res.text();

      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error('Servidor retornou HTML ao invés de JSON (Plugin inativo ou rewrite rules desatualizadas)');
      }

      const data = JSON.parse(text);
      if (!data.success) {
        throw new Error('Falha ao obter configurações de Auth');
      }

      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (configuração estática)
    retry: 1,
  });
};
