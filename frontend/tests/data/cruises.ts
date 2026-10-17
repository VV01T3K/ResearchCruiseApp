import type { ApplicationResponse, CruiseApplicationEvaluation, CruiseResponse } from '@/api/generated/schemas';
import { manager, deputy } from './accounts';
import { applicationId } from './forms';

export function application(): ApplicationResponse {
  return {
    id: applicationId,
    number: '2026/17',
    year: 2026,
    date: '2026-05-16',
    mainManager: manager,
    deputyManager: deputy,
    hasFormA: true,
    hasFormB: false,
    hasFormC: false,
    points: 7,
    status: 'acceptedBySupervisor',
    effectsDoneRate: '0',
    note: null,
    cruiseHours: '27',
    cruiseDays: 1,
    acceptablePeriodBeg: '0',
    acceptablePeriodEnd: '24',
    optimalPeriodBeg: '0',
    optimalPeriodEnd: '24',
    precisePeriodStart: null,
    precisePeriodEnd: null,
    startDate: null,
    endDate: null,
  };
}

export function cruise(): CruiseResponse {
  return {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    number: '2026/1',
    startDate: '2026-06-01T08:00:00Z',
    endDate: '2026-06-02T11:00:00Z',
    mainManager: manager,
    deputyManager: deputy,
    applications: [],
    status: 'new',
    title: 'Bałtyk',
    shipUnavailable: false,
  };
}

export function evaluation(): CruiseApplicationEvaluation {
  return {
    formAResearchTasks: [],
    formAContracts: [],
    ugTeams: [],
    guestTeams: [],
    ugUnitsPoints: '0',
    formAPublications: [],
    formASpubTasks: [],
    effectsPoints: '0',
  };
}
