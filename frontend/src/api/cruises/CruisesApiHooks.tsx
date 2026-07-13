import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { FileDto } from '@/api/applications/dto/FileDto';
import { CruiseFormValues, CruiseResponse } from '@/api/cruises/contracts';
import {
  autoPlanCruisesV2,
  completeCruiseV2,
  confirmCruiseV2,
  createCruiseV2,
  deleteCruiseV2,
  exportCruisesV2,
  getCruiseBlockadesV2,
  getGetCruiseBlockadesV2QueryKey,
  getGetCruisesV2QueryKey,
  getGetCruiseV2QueryKey,
  removeCruiseConfirmationV2,
  updateCruiseV2,
  useGetCruisesV2Suspense,
  useGetCruiseV2Suspense,
} from '@/api/generated/endpoints';
import { CreateCruiseV2Body, UpdateCruiseV2Body } from '@/api/generated/model';
import { validateRequest } from '@/api/validateRequest';

function toWriteRequest(cruise: CruiseFormValues): Parameters<typeof createCruiseV2>[0] {
  return {
    startDate: cruise.startDate,
    endDate: cruise.endDate,
    mainManagerId: cruise.managersTeam.mainCruiseManagerId,
    deputyManagerId: cruise.managersTeam.mainDeputyManagerId,
    cruiseApplicationIds: cruise.cruiseApplicationsIds ?? [],
    title: cruise.title ?? null,
    shipUnavailable: cruise.shipUnavailable,
  };
}

export function useCruisesQuery() {
  return useGetCruisesV2Suspense<CruiseResponse[]>({ query: { select: (cruises) => cruises as CruiseResponse[] } });
}

export function useCruiseQuery(id: string) {
  return useGetCruiseV2Suspense<CruiseResponse>(id, { query: { select: (cruise) => cruise as CruiseResponse } });
}

export function useDeleteCruiseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteCruiseV2(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetCruisesV2QueryKey() });
    },
  });
}

export function useAutoPlanCruisesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await autoPlanCruisesV2();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetCruisesV2QueryKey() });
    },
  });
}

export function useCreateCruiseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cruise: CruiseFormValues) => {
      await createCruiseV2(validateRequest('create-cruise', CreateCruiseV2Body, toWriteRequest(cruise)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetCruisesV2QueryKey() });
    },
  });
}

export function useUpdateCruiseMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cruise: CruiseFormValues) => {
      await updateCruiseV2(id, validateRequest('update-cruise', UpdateCruiseV2Body, toWriteRequest(cruise)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetCruiseV2QueryKey(id) });
    },
  });
}

export function useUpdateCruiseByIdMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, cruise }: { id: string; cruise: CruiseFormValues }) => {
      await updateCruiseV2(id, validateRequest('update-cruise', UpdateCruiseV2Body, toWriteRequest(cruise)));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetCruisesV2QueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetCruiseV2QueryKey(variables.id) });
    },
  });
}

export function useConfirmCruiseMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await confirmCruiseV2(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetCruiseV2QueryKey(id) });
    },
  });
}

export function useCompleteCruiseMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await completeCruiseV2(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetCruiseV2QueryKey(id) });
    },
  });
}

export function useRemoveCruiseConfirmationMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => removeCruiseConfirmationV2(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetCruisesV2QueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetCruiseV2QueryKey(id) });
    },
  });
}

export function useCruiseCsvExportMutation(onSuccess: (file: FileDto) => void) {
  return useMutation({
    mutationFn: async (year: string) => {
      return exportCruisesV2({ year });
    },
    onSuccess,
  });
}

export function useBlockadesQuery(year: number) {
  return useQuery({
    queryKey: getGetCruiseBlockadesV2QueryKey({ year }),
    queryFn: async () => getCruiseBlockadesV2({ year }),
  });
}
