import { useSuspenseQuery } from '@tanstack/react-query';

import {
  getApplicationFormA,
  getApplicationFormB,
  getApplicationFormC,
  getGetApplicationFormAQueryKey,
  getGetApplicationFormBQueryKey,
  getGetApplicationFormCQueryKey,
} from '@/api/generated/endpoints/applications.gen';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import type { FormCValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { ApiError } from '@/api/fetch';
import { mapFormAToValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { mapFormBToValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { mapFormCToValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';

export function useFormAQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: getGetApplicationFormAQueryKey(applicationId),
    queryFn: ({ signal }) => getApplicationFormA(applicationId, { signal }),
    select: mapFormAToValues,
  });
}

export function useFormBQuery(applicationId: string) {
  return useSuspenseQuery({
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
  });
}

export function useFormCQuery(applicationId: string) {
  return useSuspenseQuery({
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
  });
}
