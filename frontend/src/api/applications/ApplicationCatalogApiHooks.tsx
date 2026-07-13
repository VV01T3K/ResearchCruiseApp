import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/lib/api';
import { CruiseResponse } from '@/api/cruises/contracts';

import { ApplicationResponse, EvaluationResponse } from './contracts';

export function useApplicationsQuery() {
  return useSuspenseQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      return client.get('/v2/applications');
    },
    select: (res) => res.data as ApplicationResponse[],
  });
}

export function useApplicationQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: ['applications', applicationId],
    queryFn: async () => {
      return client.get(`/v2/applications/${applicationId}`);
    },
    select: (res) => res.data as ApplicationResponse,
  });
}

export function useApplicationCruiseQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: ['applications', applicationId, 'cruise'],
    queryFn: async () => {
      return client.get(`/v2/applications/${applicationId}/cruise`);
    },
    select: (res) => res.data as CruiseResponse,
  });
}

export function useApplicationEvaluationQuery(applicationId: string) {
  return useSuspenseQuery({
    queryKey: ['applications', applicationId, 'evaluation'],
    queryFn: async () => {
      return client.get(`/v2/applications/${applicationId}/evaluation`);
    },
    select: (res) => res.data as EvaluationResponse,
  });
}

export function useAcceptApplicationMutation() {
  return useMutation({
    mutationFn: async (applicationId: string) => {
      return client.put(`/v2/applications/${applicationId}/decision`, { accept: true });
    },
  });
}

export function useRejectApplicationMutation() {
  return useMutation({
    mutationFn: async (applicationId: string) => {
      return client.put(`/v2/applications/${applicationId}/decision`, { accept: false });
    },
  });
}
