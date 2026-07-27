import { useMutation, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/lib/api';
import { getApplications } from '@/api/generated/endpoints/applications.gen';
import { ApplicationResponse } from '@/api/client/applications/models';
import { CruiseApplicationDto } from '@/api/dto/applications/CruiseApplicationDto';
import { CruiseDto } from '@/api/dto/applications/ApplicationCruiseDto';
import { EvaluationDto } from '@/api/dto/applications/EvaluationDto';
import { UserEffectDto } from '@/api/dto/applications/UserEffectDto';

export function useCruiseApplicationsQuery() {
  return useSuspenseQuery({
    queryKey: ['cruiseApplications'],
    queryFn: async () => {
      return client.get('/api/CruiseApplications');
    },
    select: (res) => res.data as CruiseApplicationDto[],
  });
}

type CruiseApplicationsPage = {
  items: ApplicationResponse[];
  nextCursor: string | null;
};

async function fetchCruiseApplicationsPage(): Promise<CruiseApplicationsPage> {
  const items = await getApplications();
  return { items, nextCursor: null };
}

export function useCruiseApplicationsInfiniteQuery() {
  return useSuspenseInfiniteQuery({
    queryKey: ['cruiseApplications', 'infinite'],
    queryFn: fetchCruiseApplicationsPage,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useCruiseApplicationQuery(id: string) {
  return useSuspenseQuery({
    queryKey: ['cruiseApplications', id],
    queryFn: async () => {
      return client.get(`/api/CruiseApplications/${id}`);
    },
    select: (res) => res.data as CruiseApplicationDto,
  });
}

export function useCruiseForCruiseApplicationQuery(id: string) {
  return useSuspenseQuery({
    queryKey: ['cruiseApplication', id, 'cruise'],
    queryFn: async () => {
      return client.get(`/api/CruiseApplications/${id}/cruise`);
    },
    select: (res) => res.data as CruiseDto,
  });
}

export function useEvaluationQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: ['CruiseApplications', applicationId, 'evaluation'],
    queryFn: async () => {
      return client.get(`/api/CruiseApplications/${applicationId}/evaluation`);
    },
    select: (res) => res.data as EvaluationDto,
  });
}

export function useEffectsEvaluationsQuery() {
  return useSuspenseQuery({
    queryKey: ['effectsEvaluations'],
    queryFn: async () => {
      return client.get('/api/CruiseApplications/effectsEvaluations');
    },
    select: (res) => res.data as UserEffectDto[],
  });
}

export function useAcceptApplicationMutation() {
  return useMutation({
    mutationFn: async (applicationId: string) => {
      return client.patch(`/api/CruiseApplications/${applicationId}/answer?accept=true`);
    },
  });
}

export function useRejectApplicationMutation() {
  return useMutation({
    mutationFn: async (applicationId: string) => {
      return client.patch(`/api/CruiseApplications/${applicationId}/answer?accept=false`);
    },
  });
}
