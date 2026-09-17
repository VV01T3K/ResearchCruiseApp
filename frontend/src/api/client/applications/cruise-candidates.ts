import type { CruiseApplicationCandidate } from '@/api/client/applications/types/CruiseApplicationCandidate';
import type { CruiseApplicationCandidateResponse } from '@/api/generated/schemas';

export function mapCruiseApplicationCandidate(
  application: CruiseApplicationCandidateResponse
): CruiseApplicationCandidate {
  return {
    id: application.id ?? '',
    number: application.number ?? '',
    year: application.year ?? 0,
    cruiseManagerId: application.cruiseManagerId ?? '',
    cruiseManagerFirstName: application.cruiseManagerFirstName ?? '',
    cruiseManagerLastName: application.cruiseManagerLastName ?? '',
    deputyManagerId: application.deputyManagerId ?? '',
    hasFormA: application.hasFormA ?? false,
    hasFormB: application.hasFormB ?? false,
    hasFormC: application.hasFormC ?? false,
    points: application.points ?? 0,
  };
}
