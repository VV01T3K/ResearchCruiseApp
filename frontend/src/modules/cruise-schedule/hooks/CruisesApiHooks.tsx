import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/core/lib/api';
import { FileDto } from '@/cruise-applications/models/FileDto';
import { CruiseDto } from '@/cruise-schedule/models/CruiseDto';
import { CruiseFormDto } from '@/cruise-schedule/models/CruiseFormDto';

export function useCruisesQuery() {
  return useSuspenseQuery({
    queryKey: ['cruises'],
    queryFn: async () => {
      return client.get('/api/Cruises');
    },
    select: (res) => res.data as CruiseDto[],
  });
}

export function useCruiseQuery(id: string) {
  return useSuspenseQuery({
    queryKey: ['cruises', id],
    queryFn: async () => {
      return client.get(`/api/Cruises/${id}`);
    },
    select: (res) => res.data as CruiseDto,
  });
}

export function useCruiseApplicationsForCruiseQuery() {
  return useSuspenseQuery({
    queryKey: ['cruiseApplications', 'forCruise'],
    queryFn: async () => {
      return client.get('/api/CruiseApplications/forCruise');
    },
    select: (res) => res.data,
  });
}

export function useDeleteCruiseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/api/Cruises/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises'] });
    },
  });
}

export function useAutoAddCruisesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await client.put('/api/Cruises/autoAdded');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises'] });
    },
  });
}

export function useCreateCruiseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cruise: CruiseFormDto) => {
      await client.post('/api/Cruises', cruise);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises'] });
    },
  });
}

export function useUpdateCruiseMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cruise: CruiseFormDto) => {
      await client.patch(`/api/Cruises/${id}`, cruise);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises', id] });
    },
  });
}

export function useConfirmCruiseMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await client.put(`/api/Cruises/${id}/confirm`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises', id] });
    },
  });
}

export function useEndCruiseMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await client.put(`/api/Cruises/${id}/end`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises', id] });
    },
  });
}

export function useRevertCruiseStatusMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return client.put(`/api/Cruises/${id}/revert`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cruises'] });
      queryClient.invalidateQueries({ queryKey: ['cruises', id] });
    },
  });
}

export function useCruiseCsvExportMutation(onSuccess: (file: FileDto) => void) {
  return useMutation({
    mutationFn: async (year: string) => {
      return (await client.get(`/api/Cruises/csv`, { params: { year } })).data;
    },
    onSuccess: (data) => {
      const file = {
        name: data.name,
        content: data.content,
      };
      onSuccess(file);
    },
  });
}
