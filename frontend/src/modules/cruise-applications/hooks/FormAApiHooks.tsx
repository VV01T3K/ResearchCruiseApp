import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/core/lib/api';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';

export function useFormAInitValuesQuery() {
  return useSuspenseQuery({
    queryKey: ['formAInitValues'],
    queryFn: async () => {
      return client.get('/forms/InitValues/A');
    },
    select: (res) => res.data as FormAInitValuesDto,
  });
}

export function useFormAQuery(cruiseId: string) {
  return useSuspenseQuery({
    queryKey: ['formA', cruiseId],
    queryFn: async () => {
      return client.get(`/api/CruiseApplications/${cruiseId}/formA`);
    },
    select: (res) => res.data as FormADto,
  });
}

type SaveFormAProps = {
  form: FormADto;
  draft: boolean;
};
export function useSaveFormAMutation() {
  return useMutation({
    mutationFn: async ({ form, draft }: SaveFormAProps) => {
      return client.post(`/api/CruiseApplications?isDraft=${draft}`, form);
    },
  });
}

type UpdateFormAProps = {
  id: string;
  form: FormADto;
  draft: boolean;
};
export function useUpdateFormAMutation() {
  return useMutation({
    mutationFn: async ({ id, form, draft }: UpdateFormAProps) => {
      form.id = id;
      return client.put(`/api/CruiseApplications/${id}/FormA?isDraft=${draft}`, form);
    },
  });
}
