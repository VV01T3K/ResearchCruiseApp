import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { client } from '@/core/lib/api';
import { FormCDto } from '@/cruise-applications/models/FormCDto';

export function useFormCQuery(cruiseId: string) {
  return useSuspenseQuery({
    queryKey: ['formC', cruiseId],
    queryFn: async () => {
      try {
        return await client.get(`/api/CruiseApplications/${cruiseId}/formC`);
      } catch (error) {
        const { status } = error as AxiosError;

        if (status === 404) {
          return { data: null };
        }

        throw error;
      }
    },
    select: (res) => {
      return res.data as FormCDto;
    },
    retry: false,
  });
}

type UpdateFormCProps = {
  id: string;
  form: FormCDto;
  draft: boolean;
};
export function useUpdateFormCMutation() {
  return useMutation({
    mutationFn: async ({ id, form, draft }: UpdateFormCProps) => {
      return client.put(`/api/CruiseApplications/${id}/FormC?isDraft=${draft}`, form);
    },
  });
}

type RevertFormCToEditProps = {
  id: string;
};
export function useRevertFormCToEditMutation() {
  return useMutation({
    mutationFn: async ({ id }: RevertFormCToEditProps) => {
      return client.put(`/api/CruiseApplications/${id}/FormC/Refill`);
    },
  });
}
