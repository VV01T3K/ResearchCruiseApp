import { useSuspenseQuery } from '@tanstack/react-query';

import {
  getApplicationFormA,
  getApplicationFormB,
  getApplicationFormC,
  getGetApplicationFormAQueryKey,
  getGetApplicationFormBQueryKey,
  getGetApplicationFormCQueryKey,
} from '@/api/generated/endpoints/applications.gen';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/types/FormBValues';
import type { FormCValues } from '@/routes/applications/$applicationId/-schemas/types/FormCValues';
import { ApiError } from '@/lib/custom-fetch';
import { mapFormAToValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';

export function useFormAQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: getGetApplicationFormAQueryKey(applicationId),
    queryFn: async () => {
      return mapFormAToValues(await getApplicationFormA(applicationId));
    },
  });
}

export function useFormBQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: getGetApplicationFormBQueryKey(applicationId),
    queryFn: async (): Promise<FormBValues | null> => {
      try {
        return (await getApplicationFormB(applicationId)) as FormBValues;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    retry: false,
  });
}

export function useFormCQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: getGetApplicationFormCQueryKey(applicationId),
    queryFn: async (): Promise<FormCValues | null> => {
      try {
        return (await getApplicationFormC(applicationId)) as FormCValues;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    retry: false,
  });
}
