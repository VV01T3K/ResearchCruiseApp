import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { FormADto } from '@/api/applications/dto/FormADto';
import { FormAInitValuesDto } from '@/api/applications/dto/FormAInitValuesDto';
import { FormBDto } from '@/api/applications/dto/FormBDto';
import { FormBInitValuesDto } from '@/api/applications/dto/FormBInitValuesDto';
import { FormCDto } from '@/api/applications/dto/FormCDto';
import { client } from '@/lib/api';

export function useFormAInitValuesQuery() {
  return useSuspenseQuery({
    queryKey: ['formAInitValues'],
    queryFn: async () => client.get('/v2/applications/form-a/context'),
    select: (res) => res.data as FormAInitValuesDto,
  });
}

export function useFormBInitValuesQuery() {
  return useSuspenseQuery({
    queryKey: ['formBInitValues'],
    queryFn: async () => client.get('/v2/applications/form-b/context'),
    select: (res) => res.data as FormBInitValuesDto,
  });
}

export function useFormAQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: ['formA', applicationId],
    queryFn: async () => client.get(`/v2/applications/${applicationId}/form-a`),
    select: (res) => {
      const dto = res.data as FormADto;
      dto.note ??= '';
      dto.precisePeriodStart ??= '';
      dto.precisePeriodEnd ??= '';
      return dto;
    },
  });
}

export function useFormBQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: ['formB', applicationId],
    queryFn: async () => {
      try {
        return await client.get(`/v2/applications/${applicationId}/form-b`);
      } catch (error) {
        if ((error as AxiosError).status === 404) return { data: null };
        throw error;
      }
    },
    select: (res) => res.data as FormBDto,
    retry: false,
  });
}

export function useFormCQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: ['formC', applicationId],
    queryFn: async () => {
      try {
        return await client.get(`/v2/applications/${applicationId}/form-c`);
      } catch (error) {
        if ((error as AxiosError).status === 404) return { data: null };
        throw error;
      }
    },
    select: (res) => res.data as FormCDto,
    retry: false,
  });
}

export function useSaveFormAMutation() {
  return useMutation({
    mutationFn: async ({ form, draft }: { form: FormADto; draft: boolean }) =>
      client.post('/v2/applications', { form, draft }),
  });
}

export function useUpdateFormAMutation() {
  return useMutation({
    mutationFn: async ({ id, form, draft }: { id: string; form: FormADto; draft: boolean }) =>
      client.put(`/v2/applications/${id}/form-a`, { form: { ...form, id }, draft }),
  });
}

export function useUpdateFormBMutation() {
  return useMutation({
    mutationFn: async ({ id, form, draft }: { id: string; form: FormBDto; draft: boolean }) =>
      client.put(`/v2/applications/${id}/form-b`, { form, draft }),
  });
}

export function useUpdateFormCMutation() {
  return useMutation({
    mutationFn: async ({ id, form, draft }: { id: string; form: FormCDto; draft: boolean }) =>
      client.put(`/v2/applications/${id}/form-c`, { form, draft }),
  });
}

export function useRevertFormBToEditMutation() {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => client.put(`/v2/applications/${id}/form-b/refill`),
  });
}
