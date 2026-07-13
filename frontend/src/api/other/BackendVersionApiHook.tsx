import { useSuspenseQuery } from '@tanstack/react-query';

import { apiFetch } from '@/api/fetch';

export function useBackendVersionQuery() {
  return useSuspenseQuery({
    queryKey: ['backendVersion'],
    queryFn: () => {
      return apiFetch<string>('/version', { headers: { Authorization: '' } });
    },
    retry: false,
  });
}
