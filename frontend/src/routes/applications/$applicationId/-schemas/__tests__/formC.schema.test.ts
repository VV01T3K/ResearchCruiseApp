import { describe, expect, it } from 'vitest';

import initValuesJson from '@tests/assets/api-mocks/api_forms_InitValues_A.json' with { type: 'json' };

import {
  formCDefaultValues,
  type FormCValues,
  getFormCDraftWriteSchema,
  getFormCValidationSchema,
} from '@/routes/applications/$applicationId/-schemas/formC.schema';
import {
  createSchemaAssertions,
  override,
} from '@/routes/applications/$applicationId/-schemas/__tests__/schemaTestUtils';
import { ResearchTaskType } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';
import type { FormAOptions } from '@/api/client/applications/types/FormAOptions';

const initValues = initValuesJson as unknown as FormAOptions;
const schema = getFormCValidationSchema(initValues);
const { expectAccepted, expectRejectedAt } = createSchemaAssertions(schema);
type ResearchTaskEffect = FormCValues['researchTasksEffects'][number];

const UG_UNIT_ID = '8f8e8ba8-af4f-43e1-3a51-08ddaf6348b7';
const RESEARCH_AREA_ID = 'cb2b71c0-14d8-4cec-562b-08ddaf6348c2';

/** Valid row fixtures — each test mutates one field to assert it is the cause of failure. */
const validRows = {
  researchTaskEffect: {
    type: ResearchTaskType.BachelorThesis,
    author: 'Autor',
    title: 'Tytuł',
    done: false,
    managerConditionMet: false,
    deputyConditionMet: false,
  } as ResearchTaskEffect,
  collectedSample: {
    type: 'Woda',
    amount: 10,
    analysis: 'Chemiczna',
    publishing: 'Artykuł',
  } satisfies FormCValues['collectedSamples'][number],
  contract: {
    category: 'international',
    institutionName: 'Instytut',
    institutionUnit: 'Wydział',
    institutionLocalization: 'Gdańsk',
    description: 'opis umowy',
    scans: [],
  } satisfies FormCValues['contracts'][number],
};

function validPayload(overrides: Partial<FormCValues> = {}): FormCValues {
  return {
    ...formCDefaultValues,
    shipUsage: '0',
    differentUsage: '',
    permissions: [],
    researchAreaDescriptions: [{ areaId: RESEARCH_AREA_ID, differentName: null, info: '' }],
    ugTeams: [{ ugUnitId: UG_UNIT_ID, noOfEmployees: 2, noOfStudents: 0 }],
    guestTeams: [],
    researchTasksEffects: [validRows.researchTaskEffect],
    contracts: [],
    spubTasks: [],
    ...overrides,
  };
}

describe('formC schema – baseline', () => {
  it('accepts a fully valid payload', () => {
    expectAccepted(validPayload());
  });

  it.each(['permissions', 'guestTeams', 'contracts', 'spubTasks', 'ports', 'collectedSamples', 'photos'])(
    'accepts an empty %s list (section is optional)',
    (section) => {
      expectAccepted(validPayload(override<Partial<FormCValues>>({}, section, [])));
    }
  );
});

describe('formC schema – shipUsage', () => {
  it('rejects "w inny sposób" (4) without differentUsage', () => {
    expectRejectedAt(validPayload({ shipUsage: '4', differentUsage: '' }), 'differentUsage');
  });

  it('accepts "w inny sposób" (4) with differentUsage filled', () => {
    expectAccepted(validPayload({ shipUsage: '4', differentUsage: 'inne użycie' }));
  });

  it.each(['', '9'])('rejects shipUsage "%s"', (shipUsage) => {
    expectRejectedAt(validPayload(override<Partial<FormCValues>>({}, 'shipUsage', shipUsage)), 'shipUsage');
  });
});

describe('formC schema – required sections', () => {
  it('rejects an empty researchAreaDescriptions list', () => {
    expectRejectedAt(validPayload({ researchAreaDescriptions: [] }), 'researchAreaDescriptions');
  });

  it('rejects an empty ugTeams list', () => {
    expectRejectedAt(validPayload({ ugTeams: [] }), 'ugTeams');
  });

  it('rejects an empty researchTasksEffects list', () => {
    expectRejectedAt(validPayload({ researchTasksEffects: [] }), 'researchTasksEffects');
  });
});

describe('formC schema – research task effects', () => {
  it('accepts an unfinished task with no conditions met', () => {
    expectAccepted(validPayload({ researchTasksEffects: [validRows.researchTaskEffect] }));
  });

  it('accepts a finished task with conditions met', () => {
    expectAccepted(
      validPayload({
        researchTasksEffects: [
          { ...validRows.researchTaskEffect, done: true, managerConditionMet: true, deputyConditionMet: true },
        ],
      })
    );
  });

  it.each(['managerConditionMet', 'deputyConditionMet'])('rejects an unfinished task with %s set to true', (field) => {
    // the fixture is already done: false
    expectRejectedAt(
      validPayload({ researchTasksEffects: [override(validRows.researchTaskEffect, field, true)] }),
      'researchTasksEffects'
    );
  });

  it.each(['author', 'title'])('rejects a thesis effect with an empty %s', (field) => {
    expectRejectedAt(
      validPayload({ researchTasksEffects: [override(validRows.researchTaskEffect, field, '')] }),
      'researchTasksEffects'
    );
  });
});

describe('formC schema – collected samples', () => {
  it('accepts a valid sample', () => {
    expectAccepted(validPayload({ collectedSamples: [validRows.collectedSample] }));
  });

  it.each(['type', 'analysis', 'publishing'])('rejects a sample with an empty %s', (field) => {
    expectRejectedAt(
      validPayload({ collectedSamples: [override(validRows.collectedSample, field, '')] }),
      'collectedSamples'
    );
  });

  it.each([0, -1, -100])('rejects an amount of %s', (amount) => {
    expectRejectedAt(
      validPayload({ collectedSamples: [{ ...validRows.collectedSample, amount }] }),
      'collectedSamples'
    );
  });

  it('accepts a positive amount', () => {
    expectAccepted(validPayload({ collectedSamples: [{ ...validRows.collectedSample, amount: 1 }] }));
  });
});

describe('formC schema – contracts', () => {
  it('accepts a valid contract', () => {
    expectAccepted(validPayload({ contracts: [validRows.contract] }));
  });

  it.each(['institutionName', 'institutionUnit', 'institutionLocalization', 'description'])(
    'rejects a contract with an empty %s',
    (field) => {
      expectRejectedAt(validPayload({ contracts: [override(validRows.contract, field, '')] }), 'contracts');
    }
  );
});

describe('formC schema – free text length limits', () => {
  const LIMIT = 10240;

  it.each(['spubReportData', 'additionalDescription'])('accepts %s of exactly the limit', (field) => {
    expectAccepted(validPayload(override<Partial<FormCValues>>({}, field, 'A'.repeat(LIMIT))));
  });

  it.each(['spubReportData', 'additionalDescription'])('rejects %s longer than the limit', (field) => {
    expectRejectedAt(validPayload(override<Partial<FormCValues>>({}, field, 'A'.repeat(LIMIT + 1))), field);
  });
});

describe('formC schema – research areas', () => {
  it('rejects an area with neither an id nor a name', () => {
    expectRejectedAt(
      validPayload({ researchAreaDescriptions: [{ areaId: null, differentName: null, info: '' }] }),
      'researchAreaDescriptions'
    );
  });

  it('accepts a custom area referenced by name', () => {
    expectAccepted(
      validPayload({ researchAreaDescriptions: [{ areaId: null, differentName: 'Własny rejon', info: '' }] })
    );
  });
});

describe('formC schema – draft requests', () => {
  it('draft accepts empty values but still requires the complete input shape', () => {
    const draft = {
      ...formCDefaultValues,
      permissions: [{ description: '', executive: '', scan: undefined }],
    };
    const draftSchema = getFormCDraftWriteSchema();
    expect(draftSchema.safeParse(draft).success).toBe(true);

    const { photos: _omitted, ...missingKey } = draft;
    expect(draftSchema.safeParse(missingKey).success).toBe(false);
  });
});
