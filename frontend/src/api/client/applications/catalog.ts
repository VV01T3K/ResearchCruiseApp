import { keepPreviousData, useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import type { ApplicationPersonResponse } from '@/api/generated/schemas';
import { customFetch } from '@/api/client/custom-fetch';
import type { ApplicationResponse } from '@/api/client/applications/models';

type CruiseApplicationsPage = {
  items: ApplicationResponse[];
  nextCursor: string | null;
};

export type CruiseApplicationsFilter = {
  number?: number[];
  date?: string[];
  status?: string[];
  year?: number[];
  cruiseManager?: string[];
};

export type CruiseApplicationsSort = {
  sortBy: 'number' | 'date' | 'year';
  descending: boolean;
};

const DEFAULT_SORT: CruiseApplicationsSort = { sortBy: 'number', descending: true };

const CRUISE_APPLICATIONS_PAGE_SIZE = 20;

// ASP.NET Core's [FromQuery] List<T> binding only recognizes repeated bare keys
// (number=1&number=2), not bracket notation (number[]=1&number[]=2).
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
  sort,
}: {
  pageParam: string | null;
  filter: CruiseApplicationsFilter;
  sort: CruiseApplicationsSort;
}): Promise<CruiseApplicationsPage> {
  const queryString = serializeRepeatedParams({
    cursor: pageParam ?? undefined,
    pageSize: CRUISE_APPLICATIONS_PAGE_SIZE,
    sortBy: sort.sortBy,
    descending: sort.descending,
    ...filter,
  });
  return customFetch<CruiseApplicationsPage>(`/v2/applications?${queryString}`, { method: 'GET' });
}

export function useCruiseApplicationsInfiniteQuery(
  filter: CruiseApplicationsFilter = {},
  sort: CruiseApplicationsSort = DEFAULT_SORT
) {
  return useInfiniteQuery({
    queryKey: ['cruiseApplications', 'infinite', filter, sort],
    queryFn: ({ pageParam }) => fetchCruiseApplicationsPage({ pageParam, filter, sort }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // Keeps the previous filter's rows (and the currently open filter dropdown) on
    // screen while a new filter's page loads, instead of suspending the whole table.
    placeholderData: keepPreviousData,
    throwOnError: true,
  });
}

export function useCruiseApplicationManagersQuery() {
  return useSuspenseQuery({
    queryKey: ['cruiseApplications', 'managers'],
    queryFn: () => customFetch<ApplicationPersonResponse[]>('/v2/applications/managers', { method: 'GET' }),
  });
}
