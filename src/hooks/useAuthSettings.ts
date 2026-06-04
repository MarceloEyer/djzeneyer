import { useQuery } from '@tanstack/react-query';
import { authQueries, type AuthSettingsResponse } from '../queries/auth.queries';

export type { AuthSettingsResponse };

export const useAuthSettings = (enabled: boolean = false) => {
  return useQuery({
    ...authQueries.settings(),
    enabled,
  });
};
