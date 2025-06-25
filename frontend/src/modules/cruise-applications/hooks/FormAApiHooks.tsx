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
    select: (res) => {
      const dto = res.data as FormADto;
      dto.note ??= '';
      dto.precisePeriodStart ??= '';
      dto.precisePeriodEnd ??= '';
      return dto;
    },
  });
}

type SupervisorFormQueryProps = {
  cruiseId: string;
  supervisorCode: string;
};
export function useFormAForSupervisorInitValuesQuery({ cruiseId, supervisorCode }: SupervisorFormQueryProps) {
  return useSuspenseQuery({
    queryKey: ['formAForSupervisorInitValues', cruiseId, supervisorCode],
    queryFn: async () => {
      return client.get(
        `/forms/InitValuesForSupervisor/A?cruiseApplicationId=${cruiseId}&supervisorCode=${supervisorCode}`
      );
    },
    select: (res) => res.data as FormAInitValuesDto,
  });
}

export function useFormAForSupervisorQuery({ cruiseId, supervisorCode }: SupervisorFormQueryProps) {
  return useSuspenseQuery({
    queryKey: ['formAForSupervisor', cruiseId, supervisorCode],
    queryFn: async () => {
      return client.get(`/api/CruiseApplications/${cruiseId}/formAForSupervisor?supervisorCode=${supervisorCode}`);
    },
    select: (res) => {
      const dto = res.data as FormADto;
      dto.note ??= '';
      return dto;
    },
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

type SupervisorAnswerFormAProps = {
  id: string;
  accept: boolean;
  supervisorCode: string;
};
export function useSupervisorAnswerFormAMutation() {
  return useMutation({
    mutationFn: async ({ id, accept, supervisorCode }: SupervisorAnswerFormAProps) => {
      return client.patch(`/api/CruiseApplications/${id}
    /supervisorAnswer?accept=${accept}&supervisorCode=${supervisorCode}`);
    },
  });
}
