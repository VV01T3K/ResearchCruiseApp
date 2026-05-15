import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/lib/api';
import { CruiseApplicationDto } from '@/api/dto/applications/CruiseApplicationDto';
import { CruiseDto } from '@/api/dto/applications/ApplicationCruiseDto';
import { EvaluationDto } from '@/api/dto/applications/EvaluationDto';

export function useCruiseApplicationsQuery() {
  return useSuspenseQuery({
    queryKey: ['cruiseApplications'],
    queryFn: async () => {
      return client.get('/api/CruiseApplications');
    },
    select: (res) => res.data as CruiseApplicationDto[],
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
