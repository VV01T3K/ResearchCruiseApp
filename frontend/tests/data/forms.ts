import type { FormAOptions, FormAFields, FormBFields, FormCFields } from '@/api/generated/schemas';
import { manager, deputy } from './accounts';

export const applicationId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
export const unitId = '33333333-3333-4333-8333-333333333333';
export const areaId = '44444444-4444-4444-8444-444444444444';

export function formOptions(): FormAOptions {
  return {
    cruiseManagers: [manager, deputy],
    deputyManagers: [manager, deputy],
    years: ['2026', '2027'],
    shipUsages: ['całą dobę', 'w dzień', 'w nocy', 'część doby', 'w inny sposób'],
    cruiseGoals: ['Badawczy', 'Komercyjny', 'Dydaktyczny'],
    researchAreas: [{ id: areaId, name: 'Zatoka Gdańska' }],
    ugUnits: [{ id: unitId, name: 'Wydział Oceanografii' }],
    standardSpubTasks: [],
    historicalResearchTasks: [],
    historicalContracts: [],
    historicalGuestInstitutions: [],
    historicalSpubTasks: [],
    historicalPublications: [],
  };
}

export function formA(): FormAFields {
  return {
    id: applicationId,
    cruiseManagerId: manager.id,
    deputyManagerId: deputy.id,
    year: '2026',
    acceptablePeriod: ['0', '24'],
    optimalPeriod: ['0', '24'],
    periodSelectionType: 'period',
    precisePeriodStart: null,
    precisePeriodEnd: null,
    cruiseHours: '27',
    periodNotes: '',
    shipUsage: '0',
    differentUsage: '',
    permissions: [],
    researchAreaDescriptions: [{ areaId, differentName: null, info: '' }],
    cruiseGoal: '0',
    cruiseGoalDescription: 'Pomiary zasolenia',
    researchTasks: [{ type: '0', author: 'Ada Lovelace', title: 'Zasolenie Bałtyku' }],
    contracts: [],
    ugTeams: [{ ugUnitId: unitId, noOfEmployees: '2', noOfStudents: '1' }],
    guestTeams: [],
    publications: [],
    spubTasks: [],
    supervisorEmail: 'supervisor@example.com',
    note: null,
  };
}

export function formB(): FormBFields {
  return {
    isCruiseManagerPresent: 'true',
    permissions: [],
    ugTeams: [{ ugUnitId: unitId, noOfEmployees: '2', noOfStudents: '1' }],
    guestTeams: [],
    crewMembers: [],
    shortResearchEquipments: [],
    longResearchEquipments: [],
    ports: [],
    cruiseDaysDetails: [],
    researchEquipments: [],
    shipEquipmentsIds: [],
  };
}

export function formC(): FormCFields {
  return {
    shipUsage: '0',
    differentUsage: '',
    permissions: [],
    researchAreaDescriptions: [{ areaId, differentName: null, info: '' }],
    ugTeams: [{ ugUnitId: unitId, noOfEmployees: '2', noOfStudents: '1' }],
    guestTeams: [],
    researchTasksEffects: [
      {
        type: '0',
        author: 'Ada Lovelace',
        title: 'Zasolenie Bałtyku',
        done: 'false',
        managerConditionMet: 'false',
        deputyConditionMet: 'false',
      },
    ],
    contracts: [],
    spubTasks: [],
    shortResearchEquipments: [],
    longResearchEquipments: [],
    ports: [],
    cruiseDaysDetails: [],
    researchEquipments: [],
    shipEquipmentsIds: [],
    collectedSamples: [],
    spubReportData: '',
    additionalDescription: '',
    photos: [],
  };
}
