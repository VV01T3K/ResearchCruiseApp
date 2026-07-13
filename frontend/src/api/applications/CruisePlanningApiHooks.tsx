import { useGetApplicationsForCruisePlanningV2Suspense } from '@/api/generated/endpoints';
import { CruiseApplicationDto } from '@/api/applications/dto/CruiseApplicationDto';

export function useCruisePlanningCandidatesQuery() {
  return useGetApplicationsForCruisePlanningV2Suspense<CruiseApplicationDto[]>({
    query: { select: (applications) => applications as CruiseApplicationDto[] },
  });
}
