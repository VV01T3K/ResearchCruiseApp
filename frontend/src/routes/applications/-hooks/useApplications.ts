import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { getApplications, getGetApplicationsQueryKey } from '@/api/generated/endpoints/applications.gen';
import type { GetApplicationsParams } from '@/api/generated/schemas';

export type CruiseApplicationsFilter = Pick<
  GetApplicationsParams,
  'number' | 'date' | 'status' | 'year' | 'cruiseManager'
>;
export type CruiseApplicationsSort = Required<Pick<GetApplicationsParams, 'sortBy' | 'descending'>>;

const DEFAULT_SORT: CruiseApplicationsSort = { sortBy: 'number', descending: true };
const CRUISE_APPLICATIONS_PAGE_SIZE = 20;

export function useCruiseApplicationsInfiniteQuery(
  filter: CruiseApplicationsFilter = {},
  sort: CruiseApplicationsSort = DEFAULT_SORT
) {
  return useInfiniteQuery({
    // Share the generated invalidation prefix, with a distinct infinite-query cache entry.
    queryKey: [...getGetApplicationsQueryKey(), 'infinite', filter, sort],
    queryFn: ({ pageParam, signal }) =>
      getApplications(
        {
          ...filter,
          ...sort,
          pageSize: CRUISE_APPLICATIONS_PAGE_SIZE,
          cursor: pageParam ?? undefined,
        },
        { signal }
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
    throwOnError: true,
  });
}
