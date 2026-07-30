import { keepPreviousData, useInfiniteQuery, useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/lib/api';
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
  items: CruiseApplicationDto[];
  nextCursor: string | null;
};

export type CruiseApplicationsFilter = {
  number?: number[];
  date?: string[];
  status?: string[];
  year?: number[];
  cruiseManager?: string[];
};

const CRUISE_APPLICATIONS_PAGE_SIZE = 20;

// Axios's default array serialization uses number[]=1&number[]=2, but ASP.NET Core's
// [FromQuery] List<T> binding only recognizes repeated bare keys (number=1&number=2).
function serializeRepeatedParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
}

async function fetchCruiseApplicationsPage({
  pageParam,
  filter,
}: {
  pageParam: string | null;
  filter: CruiseApplicationsFilter;
}): Promise<CruiseApplicationsPage> {
  const res = await client.get('/api/CruiseApplications', {
    params: {
      cursor: pageParam ?? undefined,
      pageSize: CRUISE_APPLICATIONS_PAGE_SIZE,
      ...filter,
    },
    paramsSerializer: { serialize: serializeRepeatedParams },
  });
  return res.data as CruiseApplicationsPage;
}

export function useCruiseApplicationsInfiniteQuery(filter: CruiseApplicationsFilter = {}) {
  return useInfiniteQuery({
    queryKey: ['cruiseApplications', 'infinite', filter],
    queryFn: ({ pageParam }) => fetchCruiseApplicationsPage({ pageParam, filter }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // Keeps the previous filter's rows (and the currently open filter dropdown) on
    // screen while a new filter's page loads, instead of suspending the whole table.
    placeholderData: keepPreviousData,
    throwOnError: true,
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
