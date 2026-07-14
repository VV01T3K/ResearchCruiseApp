import { useSuspenseQuery } from '@tanstack/react-query';

import {
  getApplicationFormA,
  getApplicationFormB,
  getApplicationFormC,
  getGetApplicationFormAQueryKey,
  getGetApplicationFormBQueryKey,
  getGetApplicationFormCQueryKey,
} from '@/api/generated/endpoints/applications.gen';
import type { FormADto } from '@/routes/applications/$applicationId/-schemas/types/FormADto';
import type { FormBDto } from '@/routes/applications/$applicationId/-schemas/types/FormBDto';
import type { FormCDto } from '@/routes/applications/$applicationId/-schemas/types/FormCDto';
import { ApiError } from '@/lib/custom-fetch';

export function useFormAQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: getGetApplicationFormAQueryKey(applicationId),
    queryFn: async () => {
      const form = (await getApplicationFormA(applicationId)) as FormADto;
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
    queryFn: async (): Promise<FormBDto | null> => {
      try {
        return (await getApplicationFormB(applicationId)) as FormBDto;
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
    queryFn: async (): Promise<FormCDto | null> => {
      try {
        return (await getApplicationFormC(applicationId)) as FormCDto;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    retry: false,
  });
}
