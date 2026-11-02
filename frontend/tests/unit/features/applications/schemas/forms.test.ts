import { describe, expect, it } from 'vite-plus/test';
import {
  filledFormA,
  filledFormB,
  filledFormC,
  formA,
  formB,
  formC,
  formOptions,
  applicationId,
  unitId,
} from '@tests/data/forms';
import { manager } from '@tests/data/accounts';
import {
  formADefaultValues,
  getFormAValidationSchema,
  getFormAFieldsSchema,
  getFormADraftFieldsSchema,
  mapFormAToValues,
  mapResearchTaskToValues,
} from '@/features/applications/schemas/formA.schema';
import {
  formBDefaultValues,
  getFormBValidationSchema,
  getFormBFieldsSchema,
  getFormBDraftFieldsSchema,
  mapFormBToValues,
} from '@/features/applications/schemas/formB.schema';
import {
  formCDefaultValues,
  getFormCValidationSchema,
  getFormCFieldsSchema,
  getFormCDraftFieldsSchema,
  mapFormCToValues,
} from '@/features/applications/schemas/formC.schema';
import { storedBoolean, storedNullableNumber, storedNumber } from '@/features/applications/schemas/storedValues';

const options = formOptions();
const a = () => mapFormAToValues(formA());
const b = () => mapFormBToValues(formB());
const c = () => mapFormCToValues(formC());
const schemaA = getFormAValidationSchema(options);
const schemaB = getFormBValidationSchema();
const schemaC = getFormCValidationSchema(options);

// Assert the exact issue path so another invalid field cannot make the test pass.
function issueAt(path: (string | number)[]) {
  return {
    success: false,
    error: { issues: expect.arrayContaining([expect.objectContaining({ path })]) },
  };
}

describe('saved applications', () => {
  // A form that was saved completely must load, validate and save back without changes.
  it.each([
    ['A', filledFormA(), mapFormAToValues(filledFormA()), schemaA, getFormAFieldsSchema(options)],
    ['B', filledFormB(), mapFormBToValues(filledFormB()), schemaB, getFormBFieldsSchema()],
    ['C', filledFormC(), mapFormCToValues(filledFormC()), schemaC, getFormCFieldsSchema(options)],
  ] as const)('a completely filled form %s validates and saves back unchanged', (_, saved, values, schema, fields) => {
    expect(schema.safeParse(values).error?.issues ?? []).toEqual([]);
    expect(fields.parse(values)).toEqual(saved);
  });
});

describe('stored values', () => {
  it.each([
    [storedBoolean, 'true', true],
    [storedBoolean, 'True', true],
    [storedBoolean, 'FALSE', false],
    [storedBoolean, null, false],
    [storedBoolean, '0', '0'],
    [storedBoolean, '1', '1'],
    [storedBoolean, '', ''],
    [storedBoolean, 'tak', 'tak'],
    [storedNumber, '12.5', 12.5],
    [storedNumber, null, 0],
    [storedNumber, '', 0],
    [storedNumber, '12h', '12h'],
    [storedNumber, 'Infinity', 'Infinity'],
    [storedNullableNumber, '12', 12],
    [storedNullableNumber, '', null],
    [storedNullableNumber, '12h', '12h'],
  ] as const)('%o reads %j as %j', (read, stored, expected) => {
    expect(read(stored)).toBe(expected);
  });

  it('blocks both saves on an unreadable editable value and names the field', () => {
    const saved = filledFormC();
    const values = mapFormCToValues({
      ...saved,
      researchTasksEffects: saved.researchTasksEffects?.map((task) => ({ ...task, done: 'tak' })),
    });
    const path = ['researchTasksEffects', 0, 'done'];
    expect(schemaC.safeParse(values)).toMatchObject(issueAt(path));
    expect(getFormCDraftFieldsSchema().safeParse(values)).toMatchObject(issueAt(path));
  });

  it('saves a read-only unreadable task detail in form C back unchanged', () => {
    const task = filledFormA().researchTasks?.find(({ type }) => type === '4');
    const form = {
      ...filledFormC(),
      researchTasksEffects: [
        {
          ...task,
          financingAmount: '12 tys.',
          done: 'true',
          managerConditionMet: 'false',
          deputyConditionMet: 'false',
          publicationMinisterialPoints: null,
        },
      ],
    };
    const fields = getFormCFieldsSchema(options).parse(mapFormCToValues(form));
    expect(fields.researchTasksEffects?.[0].financingAmount).toBe('12 tys.');
  });
});

describe('research task metadata without an editor', () => {
  const savedA = () => {
    const form = filledFormA();
    return { ...form, researchTasks: form.researchTasks?.map((task) => ({ ...task, institution: 'IO PAN' })) };
  };
  const savedC = () => {
    const form = filledFormC();
    return {
      ...form,
      researchTasksEffects: form.researchTasksEffects?.map((task) => ({
        ...task,
        institution: 'IO PAN',
        publicationMinisterialPoints: '140',
      })),
    };
  };

  it.each([
    ['A final', savedA(), mapFormAToValues(savedA()), getFormAFieldsSchema(options)],
    ['A draft', savedA(), mapFormAToValues(savedA()), getFormADraftFieldsSchema()],
    ['C final', savedC(), mapFormCToValues(savedC()), getFormCFieldsSchema(options)],
    ['C draft', savedC(), mapFormCToValues(savedC()), getFormCDraftFieldsSchema()],
  ] as const)('form %s saves back populated institution and publication points', (_, saved, values, fields) => {
    expect(fields.parse(values)).toEqual(saved);
  });
});

describe('application submission', () => {
  it('loads editable values and serializes all three forms to API fields', () => {
    expect(getFormAFieldsSchema(options).parse(a())).toMatchObject({
      id: applicationId,
      cruiseHours: '27',
      supervisorEmail: 'supervisor@example.com',
      ugTeams: [{ ugUnitId: unitId, noOfEmployees: '2', noOfStudents: '1' }],
    });
    expect(getFormBFieldsSchema().parse(b())).toMatchObject({ isCruiseManagerPresent: 'true' });
    expect(getFormCFieldsSchema(options).parse(c())).toMatchObject({
      researchTasksEffects: [{ done: 'false', managerConditionMet: 'false', deputyConditionMet: 'false' }],
    });
  });

  it.each([
    ['A', schemaA, a],
    ['B', schemaB, b],
    ['C', schemaC, c],
  ] as const)('form %s rejects duplicate and empty university teams', (_, schema, make) => {
    const valid = make();
    expect(schema.safeParse(valid).success).toBe(true);
    expect(schema.safeParse({ ...valid, ugTeams: [] })).toMatchObject(issueAt(['ugTeams']));
    expect(schema.safeParse({ ...valid, ugTeams: [valid.ugTeams[0], valid.ugTeams[0]] })).toMatchObject(
      issueAt(['ugTeams'])
    );
    expect(
      schema.safeParse({
        ...valid,
        ugTeams: [{ ugUnitId: unitId, noOfEmployees: 0, noOfStudents: 0 }],
      })
    ).toMatchObject(issueAt(['ugTeams']));
    expect(
      schema.safeParse({
        ...valid,
        ugTeams: [{ ugUnitId: unitId, noOfEmployees: -1, noOfStudents: 1 }],
      })
    ).toMatchObject(issueAt(['ugTeams', 0, 'noOfEmployees']));
  });

  it.each([
    [0, 0, false],
    [0, 1, true],
    [0, 24, false],
    [59, 23, true],
    [60, 0, true],
    [60, 1, false],
    [1.5, 0, false],
  ])('duration %s days + %s hours is valid: %s', (cruiseDays, cruiseHours, valid) => {
    expect(schemaA.safeParse({ ...a(), cruiseDays, cruiseHours }).success).toBe(valid);
  });

  it('reports a zero duration while an unrelated choice is still empty', () => {
    expect(schemaA.safeParse({ ...a(), cruiseDays: 0, cruiseHours: 0, cruiseGoal: '' })).toMatchObject(
      issueAt(['cruiseHours'])
    );
    expect(schemaA.safeParse({}).success).toBe(false);
  });

  it.each([
    ['deputyManagerId', manager.id],
    ['deputyManagerId', 'unknown'],
    ['deputyManagerId', ''],
    ['cruiseGoal', ''],
    ['year', '1900'],
    ['supervisorEmail', 'not-an-email'],
    ['researchTasks', []],
    ['researchAreaDescriptions', []],
    ['cruiseGoalDescription', ''],
    ['cruiseGoalDescription', 'x'.repeat(10241)],
  ])('form A rejects invalid %s', (field, value) => {
    expect(schemaA.safeParse({ ...a(), [field]: value })).toMatchObject(issueAt([field]));
  });

  it.each([
    ['A', schemaA, a],
    ['C', schemaC, c],
  ] as const)('form %s accepts known or custom research areas and rejects unknown IDs', (_, schema, make) => {
    const valid = make();
    expect(schema.safeParse(valid).success).toBe(true);
    expect(
      schema.safeParse({
        ...valid,
        researchAreaDescriptions: [{ areaId: null, differentName: 'Własny rejon', info: '' }],
      }).success
    ).toBe(true);
    expect(
      schema.safeParse({
        ...valid,
        researchAreaDescriptions: [{ areaId: '00000000-0000-0000-0000-000000000000', differentName: null, info: '' }],
      })
    ).toMatchObject(issueAt(['researchAreaDescriptions', 0, 'areaId']));
    expect(
      schema.safeParse({
        ...valid,
        researchAreaDescriptions: [{ areaId: null, differentName: null, info: '' }],
      })
    ).toMatchObject(issueAt(['researchAreaDescriptions', 0, 'differentName']));
  });

  it.each([
    ['A', schemaA, a],
    ['C', schemaC, c],
  ] as const)('form %s rejects an unknown ship usage', (_, schema, make) => {
    expect(schema.safeParse({ ...make(), shipUsage: '9' })).toMatchObject(issueAt(['shipUsage']));
  });

  it('form C requires at least one research task effect', () => {
    expect(schemaC.safeParse({ ...c(), researchTasksEffects: [] })).toMatchObject(issueAt(['researchTasksEffects']));
  });

  it.each([
    ['A', schemaA, a],
    ['C', schemaC, c],
  ] as const)('form %s requires an explanation for alternative ship usage', (_, schema, make) => {
    expect(schema.safeParse({ ...make(), shipUsage: '4', differentUsage: '' })).toMatchObject(
      issueAt(['differentUsage'])
    );
    expect(schema.safeParse({ ...make(), shipUsage: '4', differentUsage: 'Pomiary nocne' }).success).toBe(true);
  });

  it.each([
    ['an empty acceptable period', { acceptablePeriod: ['4', '4'], optimalPeriod: ['4', '4'] }, 'acceptablePeriod'],
    ['an empty optimal period', { optimalPeriod: ['4', '4'] }, 'optimalPeriod'],
  ])('rejects %s', (_, change, path) => {
    expect(schemaA.safeParse({ ...a(), ...change })).toMatchObject(issueAt([path]));
  });

  it('keeps the optimal period within the acceptable period and reserves enough time', () => {
    expect(schemaA.safeParse({ ...a(), acceptablePeriod: ['4', '6'], optimalPeriod: ['3', '7'] })).toMatchObject(
      issueAt(['optimalPeriod'])
    );
    expect(
      schemaA.safeParse({
        ...a(),
        cruiseDays: 60,
        acceptablePeriod: ['4', '5'],
        optimalPeriod: ['4', '5'],
      })
    ).toMatchObject(issueAt(['acceptablePeriod']));
  });

  it('validates precise dates and serializes them as UTC with total hours', () => {
    const precise = {
      ...a(),
      periodSelectionType: 'precise',
      acceptablePeriod: '',
      optimalPeriod: '',
      precisePeriodStart: '2026-06-01',
      precisePeriodEnd: '2026-06-03T00:00:00',
    };
    const request = getFormAFieldsSchema(options).parse(precise);
    expect(request).toMatchObject({
      precisePeriodStart: '2026-06-01T00:00:00Z',
      precisePeriodEnd: '2026-06-03T00:00:00Z',
      cruiseHours: '27',
    });
    expect(request).not.toHaveProperty('cruiseDays');
    expect(schemaA.safeParse({ ...precise, precisePeriodEnd: '2026-05-31' })).toMatchObject(
      issueAt(['precisePeriodEnd'])
    );
    expect(schemaA.safeParse({ ...precise, precisePeriodStart: '' })).toMatchObject(issueAt(['precisePeriodStart']));
    expect(schemaA.safeParse({ ...precise, cruiseDays: 60, cruiseHours: 0 })).toMatchObject(
      issueAt(['precisePeriodEnd'])
    );
  });

  it.each([
    ['2026-05-17', '2026-05-17T22:00:00', true],
    ['2026-05-16T22:00:00', '2026-05-18', true],
    ['2026-05-17', '2026-05-16T22:00:00', false],
    ['2026-05-18', '2026-05-16T22:00:00', false],
    ['2026-03-29', '2026-03-30', false],
    ['2026-10-25', '2026-10-26', true],
  ])('compares precise dates %s and %s as Polish days', (precisePeriodStart, precisePeriodEnd, valid) => {
    const result = schemaA.safeParse({
      ...a(),
      periodSelectionType: 'precise',
      acceptablePeriod: '',
      optimalPeriod: '',
      cruiseDays: 1,
      cruiseHours: 0,
      precisePeriodStart,
      precisePeriodEnd,
    });
    expect(result.success).toBe(valid);
  });

  it('requires a PDF permission scan only after form A', () => {
    const permission = { description: 'Pobór próbek', executive: 'Urząd Morski' };
    expect(schemaA.safeParse({ ...a(), permissions: [permission] }).success).toBe(true);
    expect(schemaB.safeParse({ ...b(), permissions: [permission] })).toMatchObject(issueAt(['permissions', 0, 'scan']));
    expect(
      schemaB.safeParse({
        ...b(),
        permissions: [{ ...permission, scan: { name: 'scan.jpg', content: 'YQ==' } }],
      })
    ).toMatchObject(issueAt(['permissions', 0, 'scan']));
    expect(
      schemaB.safeParse({
        ...b(),
        permissions: [{ ...permission, scan: { name: 'scan.pdf', content: 'YQ==' } }],
      }).success
    ).toBe(true);
    expect(
      schemaA.safeParse({
        ...a(),
        permissions: [{ ...permission, scan: { name: 'scan.pdf', content: 'YQ==' } }],
      })
    ).toMatchObject(issueAt(['permissions']));
  });

  it.each(['managerConditionMet', 'deputyConditionMet'])('does not award %s for an unfinished task', (field) => {
    const task = c().researchTasksEffects[0];
    expect(schemaC.safeParse({ ...c(), researchTasksEffects: [{ ...task, [field]: true }] })).toMatchObject(
      issueAt(['researchTasksEffects'])
    );
    expect(
      schemaC.safeParse({
        ...c(),
        researchTasksEffects: [{ ...task, done: true, [field]: true }],
      }).success
    ).toBe(true);
  });

  it.each(['spubReportData', 'additionalDescription'])('enforces the report limit for %s', (field) => {
    expect(schemaC.safeParse({ ...c(), [field]: 'x'.repeat(10240) }).success).toBe(true);
    expect(schemaC.safeParse({ ...c(), [field]: 'x'.repeat(10241) })).toMatchObject(issueAt([field]));
  });

  it.each([0, -1])('rejects a sample amount of %s', (amount) => {
    const sample = { type: 'Woda', amount, analysis: 'Zasolenie', publishing: 'Artykuł' };
    expect(schemaC.safeParse({ ...c(), collectedSamples: [sample] })).toMatchObject(
      issueAt(['collectedSamples', 0, 'amount'])
    );
    expect(schemaC.safeParse({ ...c(), collectedSamples: [{ ...sample, amount: 1 }] }).success).toBe(true);
  });
});

describe('drafts', () => {
  it('saves incomplete forms but rejects missing input collections', () => {
    const draftA = { ...formADefaultValues, cruiseManagerId: manager.id };
    expect(getFormADraftFieldsSchema(applicationId).parse(draftA)).toMatchObject({
      id: applicationId,
      deputyManagerId: null,
      cruiseHours: '0',
    });
    expect(getFormBDraftFieldsSchema().parse(formBDefaultValues)).toMatchObject({ isCruiseManagerPresent: 'true' });
    expect(getFormCDraftFieldsSchema().parse(formCDefaultValues)).toMatchObject({ researchTasksEffects: [] });
    expect(getFormADraftFieldsSchema().safeParse({ ...draftA, permissions: undefined }).success).toBe(false);
    expect(getFormBDraftFieldsSchema().safeParse({ ...formBDefaultValues, shipEquipmentsIds: undefined }).success).toBe(
      false
    );
    expect(getFormCDraftFieldsSchema().safeParse({ ...formCDefaultValues, photos: undefined }).success).toBe(false);
  });

  it('preserves blank optional research amounts instead of turning them into zero', () => {
    expect(mapResearchTaskToValues({ type: '4', financingAmount: null, securedAmount: null })).toMatchObject({
      financingAmount: null,
      securedAmount: null,
    });
    expect(mapResearchTaskToValues({ type: '10', ministerialPoints: null })).toMatchObject({ ministerialPoints: null });
    const request = getFormADraftFieldsSchema().parse({
      ...formADefaultValues,
      cruiseManagerId: manager.id,
      researchTasks: [
        {
          type: '4',
          title: '',
          financingAmount: null,
          startDate: '',
          endDate: '',
          securedAmount: null,
        },
        { type: '10', title: '', date: '', magazine: '', ministerialPoints: null },
      ],
    });
    expect(request.researchTasks).toMatchObject([
      { financingAmount: null, securedAmount: null },
      { ministerialPoints: null },
    ]);
  });

  it('still limits cruise-day comments in a draft', () => {
    const day = {
      number: 0,
      hours: 0,
      taskName: '',
      region: '',
      position: '',
      comment: 'x'.repeat(1024),
    };
    expect(getFormBDraftFieldsSchema().safeParse({ ...formBDefaultValues, cruiseDaysDetails: [day] }).success).toBe(
      true
    );
    expect(
      getFormBDraftFieldsSchema().safeParse({
        ...formBDefaultValues,
        cruiseDaysDetails: [{ ...day, comment: day.comment + 'x' }],
      })
    ).toMatchObject(issueAt(['cruiseDaysDetails', 0, 'comment']));
  });
});

describe('ship availability', () => {
  const precise = () => ({
    ...a(),
    periodSelectionType: 'precise',
    acceptablePeriod: '',
    optimalPeriod: '',
    cruiseDays: 2,
    cruiseHours: 0,
    precisePeriodStart: '2026-06-01T00:00:00Z',
    precisePeriodEnd: '2026-06-07T00:00:00Z',
  });

  it('requires one continuous slot, not the sum of gaps between blockades', () => {
    const blocked = getFormAValidationSchema(options, [
      { title: 'Remont', startDate: '2026-06-02T00:00:00Z', endDate: '2026-06-03T00:00:00Z' },
      { title: 'Przegląd', startDate: '2026-06-04T00:00:00Z', endDate: '2026-06-06T00:00:00Z' },
    ]);
    expect(blocked.safeParse(precise())).toMatchObject(issueAt(['precisePeriodEnd']));
    expect(blocked.safeParse({ ...precise(), precisePeriodEnd: '2026-06-09T00:00:00Z' }).success).toBe(true);
  });

  it.each([
    ['2026-05-16T22:00:00', '2026-05-17T22:00:00', 24, '2026-05-17T22:00:00Z', '2026-05-18T22:00:00Z', true],
    ['2026-05-17', '2026-05-18', 24, '2026-05-17T22:00:00Z', '2026-05-18T22:00:00Z', true],
    ['2026-05-16T22:00:00', '2026-05-17T22:00:00', 24, '2026-05-17T21:00:00Z', '2026-05-18T22:00:00Z', false],
    ['2026-03-28T23:00:00', '2026-03-29T22:00:00', 1, '2026-03-28T23:00:00Z', '2026-03-29T22:00:00Z', false],
    ['2026-03-29', '2026-03-30', 1, '2026-03-28T23:00:00Z', '2026-03-29T22:00:00Z', false],
    ['2026-03-29', '2026-03-30', 1, '2026-03-28T23:00:00Z', '2026-03-29T21:00:00Z', true],
  ])('compares the period %s to %s with blockades as real times', (start, end, hours, from, to, valid) => {
    const blocked = getFormAValidationSchema(options, [{ title: 'Remont', startDate: from, endDate: to }]);
    const result = blocked.safeParse({
      ...precise(),
      cruiseDays: Math.floor(hours / 24),
      cruiseHours: hours % 24,
      precisePeriodStart: start,
      precisePeriodEnd: end,
    });
    expect(result.success).toBe(valid);
  });

  it('does not reject a slot that only touches the end of a blockade', () => {
    const blocked = getFormAValidationSchema(options, [
      { title: 'Remont', startDate: '2026-05-01T00:00:00Z', endDate: '2026-06-01T00:00:00Z' },
    ]);
    expect(blocked.safeParse(precise()).success).toBe(true);
  });
});
