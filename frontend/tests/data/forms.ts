import type { FormAOptions, FormAFields, FormBFields, FormCFields, ResearchTaskFields } from '@/api/generated/schemas';
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
    revision: 'AAAAAAAAB9E=',
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
    revision: 'AAAAAAAAB9E=',
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
    revision: 'AAAAAAAAB9E=',
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

/** A research task in the backend's shape, where fields of other task types are null. */
function task(fields: Partial<ResearchTaskFields>): ResearchTaskFields {
  return {
    type: '0',
    title: null,
    magazine: null,
    author: null,
    institution: null,
    date: null,
    startDate: null,
    endDate: null,
    financingAmount: null,
    financingApproved: null,
    description: null,
    securedAmount: null,
    ministerialPoints: null,
    ...fields,
  };
}

const pdf = { name: 'skan.pdf', content: 'data:application/pdf;base64,JVBERi0xLjQKJSVFT0Y=' };

/** Form A with a row in every section, as an application that was filled in completely. */
export function filledFormA(): FormAFields {
  return {
    ...formA(),
    acceptablePeriod: ['3', '17'],
    optimalPeriod: ['5', '9'],
    periodNotes: 'Najlepiej latem',
    shipUsage: '4',
    differentUsage: 'Pomiary nocne',
    permissions: [{ description: 'Pobór próbek', executive: 'Urząd Morski', scan: null }],
    researchAreaDescriptions: [
      { areaId, differentName: null, info: 'Stacja P1' },
      { areaId: null, differentName: 'Rynna Słupska', info: '' },
    ],
    researchTasks: [
      task({ type: '0', author: 'Ada Lovelace', title: 'Zasolenie Bałtyku' }),
      task({ type: '3', title: 'Wniosek NCN', date: '2026-03-01', financingApproved: 'true' }),
      task({
        type: '4',
        title: 'Projekt krajowy',
        startDate: '2026-01-01',
        endDate: '2026-12-01',
        financingAmount: '1500.5',
        securedAmount: '200',
      }),
      task({ type: '9', description: 'Zajęcia terenowe' }),
      task({
        type: '10',
        title: 'Własne badania',
        date: '2026-05-01',
        magazine: 'Oceanologia',
        ministerialPoints: '70',
      }),
    ],
    contracts: [
      {
        category: 'international',
        institutionName: 'Instytut Morski',
        institutionUnit: 'Zakład Biologii',
        institutionLocalization: 'Gdynia',
        description: 'Umowa ramowa',
        scans: [pdf],
      },
    ],
    guestTeams: [{ name: 'Instytut Oceanologii PAN', noOfPersons: '3' }],
    publications: [
      {
        id: '66666666-6666-4666-8666-666666666666',
        category: 'subject',
        doi: '10.1000/abc',
        authors: 'Kowalski J.',
        title: 'Bałtyk',
        magazine: 'Oceanologia',
        year: '2024',
        ministerialPoints: '100',
      },
    ],
    spubTasks: [{ name: 'Monitoring', yearFrom: '2020', yearTo: '2025' }],
  };
}

/** Form B with a row in every section. */
export function filledFormB(): FormBFields {
  return {
    ...formB(),
    isCruiseManagerPresent: 'false',
    permissions: [{ description: 'Pobór próbek', executive: 'Urząd Morski', scan: pdf }],
    guestTeams: [{ name: 'Instytut Oceanologii PAN', noOfPersons: '3' }],
    crewMembers: [
      {
        title: 'dr',
        firstName: 'Grace',
        lastName: 'Hopper',
        birthPlace: 'Gdańsk',
        birthDate: '1990-01-01',
        documentNumber: 'ABC123',
        documentExpiryDate: '2030-01-01',
        institution: 'Uniwersytet Gdański',
      },
    ],
    shortResearchEquipments: [{ name: 'Sonda CTD', startDate: '2026-06-01', endDate: '2026-06-02' }],
    longResearchEquipments: [{ name: 'Boja', action: 'Put', duration: '10' }],
    ports: [{ name: 'Gdynia', startTime: '2026-06-01', endTime: '2026-06-02' }],
    cruiseDaysDetails: [
      { number: '1', hours: '8', taskName: 'Pomiary', region: 'Zatoka', position: '54N 18E', comment: 'Rano' },
    ],
    researchEquipments: [
      { name: 'Echosonda', insuranceStartDate: '2026-01-01', insuranceEndDate: '2026-12-31', permission: 'true' },
    ],
  };
}

/** Form C with a row in every section. */
export function filledFormC(): FormCFields {
  const b = filledFormB();
  return {
    ...formC(),
    shipUsage: '4',
    differentUsage: 'Pomiary nocne',
    permissions: b.permissions,
    researchAreaDescriptions: filledFormA().researchAreaDescriptions,
    guestTeams: b.guestTeams,
    researchTasksEffects: [
      {
        ...task({ type: '0', author: 'Ada Lovelace', title: 'Zasolenie Bałtyku' }),
        done: 'true',
        managerConditionMet: 'true',
        deputyConditionMet: 'false',
        publicationMinisterialPoints: null,
      },
    ],
    contracts: filledFormA().contracts,
    spubTasks: filledFormA().spubTasks,
    shortResearchEquipments: b.shortResearchEquipments,
    longResearchEquipments: b.longResearchEquipments,
    ports: b.ports,
    cruiseDaysDetails: b.cruiseDaysDetails,
    researchEquipments: b.researchEquipments,
    collectedSamples: [{ type: 'Woda', amount: '3', analysis: 'Zasolenie', publishing: 'Artykuł' }],
    spubReportData: 'Raport SPUB',
    additionalDescription: 'Bez uwag',
    photos: [{ name: 'zdjecie.jpg', content: 'data:image/jpeg;base64,/9j/2Q==' }],
  };
}
