import { describe, expect, it } from 'vitest';

import formABase from '@tests/assets/api-mocks/api_CruiseApplications_id_formA.json' with { type: 'json' };
import initValuesJson from '@tests/assets/api-mocks/api_forms_InitValues_A.json' with { type: 'json' };

import {
  formADefaultValues,
  type FormAValues,
  getFormAValidationSchema,
  mapFormAToValues,
} from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { CruiseGoal } from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import { PublicationCategory } from '@/routes/applications/$applicationId/-schemas/types/PublicationValues';
import { ResearchTaskType } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';
import type { FormAOptions } from '@/api/client/applications/types/FormAOptions';
import type { FormAFields } from '@/api/generated/schemas';

const initValues = initValuesJson as unknown as FormAOptions;
const schema = getFormAValidationSchema(initValues);

const UG_UNIT_ID = '8f8e8ba8-af4f-43e1-3a51-08ddaf6348b7';
const RESEARCH_AREA_ID = 'cb2b71c0-14d8-4cec-562b-08ddaf6348c2';

/** Valid row fixtures — each test mutates one field to assert it is the cause of failure. */
const validRows = {
  permission: { description: 'jakiś opis', executive: 'jakiś organ' } satisfies FormAValues['permissions'][number],
  contract: {
    category: 'international',
    institutionName: 'Instytut',
    institutionUnit: 'Wydział',
    institutionLocalization: 'Gdańsk',
    description: 'opis umowy',
    scans: [],
  } satisfies FormAValues['contracts'][number],
  publication: {
    id: '',
    category: PublicationCategory.Subject,
    doi: '10.1000/abc',
    authors: 'Autor',
    title: 'Tytuł',
    magazine: 'Czasopismo',
    year: 2025,
    ministerialPoints: 20,
  } satisfies FormAValues['publications'][number],
  spubTask: { name: 'Zadanie SPUB', yearFrom: '2023', yearTo: '2025' } satisfies FormAValues['spubTasks'][number],
  guestTeam: { name: 'Instytut Gościnny', noOfPersons: 3 } satisfies FormAValues['guestTeams'][number],
  ugTeam: { ugUnitId: UG_UNIT_ID, noOfEmployees: 2, noOfStudents: 1 } satisfies FormAValues['ugTeams'][number],
  researchTask: {
    type: ResearchTaskType.BachelorThesis,
    author: 'Autor',
    title: 'Tytuł',
  } satisfies FormAValues['researchTasks'][number],
  researchArea: {
    areaId: RESEARCH_AREA_ID,
    differentName: null,
    info: '',
  } satisfies FormAValues['researchAreaDescriptions'][number],
};

/** Copies a row with one field replaced. Keeps the unavoidable computed-key cast in one place. */
function override<T>(row: T, field: string, value: unknown): T {
  return { ...row, [field]: value } as T;
}

function validPayload(overrides: Partial<FormAValues> = {}): FormAValues {
  const base = mapFormAToValues(formABase as unknown as FormAFields);
  return {
    ...formADefaultValues,
    ...base,
    // Manager IDs from the JSON payload do not exist in initValues — use real ones
    cruiseManagerId: initValues.cruiseManagers[1].id,
    deputyManagerId: initValues.cruiseManagers[0].id,
    periodSelectionType: 'period',
    note: '',
    ...overrides,
  };
}

/** Asserts the payload is rejected and that at least one issue points at `path`. */
function expectRejectedAt(payload: FormAValues, path: string) {
  const result = schema.safeParse(payload);
  expect(result.success, `expected payload to be rejected because of "${path}"`).toBe(false);

  if (!result.success) {
    const paths = result.error.issues.map((issue) => issue.path.join('.'));
    expect(
      paths.some((p) => p === path || p.startsWith(path)),
      `issue paths were: ${paths.join(', ')}`
    ).toBe(true);
  }
}

function expectAccepted(payload: FormAValues) {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const details = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    expect.fail(`expected payload to be accepted, but got: ${details}`);
  }
}

describe('formA schema – baseline', () => {
  it('accepts a fully valid payload', () => {
    expectAccepted(validPayload());
  });
});

describe('formA schema – supervisorEmail', () => {
  it.each([
    ['abcd', false],
    ['abcd@', false],
    ['abcd@gmail', false],
    ['', false],
    ['abcd@gmail.com', true],
    ['abcd@wp.pl', true],
    ['abc+def@gmail.com', true],
  ])('email %s → valid=%s', (supervisorEmail, expectedValid) => {
    const result = schema.safeParse(validPayload({ supervisorEmail }));
    expect(result.success).toBe(expectedValid);
  });
});

describe('formA schema – cruise duration (cruiseDays / cruiseHours)', () => {
  it.each([
    [0, 0, false],
    [0, 24, false], // caught by superRefine before the number range even matters
    [60, 1, false],
    [1, 0, true],
    [30, 0, true],
    [59, 23, true],
    [60, 0, true],
  ])('cruiseDays=%s cruiseHours=%s → valid=%s', (cruiseDays, cruiseHours, expectedValid) => {
    const result = schema.safeParse(validPayload({ cruiseDays, cruiseHours }));
    expect(result.success).toBe(expectedValid);
  });
});

describe('formA schema – shipUsage', () => {
  it('rejects "w inny sposób" (4) without differentUsage', () => {
    expectRejectedAt(validPayload({ shipUsage: '4', differentUsage: '' }), 'differentUsage');
  });

  it('accepts "w inny sposób" (4) with differentUsage filled', () => {
    expectAccepted(validPayload({ shipUsage: '4', differentUsage: 'inne użycie statku' }));
  });

  it('rejects an out-of-range shipUsage value', () => {
    expectRejectedAt(validPayload({ shipUsage: '9' }), 'shipUsage');
  });
});

describe('formA schema – cruiseGoal', () => {
  it('rejects when no goal is chosen', () => {
    expectRejectedAt(validPayload({ cruiseGoal: '', cruiseGoalDescription: '' }), 'cruiseGoal');
  });

  it('rejects a chosen goal with an empty description', () => {
    expectRejectedAt(
      validPayload({ cruiseGoal: CruiseGoal.Research, cruiseGoalDescription: '' }),
      'cruiseGoalDescription'
    );
  });

  it('accepts a chosen goal with a description', () => {
    expectAccepted(validPayload({ cruiseGoal: CruiseGoal.Research, cruiseGoalDescription: 'Badania morskie' }));
  });
});

describe('formA schema – manager and deputy', () => {
  it('rejects the same person as manager and deputy', () => {
    const sameId = initValues.cruiseManagers[0].id;
    expectRejectedAt(validPayload({ cruiseManagerId: sameId, deputyManagerId: sameId }), 'deputyManagerId');
  });

  it('rejects a deputy who is not on the deputy list', () => {
    expectRejectedAt(validPayload({ deputyManagerId: '00000000-0000-0000-0000-000000000000' }), 'deputyManagerId');
  });

  it('rejects an empty deputy', () => {
    expectRejectedAt(validPayload({ deputyManagerId: '' }), 'deputyManagerId');
  });
});

describe('formA schema – required sections', () => {
  it('rejects an empty researchAreaDescriptions list', () => {
    expectRejectedAt(validPayload({ researchAreaDescriptions: [] }), 'researchAreaDescriptions');
  });

  it('rejects an empty researchTasks list', () => {
    expectRejectedAt(validPayload({ researchTasks: [] }), 'researchTasks');
  });

  it('rejects an empty ugTeams list', () => {
    expectRejectedAt(validPayload({ ugTeams: [] }), 'ugTeams');
  });

  it.each(['permissions', 'contracts', 'publications', 'spubTasks', 'guestTeams'])(
    'accepts an empty %s list (section is optional)',
    (section) => {
      expectAccepted(validPayload(override<Partial<FormAValues>>({}, section, [])));
    }
  );
});

describe('formA schema – UG teams', () => {
  it('accepts a team with employees and students', () => {
    expectAccepted(validPayload({ ugTeams: [validRows.ugTeam] }));
  });

  it.each([
    ['negative employees', { noOfEmployees: -1, noOfStudents: 2 }],
    ['negative students', { noOfEmployees: 2, noOfStudents: -1 }],
    ['both negative', { noOfEmployees: -3, noOfStudents: -3 }],
  ])('rejects %s', (_label, counts) => {
    expectRejectedAt(validPayload({ ugTeams: [{ ...validRows.ugTeam, ...counts }] }), 'ugTeams');
  });

  it('rejects a team with zero employees and zero students', () => {
    expectRejectedAt(
      validPayload({ ugTeams: [{ ...validRows.ugTeam, noOfEmployees: 0, noOfStudents: 0 }] }),
      'ugTeams'
    );
  });

  it('rejects two teams from the same UG unit', () => {
    expectRejectedAt(validPayload({ ugTeams: [validRows.ugTeam, validRows.ugTeam] }), 'ugTeams');
  });
});

describe('formA schema – guest teams', () => {
  it('accepts a valid guest team', () => {
    expectAccepted(validPayload({ guestTeams: [validRows.guestTeam] }));
  });

  it('rejects an empty institution name', () => {
    expectRejectedAt(validPayload({ guestTeams: [{ ...validRows.guestTeam, name: '' }] }), 'guestTeams');
  });

  it.each([0, -1])('rejects noOfPersons %s', (noOfPersons) => {
    expectRejectedAt(validPayload({ guestTeams: [{ ...validRows.guestTeam, noOfPersons }] }), 'guestTeams');
  });
});

describe('formA schema – permissions', () => {
  it('accepts a valid permission', () => {
    expectAccepted(validPayload({ permissions: [validRows.permission] }));
  });

  it.each(['description', 'executive'])('rejects an empty %s', (field) => {
    expectRejectedAt(validPayload({ permissions: [override(validRows.permission, field, '')] }), 'permissions');
  });
});

describe('formA schema – contracts', () => {
  it('accepts a valid contract', () => {
    expectAccepted(validPayload({ contracts: [validRows.contract] }));
  });

  it.each(['institutionName', 'institutionUnit', 'institutionLocalization', 'description'])(
    'rejects an empty %s',
    (field) => {
      expectRejectedAt(validPayload({ contracts: [override(validRows.contract, field, '')] }), 'contracts');
    }
  );
});

describe('formA schema – publications', () => {
  it('accepts a valid publication', () => {
    expectAccepted(validPayload({ publications: [validRows.publication] }));
  });

  it.each(['doi', 'authors', 'title', 'magazine'])('rejects an empty %s', (field) => {
    expectRejectedAt(validPayload({ publications: [override(validRows.publication, field, '')] }), 'publications');
  });

  it.each([-1, -100])('rejects ministerialPoints %s', (ministerialPoints) => {
    expectRejectedAt(validPayload({ publications: [{ ...validRows.publication, ministerialPoints }] }), 'publications');
  });

  it('accepts ministerialPoints of 0', () => {
    expectAccepted(validPayload({ publications: [{ ...validRows.publication, ministerialPoints: 0 }] }));
  });
});

describe('formA schema – SPUB tasks', () => {
  it('accepts a valid SPUB task', () => {
    expectAccepted(validPayload({ spubTasks: [validRows.spubTask] }));
  });

  it.each(['name', 'yearFrom', 'yearTo'])('rejects an empty %s', (field) => {
    expectRejectedAt(validPayload({ spubTasks: [override(validRows.spubTask, field, '')] }), 'spubTasks');
  });
});

describe('formA schema – research tasks', () => {
  it('accepts a valid thesis task', () => {
    expectAccepted(validPayload({ researchTasks: [validRows.researchTask] }));
  });

  it.each(['author', 'title'])('rejects a thesis task with an empty %s', (field) => {
    expectRejectedAt(validPayload({ researchTasks: [override(validRows.researchTask, field, '')] }), 'researchTasks');
  });
});

describe('formA schema – research areas', () => {
  it('accepts an area referenced by id', () => {
    expectAccepted(validPayload({ researchAreaDescriptions: [validRows.researchArea] }));
  });

  it('accepts a custom area referenced by name', () => {
    expectAccepted(
      validPayload({ researchAreaDescriptions: [{ areaId: null, differentName: 'Własny rejon', info: '' }] })
    );
  });

  it('rejects an area with neither an id nor a name', () => {
    expectRejectedAt(
      validPayload({ researchAreaDescriptions: [{ areaId: null, differentName: null, info: '' }] }),
      'researchAreaDescriptions'
    );
  });

  it('rejects an unknown area id', () => {
    expectRejectedAt(
      validPayload({
        researchAreaDescriptions: [{ areaId: '00000000-0000-0000-0000-000000000000', differentName: null, info: '' }],
      }),
      'researchAreaDescriptions'
    );
  });
});

describe('formA schema – cruise periods', () => {
  it('rejects an optimal period reaching outside the acceptable period', () => {
    expectRejectedAt(validPayload({ acceptablePeriod: ['5', '10'], optimalPeriod: ['0', '24'] }), 'optimalPeriod');
  });

  it('accepts an optimal period contained in the acceptable period', () => {
    expectAccepted(validPayload({ acceptablePeriod: ['0', '24'], optimalPeriod: ['5', '10'] }));
  });

  it('rejects a period shorter than the cruise duration', () => {
    // one fortnight (~15 days) cannot fit a 60-day cruise
    expectRejectedAt(
      validPayload({ acceptablePeriod: ['0', '1'], optimalPeriod: ['0', '1'], cruiseDays: 60, cruiseHours: 0 }),
      'acceptablePeriod'
    );
  });

  it('rejects a precise period that ends before it starts', () => {
    expectRejectedAt(
      validPayload({
        periodSelectionType: 'precise',
        acceptablePeriod: '',
        optimalPeriod: '',
        precisePeriodStart: '2025-06-10',
        precisePeriodEnd: '2025-06-01',
      }),
      'precisePeriodEnd'
    );
  });

  it('rejects a precise period shorter than the cruise duration', () => {
    expectRejectedAt(
      validPayload({
        periodSelectionType: 'precise',
        acceptablePeriod: '',
        optimalPeriod: '',
        precisePeriodStart: '2025-06-01',
        precisePeriodEnd: '2025-06-02',
        cruiseDays: 60, // 60 days does not fit in 1 day
        cruiseHours: 0,
      }),
      'precisePeriodEnd'
    );
  });

  it.each(['precisePeriodStart', 'precisePeriodEnd'])('rejects a precise period missing %s', (field) => {
    const precise = validPayload({
      periodSelectionType: 'precise',
      acceptablePeriod: '',
      optimalPeriod: '',
      precisePeriodStart: '2025-06-01',
      precisePeriodEnd: '2025-06-30',
    });
    expectRejectedAt(override(precise, field, ''), field);
  });
});

describe('formA schema – year', () => {
  it('rejects a year outside the available years', () => {
    expectRejectedAt(validPayload({ year: '1999' }), 'year');
  });
});
