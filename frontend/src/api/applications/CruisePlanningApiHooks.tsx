import { useSuspenseQuery } from '@tanstack/react-query';

import { client } from '@/lib/api';
import { CruiseApplicationDto } from '@/api/applications/dto/CruiseApplicationDto';

export function useCruisePlanningCandidatesQuery() {
  return useSuspenseQuery({
    queryKey: ['applications', 'forCruisePlanning'],
    queryFn: async () => client.get<CruiseApplicationDto[]>('/v2/applications/for-cruise-planning'),
    select: (res) => res.data,
  });
}
