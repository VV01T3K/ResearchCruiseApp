import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { FormADto } from '@/api/applications/dto/FormADto';
import { FormAInitValuesDto } from '@/api/applications/dto/FormAInitValuesDto';
import { FormBDto } from '@/api/applications/dto/FormBDto';
import { FormBInitValuesDto } from '@/api/applications/dto/FormBInitValuesDto';
import { FormCDto } from '@/api/applications/dto/FormCDto';
import { ApiError } from '@/api/fetch';
import {
  createApplicationV2,
  getApplicationFormBV2,
  getApplicationFormCV2,
  getGetApplicationFormBV2QueryKey,
  getGetApplicationFormCV2QueryKey,
  refillApplicationFormBV2,
  updateApplicationFormAV2,
  updateApplicationFormBV2,
  updateApplicationFormCV2,
  useGetApplicationFormAContextV2Suspense,
  useGetApplicationFormAV2Suspense,
  useGetApplicationFormBContextV2Suspense,
} from '@/api/generated/endpoints';
import {
  CreateApplicationV2Body,
  UpdateApplicationFormAV2Body,
  UpdateApplicationFormBV2Body,
  UpdateApplicationFormCV2Body,
} from '@/api/generated/model';
import { validateRequest } from '@/api/validateRequest';

function formARequest(form: FormADto, draft: boolean) {
  return {
    form: {
      ...form,
      acceptablePeriod: form.acceptablePeriod || null,
      optimalPeriod: form.optimalPeriod || null,
    },
    draft,
  };
}

export function useFormAInitValuesQuery() {
  return useGetApplicationFormAContextV2Suspense<FormAInitValuesDto>({
    query: { select: (values) => values as FormAInitValuesDto },
  });
}

export function useFormBInitValuesQuery() {
  return useGetApplicationFormBContextV2Suspense<FormBInitValuesDto>({
    query: { select: (values) => values as FormBInitValuesDto },
  });
}

export function useFormAQuery(applicationId: string) {
  return useGetApplicationFormAV2Suspense(applicationId, {
    query: {
      select: (response) => {
        const dto = response as FormADto;
        dto.note ??= '';
        dto.precisePeriodStart ??= '';
        dto.precisePeriodEnd ??= '';
        return dto;
      },
    },
  });
}

export function useFormBQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: getGetApplicationFormBV2QueryKey(applicationId),
    queryFn: async () => {
      try {
        return await getApplicationFormBV2(applicationId);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    select: (response): FormBDto | null => response as FormBDto | null,
    retry: false,
  });
}

export function useFormCQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: getGetApplicationFormCV2QueryKey(applicationId),
    queryFn: async () => {
      try {
        return await getApplicationFormCV2(applicationId);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    select: (response): FormCDto | null => response as FormCDto | null,
    retry: false,
  });
}

export function useSaveFormAMutation() {
  return useMutation({
    mutationFn: async ({ form, draft }: { form: FormADto; draft: boolean }) =>
      createApplicationV2(validateRequest('create-form-a', CreateApplicationV2Body, formARequest(form, draft))),
  });
}

export function useUpdateFormAMutation() {
  return useMutation({
    mutationFn: async ({ id, form, draft }: { id: string; form: FormADto; draft: boolean }) =>
      updateApplicationFormAV2(
        id,
        validateRequest('update-form-a', UpdateApplicationFormAV2Body, formARequest({ ...form, id }, draft))
      ),
  });
}

export function useUpdateFormBMutation() {
  return useMutation({
    mutationFn: async ({ id, form, draft }: { id: string; form: FormBDto; draft: boolean }) =>
      updateApplicationFormBV2(id, validateRequest('update-form-b', UpdateApplicationFormBV2Body, { form, draft })),
  });
}

export function useUpdateFormCMutation() {
  return useMutation({
    mutationFn: async ({ id, form, draft }: { id: string; form: FormCDto; draft: boolean }) =>
      updateApplicationFormCV2(id, validateRequest('update-form-c', UpdateApplicationFormCV2Body, { form, draft })),
  });
}

export function useRevertFormBToEditMutation() {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => refillApplicationFormBV2(id),
  });
}
