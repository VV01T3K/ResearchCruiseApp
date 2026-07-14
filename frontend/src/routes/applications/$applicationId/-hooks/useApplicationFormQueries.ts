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
import { ApiError } from '@/lib/custom-fetch';
import { mapFormAToValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { mapFormBToValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { mapFormCToValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';

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
        return mapFormBToValues(await getApplicationFormB(applicationId));
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
        return mapFormCToValues(await getApplicationFormC(applicationId));
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    retry: false,
  });
}
