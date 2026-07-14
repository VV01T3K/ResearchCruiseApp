import { useSuspenseQuery } from '@tanstack/react-query';

import config from '@/config';

export function useBackendVersionQuery() {
  return useSuspenseQuery({
    queryKey: ['backendVersion'],
    queryFn: async () => {
      const response = await fetch(`${config.apiUrl}/version`);
      if (!response.ok) throw new Error(`Backend version request failed with status ${response.status}`);
      return response.json() as Promise<string>;
    },
    retry: false,
  });
}
