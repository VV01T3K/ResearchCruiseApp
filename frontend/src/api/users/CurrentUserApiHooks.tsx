import { useSuspenseQuery } from '@tanstack/react-query';

import { getCurrentUser, getGetCurrentUserQueryKey } from '@/api/gen/endpoints/users.gen';
import { ApiError } from '@/lib/custom-fetch';
import { Role } from '@/models/shared/Role';
import { getStoredAuthDetails } from '@/providers/StoredAuthDetails';

/* Returns null when there is no access token or the session is unauthorized. */
export function useProfileQuery() {
  return useSuspenseQuery({
    queryKey: getGetCurrentUserQueryKey(),
    queryFn: async () => {
      if (!getStoredAuthDetails()?.accessToken) return null;

      try {
        const user = await getCurrentUser();
        return { ...user, roles: user.roles as Role[] };
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
}
