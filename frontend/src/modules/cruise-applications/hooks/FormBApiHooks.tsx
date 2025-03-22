import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { client } from '@/core/lib/api';
import { FormBDto } from '@/cruise-applications/models/FormBDto';
import { FormBInitValuesDto } from '@/cruise-applications/models/FormBInitValuesDto';

export function useFormBInitValuesQuery() {
  return useSuspenseQuery({
    queryKey: ['formBInitValues'],
    queryFn: async () => {
      return client.get('/forms/InitValues/B');
    },
    select: (res) => res.data as FormBInitValuesDto,
  });
}

export function useFormBQuery(cruiseId: string) {
  return useSuspenseQuery({
    queryKey: ['formB', cruiseId],
    queryFn: async () => {
      try {
        return await client.get(`/api/CruiseApplications/${cruiseId}/formB`);
      } catch (error) {
        const { status } = error as AxiosError;

        if (status === 404) {
          return { data: null };
        }

        throw error;
      }
    },
    select: (res) => {
      return res.data as FormBDto;
    },
    retry: false,
  });
}

type UpdateFormBProps = {
  id: string;
  form: FormBDto;
  draft: boolean;
};
export function useUpdateFormBMutation() {
  return useMutation({
    mutationFn: async ({ id, form, draft }: UpdateFormBProps) => {
      return client.put(`/api/CruiseApplications/${id}/FormB?isDraft=${draft}`, form);
    },
  });
}

type RevertFormBToEditProps = {
  id: string;
};
export function useRevertFormBToEditMutation() {
  return useMutation({
    mutationFn: async ({ id }: RevertFormBToEditProps) => {
      return client.put(`/api/CruiseApplications/${id}/FormB/Refill`);
    },
  });
}
