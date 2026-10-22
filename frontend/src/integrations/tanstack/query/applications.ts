import { useQuery } from '@tanstack/react-query';

import { getApplication, getGetApplicationQueryKey } from '@/api/generated/endpoints/applications.gen';

export function useApplicationQuery(applicationId: string, { enabled }: { enabled: boolean }) {
  return useQuery({
    queryKey: getGetApplicationQueryKey(applicationId),
    queryFn: ({ signal }) => getApplication(applicationId, { signal }),
    enabled,
  });
}
