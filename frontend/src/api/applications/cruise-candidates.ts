import type { ApplicationResponse } from '@/api/applications/models';
import type { CruiseApplicationCandidate } from '@/api/applications/types/CruiseApplicationCandidate';
import type { CruiseApplicationSummary } from '@/api/generated/schemas';

export function mapCruiseApplicationCandidate(application: CruiseApplicationSummary): CruiseApplicationCandidate {
  return {
    id: application.id ?? '',
    number: application.number ?? '',
    date: application.date ?? '',
    year: application.year ?? 0,
    cruiseManagerId: application.cruiseManagerId ?? '',
    cruiseManagerEmail: application.cruiseManagerEmail ?? '',
    cruiseManagerFirstName: application.cruiseManagerFirstName ?? '',
    cruiseManagerLastName: application.cruiseManagerLastName ?? '',
    deputyManagerId: application.deputyManagerId ?? '',
    deputyManagerEmail: application.deputyManagerEmail ?? '',
    deputyManagerFirstName: application.deputyManagerFirstName ?? '',
    deputyManagerLastName: application.deputyManagerLastName ?? '',
    hasFormA: application.hasFormA ?? false,
    hasFormB: application.hasFormB ?? false,
    hasFormC: application.hasFormC ?? false,
    points: application.points ?? 0,
    status: application.status ?? 'draft',
    effectsDoneRate: application.effectsDoneRate ?? '0',
    note: application.note ?? '',
    cruiseHours: application.cruiseHours ?? '',
    cruiseDays: application.cruiseDays ?? 0,
    acceptablePeriodBeg: application.acceptablePeriodBeg ?? '',
    acceptablePeriodEnd: application.acceptablePeriodEnd ?? '',
    optimalPeriodBeg: application.optimalPeriodBeg ?? '',
    optimalPeriodEnd: application.optimalPeriodEnd ?? '',
    precisePeriodStart: application.precisePeriodStart ?? '',
    precisePeriodEnd: application.precisePeriodEnd ?? '',
    startDate: application.startDate ?? '',
    endDate: application.endDate ?? '',
  };
}

export function mapApplicationToCruiseCandidate(application: ApplicationResponse): CruiseApplicationCandidate {
  return {
    ...application,
    cruiseManagerId: application.mainManager.id,
    cruiseManagerEmail: application.mainManager.email,
    cruiseManagerFirstName: application.mainManager.firstName,
    cruiseManagerLastName: application.mainManager.lastName,
    deputyManagerId: application.deputyManager.id,
    deputyManagerEmail: application.deputyManager.email,
    deputyManagerFirstName: application.deputyManager.firstName,
    deputyManagerLastName: application.deputyManager.lastName,
    note: application.note ?? '',
    cruiseHours: application.cruiseHours ?? '',
    cruiseDays: application.cruiseDays ?? 0,
    acceptablePeriodBeg: application.acceptablePeriodBeg ?? '',
    acceptablePeriodEnd: application.acceptablePeriodEnd ?? '',
    optimalPeriodBeg: application.optimalPeriodBeg ?? '',
    optimalPeriodEnd: application.optimalPeriodEnd ?? '',
    precisePeriodStart: application.precisePeriodStart ?? '',
    precisePeriodEnd: application.precisePeriodEnd ?? '',
    startDate: application.startDate ?? '',
    endDate: application.endDate ?? '',
  };
}
