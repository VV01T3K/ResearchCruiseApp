import { describe, expect, it } from 'vitest';

import formBBase from '@tests/assets/api-mocks/api_CruiseApplications_id_formB.json' with { type: 'json' };

import {
  formBDefaultValues,
  type FormBValues,
  getFormBDraftWriteSchema,
  getFormBValidationSchema,
  mapFormBToValues,
} from '@/routes/applications/$applicationId/-schemas/formB.schema';
import type { FormBFields } from '@/api/generated/schemas';

const schema = getFormBValidationSchema();

const UG_UNIT_ID = '8f8e8ba8-af4f-43e1-3a51-08ddaf6348b7';

/** Valid row fixtures — each test mutates one field to assert it is the cause of failure. */
const validRows = {
  permission: {
    description: 'jakiś opis',
    executive: 'jakiś organ',
    scan: { name: 'pozwolenie.pdf', content: 'base64' },
  } satisfies FormBValues['permissions'][number],
  ugTeam: { ugUnitId: UG_UNIT_ID, noOfEmployees: 2, noOfStudents: 1 } satisfies FormBValues['ugTeams'][number],
  guestTeam: { name: 'Instytut Gościnny', noOfPersons: 3 } satisfies FormBValues['guestTeams'][number],
  crewMember: {
    title: 'dr',
    firstName: 'Jan',
    lastName: 'Kowalski',
    birthPlace: 'Gdańsk',
    birthDate: '1990-01-01',
    documentNumber: 'ABC123',
    documentExpiryDate: '2030-01-01',
    institution: 'UG',
  } satisfies FormBValues['crewMembers'][number],
  shortEquipment: {
    name: 'Sonda',
    startDate: '2025-06-01',
    endDate: '2025-06-02',
  } satisfies FormBValues['shortResearchEquipments'][number],
  longEquipment: {
    name: 'Boja',
    action: 'Put',
    duration: '10',
  } satisfies FormBValues['longResearchEquipments'][number],
  port: { name: 'Gdynia', startTime: '2025-06-01', endTime: '2025-06-02' } satisfies FormBValues['ports'][number],
  cruiseDay: {
    number: 1,
    hours: 8,
    taskName: 'Pomiary',
    region: 'Zatoka',
    position: '54N 18E',
    comment: '',
  } satisfies FormBValues['cruiseDaysDetails'][number],
  researchEquipment: {
    name: 'Echosonda',
    insuranceStartDate: null,
    insuranceEndDate: null,
    permission: true,
  } satisfies FormBValues['researchEquipments'][number],
};

/** Copies a row with one field replaced. Keeps the unavoidable computed-key cast in one place. */
function override<T>(row: T, field: string, value: unknown): T {
  return { ...row, [field]: value } as T;
}

function validPayload(overrides: Partial<FormBValues> = {}): FormBValues {
  return {
    ...formBDefaultValues,
    ...mapFormBToValues(formBBase as unknown as FormBFields),
    ...overrides,
  };
}

function expectRejectedAt(payload: FormBValues, path: string) {
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

function expectAccepted(payload: FormBValues) {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const details = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    expect.fail(`expected payload to be accepted, but got: ${details}`);
  }
}

describe('formB schema – baseline', () => {
  it('accepts the default payload', () => {
    expectAccepted(validPayload());
  });

  it.each(['permissions', 'guestTeams', 'crewMembers', 'shortResearchEquipments', 'ports', 'cruiseDaysDetails'])(
    'accepts an empty %s list (section is optional)',
    (section) => {
      expectAccepted(validPayload(override<Partial<FormBValues>>({}, section, [])));
    }
  );
});

describe('formB schema – isCruiseManagerPresent', () => {
  it.each([
    [true, true],
    [false, true],
  ])('value %s → valid=%s', (isCruiseManagerPresent, expectedValid) => {
    const result = schema.safeParse(validPayload({ isCruiseManagerPresent }));
    expect(result.success).toBe(expectedValid);
  });
});

describe('formB schema – UG teams', () => {
  it('rejects an empty ugTeams list', () => {
    expectRejectedAt(validPayload({ ugTeams: [] }), 'ugTeams');
  });

  it.each([
    ['negative employees', { noOfEmployees: -1, noOfStudents: 2 }],
    ['negative students', { noOfEmployees: 2, noOfStudents: -1 }],
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

describe('formB schema – guest teams', () => {
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

describe('formB schema – permissions', () => {
  it('accepts a permission with a PDF scan', () => {
    expectAccepted(validPayload({ permissions: [validRows.permission] }));
  });

  it.each(['description', 'executive'])('rejects an empty %s', (field) => {
    expectRejectedAt(validPayload({ permissions: [override(validRows.permission, field, '')] }), 'permissions');
  });

  it('rejects a permission with no scan', () => {
    expectRejectedAt(validPayload({ permissions: [override(validRows.permission, 'scan', undefined)] }), 'permissions');
  });

  it('rejects a scan that is not a PDF', () => {
    expectRejectedAt(
      validPayload({
        permissions: [override(validRows.permission, 'scan', { name: 'skan.jpg', content: 'base64' })],
      }),
      'permissions'
    );
  });
});

describe('formB schema – crew members', () => {
  it('accepts a valid crew member', () => {
    expectAccepted(validPayload({ crewMembers: [validRows.crewMember] }));
  });

  it.each([
    'title',
    'firstName',
    'lastName',
    'birthPlace',
    'birthDate',
    'documentNumber',
    'documentExpiryDate',
    'institution',
  ])('rejects an empty %s', (field) => {
    expectRejectedAt(validPayload({ crewMembers: [override(validRows.crewMember, field, '')] }), 'crewMembers');
  });
});

describe('formB schema – research equipment', () => {
  it('accepts a valid short-term equipment entry', () => {
    expectAccepted(validPayload({ shortResearchEquipments: [validRows.shortEquipment] }));
  });

  it.each(['name', 'startDate', 'endDate'])('rejects a short-term entry with an empty %s', (field) => {
    expectRejectedAt(
      validPayload({ shortResearchEquipments: [override(validRows.shortEquipment, field, '')] }),
      'shortResearchEquipments'
    );
  });

  it('accepts a valid long-term equipment entry', () => {
    expectAccepted(validPayload({ longResearchEquipments: [validRows.longEquipment] }));
  });

  it.each(['name', 'duration'])('rejects a long-term entry with an empty %s', (field) => {
    expectRejectedAt(
      validPayload({ longResearchEquipments: [override(validRows.longEquipment, field, '')] }),
      'longResearchEquipments'
    );
  });

  it('rejects an unknown long-term action', () => {
    expectRejectedAt(
      validPayload({ longResearchEquipments: [override(validRows.longEquipment, 'action', 'Destroy')] }),
      'longResearchEquipments'
    );
  });

  it('accepts a valid research equipment entry', () => {
    expectAccepted(validPayload({ researchEquipments: [validRows.researchEquipment] }));
  });

  it('rejects a research equipment entry with an empty name', () => {
    expectRejectedAt(
      validPayload({ researchEquipments: [{ ...validRows.researchEquipment, name: '' }] }),
      'researchEquipments'
    );
  });
});

describe('formB schema – ports', () => {
  it('accepts a valid port', () => {
    expectAccepted(validPayload({ ports: [validRows.port] }));
  });

  it.each(['name', 'startTime', 'endTime'])('rejects a port with an empty %s', (field) => {
    expectRejectedAt(validPayload({ ports: [override(validRows.port, field, '')] }), 'ports');
  });
});

describe('formB schema – cruise day details', () => {
  it('accepts a valid cruise day', () => {
    expectAccepted(validPayload({ cruiseDaysDetails: [validRows.cruiseDay] }));
  });

  it.each(['taskName', 'region', 'position'])('rejects a cruise day with an empty %s', (field) => {
    expectRejectedAt(
      validPayload({ cruiseDaysDetails: [override(validRows.cruiseDay, field, '')] }),
      'cruiseDaysDetails'
    );
  });

  it('rejects a comment longer than 1024 characters', () => {
    expectRejectedAt(
      validPayload({ cruiseDaysDetails: [{ ...validRows.cruiseDay, comment: 'A'.repeat(1025) }] }),
      'cruiseDaysDetails'
    );
  });

  it('accepts a comment of exactly 1024 characters', () => {
    expectAccepted(validPayload({ cruiseDaysDetails: [{ ...validRows.cruiseDay, comment: 'A'.repeat(1024) }] }));
  });
});

describe('formB schema – draft requests', () => {
  it('draft accepts empty values but still requires the complete input shape', () => {
    const draft = {
      ...formBDefaultValues,
      permissions: [{ description: '', executive: '', scan: undefined }],
    };
    expect(getFormBDraftWriteSchema().safeParse(draft).success).toBe(true);

    const { shipEquipmentsIds: _omitted, ...missingKey } = draft;
    expect(getFormBDraftWriteSchema().safeParse(missingKey).success).toBe(false);
  });

  it('draft still enforces the cruise day comment length limit', () => {
    const draft = {
      ...formBDefaultValues,
      cruiseDaysDetails: [{ number: 0, hours: 0, taskName: '', region: '', position: '', comment: 'x'.repeat(1025) }],
    };
    expect(getFormBDraftWriteSchema().safeParse(draft).success).toBe(false);
  });
});
