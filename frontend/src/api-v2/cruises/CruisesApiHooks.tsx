import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/lib/api';
import { FileDto } from '@/api/dto/applications/FileDto';
import {
  BlockadePeriodResponse,
  CruiseFormValues,
  CruiseResponse,
  CruiseWriteRequest,
} from '@/api-v2/cruises/contracts';

function toWriteRequest(cruise: CruiseFormValues): CruiseWriteRequest {
  return {
    startDate: cruise.startDate,
    endDate: cruise.endDate,
    mainManagerId: cruise.managersTeam.mainCruiseManagerId,
    deputyManagerId: cruise.managersTeam.mainDeputyManagerId,
    cruiseApplicationIds: cruise.cruiseApplicationsIds ?? [],
    title: cruise.title,
    shipUnavailable: cruise.shipUnavailable,
  };
}

export function useCruisesQuery() {
  return useSuspenseQuery({
    queryKey: ['cruises'],
    queryFn: async () => client.get<CruiseResponse[]>('/v2/cruises'),
    select: (res) => res.data,
  });
}

export function useCruiseQuery(id: string) {
  return useSuspenseQuery({
    queryKey: ['cruises', id],
    queryFn: async () => client.get<CruiseResponse>(`/v2/cruises/${id}`),
    select: (res) => res.data,
  });
}

export function useDeleteCruiseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/v2/cruises/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises'] });
    },
  });
}

export function useAutoPlanCruisesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await client.post('/v2/cruises/auto-plan');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises'] });
    },
  });
}

export function useCreateCruiseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cruise: CruiseFormValues) => {
      await client.post('/v2/cruises', toWriteRequest(cruise));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises'] });
    },
  });
}

export function useUpdateCruiseMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cruise: CruiseFormValues) => {
      await client.patch(`/v2/cruises/${id}`, toWriteRequest(cruise));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises', id] });
    },
  });
}

export function useUpdateCruiseByIdMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, cruise }: { id: string; cruise: CruiseFormValues }) => {
      await client.patch(`/v2/cruises/${id}`, toWriteRequest(cruise));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cruises'] });
      queryClient.invalidateQueries({ queryKey: ['cruises', variables.id] });
    },
  });
}

export function useConfirmCruiseMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await client.put(`/v2/cruises/${id}/confirmation`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises', id] });
    },
  });
}

export function useCompleteCruiseMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await client.put(`/v2/cruises/${id}/completion`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises', id] });
    },
  });
}

export function useRemoveCruiseConfirmationMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => client.delete(`/v2/cruises/${id}/confirmation`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises'] });
      queryClient.invalidateQueries({ queryKey: ['cruises', id] });
    },
  });
}

export function useCruiseCsvExportMutation(onSuccess: (file: FileDto) => void) {
  return useMutation({
    mutationFn: async (year: string) => {
      return (await client.get<FileDto>('/v2/cruises/export', { params: { year } })).data;
    },
    onSuccess,
  });
}

export function useBlockadesQuery(year: number) {
  return useQuery({
    queryKey: ['cruises', 'blockades', year],
    queryFn: async () => client.get<BlockadePeriodResponse[]>('/v2/cruises/blockades', { params: { year } }),
    select: (res) => res.data,
  });
}
