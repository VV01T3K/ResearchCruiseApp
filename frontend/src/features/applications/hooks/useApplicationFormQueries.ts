import { queryOptions } from '@tanstack/react-query';

import {
  getApplicationFormB,
  getApplicationFormC,
  getGetApplicationFormBQueryKey,
  getGetApplicationFormASuspenseQueryOptions,
  getGetApplicationFormCQueryKey,
} from '@/api/generated/endpoints/applications.gen';
import type { FormBValues } from '@/features/applications/schemas/formB.schema';
import type { FormCValues } from '@/features/applications/schemas/formC.schema';
import { ApiError } from '@/api/errors';
import { groupedQueryStaleTime } from '@/integrations/tanstack/query/root-provider';
import { mapFormAToValues } from '@/features/applications/schemas/formA.schema';
import { mapFormBToValues } from '@/features/applications/schemas/formB.schema';
import { mapFormCToValues } from '@/features/applications/schemas/formC.schema';

export function formAQueryOptions(applicationId: string) {
  return getGetApplicationFormASuspenseQueryOptions(applicationId, {
    query: { select: mapFormAToValues, staleTime: groupedQueryStaleTime },
  });
}

export function formBQueryOptions(applicationId: string) {
  return queryOptions({
    queryKey: getGetApplicationFormBQueryKey(applicationId),
    queryFn: async ({ signal }) => {
      try {
        return await getApplicationFormB(applicationId, { signal });
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    select: (data): FormBValues | null => (data ? mapFormBToValues(data) : null),
    retry: false,
    staleTime: groupedQueryStaleTime,
  });
}

export function formCQueryOptions(applicationId: string) {
  return queryOptions({
    queryKey: getGetApplicationFormCQueryKey(applicationId),
    queryFn: async ({ signal }) => {
      try {
        return await getApplicationFormC(applicationId, { signal });
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    select: (data): FormCValues | null => (data ? mapFormCToValues(data) : null),
    retry: false,
    staleTime: groupedQueryStaleTime,
  });
}
