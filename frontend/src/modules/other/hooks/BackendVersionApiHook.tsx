import { useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/core/lib/api';

export function useBackendVersionQuery() {
  return useSuspenseQuery({
    queryKey: ['backendVersion'],
    queryFn: () => {
      return client.get('/version', { headers: { Authorization: '' } });
    },
    select: (response) => {
      return response.data;
    },
    retry: false,
  });
}
