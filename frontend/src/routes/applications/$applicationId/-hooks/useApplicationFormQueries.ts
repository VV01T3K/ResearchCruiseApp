import { useSuspenseQuery } from '@tanstack/react-query';

import {
  getApplicationFormA,
  getApplicationFormB,
  getApplicationFormC,
  getGetApplicationFormAQueryKey,
  getGetApplicationFormBQueryKey,
  getGetApplicationFormCQueryKey,
} from '@/api/generated/endpoints/applications.gen';
import type { FormAValues } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/types/FormBValues';
import type { FormCValues } from '@/routes/applications/$applicationId/-schemas/types/FormCValues';
import { ApiError } from '@/lib/custom-fetch';

export function useFormAQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: getGetApplicationFormAQueryKey(applicationId),
    queryFn: async () => {
      const form = (await getApplicationFormA(applicationId)) as FormAValues;
      form.note ??= '';
      form.precisePeriodStart ??= '';
      form.precisePeriodEnd ??= '';
      return form;
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
