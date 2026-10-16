import { describe, expect, it } from 'vite-plus/test';
import type { ZodType } from 'zod';
import { formA, formB, formC, formOptions } from '@tests/data/forms';
import { getFormAValidationSchema, mapFormAToValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { getFormBValidationSchema, mapFormBToValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { getFormCValidationSchema, mapFormCToValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';

type RowCase = {
  section: string;
  row: Record<string, unknown>;
  required: string[];
  schema: ZodType;
  form: () => unknown;
};
const a = {
  schema: getFormAValidationSchema(formOptions()),
  form: () => mapFormAToValues(formA()),
};
const b = { schema: getFormBValidationSchema(), form: () => mapFormBToValues(formB()) };
const c = {
  schema: getFormCValidationSchema(formOptions()),
  form: () => mapFormCToValues(formC()),
};

const cases: RowCase[] = [
  {
    ...a,
    section: 'permissions',
    row: { description: 'Pobór próbek', executive: 'Urząd Morski' },
    required: ['description', 'executive'],
  },
  {
    ...a,
    section: 'contracts',
    row: {
      category: 'international',
      institutionName: 'Instytut',
      institutionUnit: 'Wydział',
      institutionLocalization: 'Gdańsk',
      description: 'Badania',
      scans: [],
    },
    required: ['institutionName', 'institutionUnit', 'institutionLocalization', 'description'],
  },
  { ...a, section: 'guestTeams', row: { name: 'Instytut', noOfPersons: 1 }, required: ['name'] },
  {
    ...a,
    section: 'spubTasks',
    row: { name: 'Monitoring', yearFrom: '2025', yearTo: '2026' },
    required: ['name', 'yearFrom', 'yearTo'],
  },
  {
    ...a,
    section: 'publications',
    row: {
      id: '',
      category: 'subject',
      doi: '10.1000/example',
      authors: 'Ada',
      title: 'Salinity',
      magazine: 'Journal',
      year: 2026,
      ministerialPoints: 20,
    },
    required: ['authors', 'title', 'magazine'],
  },
  {
    ...a,
    section: 'researchTasks',
    row: { type: '0', author: 'Ada', title: 'Salinity' },
    required: ['author', 'title'],
  },
  {
    ...b,
    section: 'crewMembers',
    row: {
      title: 'dr',
      firstName: 'Ada',
      lastName: 'Lovelace',
      birthPlace: 'Gdańsk',
      birthDate: '1990-01-01',
      documentNumber: 'ABC123',
      documentExpiryDate: '2030-01-01',
      institution: 'UG',
    },
    required: [
      'title',
      'firstName',
      'lastName',
      'birthPlace',
      'birthDate',
      'documentNumber',
      'documentExpiryDate',
      'institution',
    ],
  },
  {
    ...b,
    section: 'shortResearchEquipments',
    row: { name: 'Sonda', startDate: '2026-06-01', endDate: '2026-06-02' },
    required: ['name', 'startDate', 'endDate'],
  },
  {
    ...b,
    section: 'longResearchEquipments',
    row: { name: 'Boja', action: 'Put', duration: '10' },
    required: ['name', 'duration'],
  },
  {
    ...b,
    section: 'ports',
    row: { name: 'Gdynia', startTime: '2026-06-01', endTime: '2026-06-02' },
    required: ['name', 'startTime', 'endTime'],
  },
  {
    ...b,
    section: 'cruiseDaysDetails',
    row: {
      number: 1,
      hours: 8,
      taskName: 'Pomiary',
      region: 'Zatoka',
      position: '54N 18E',
      comment: '',
    },
    required: ['taskName', 'region', 'position'],
  },
  {
    ...b,
    section: 'researchEquipments',
    row: { name: 'Echosonda', insuranceStartDate: null, insuranceEndDate: null, permission: true },
    required: ['name'],
  },
  {
    ...c,
    section: 'collectedSamples',
    row: { type: 'Woda', amount: 1, analysis: 'Zasolenie', publishing: 'Artykuł' },
    required: ['type', 'analysis', 'publishing'],
  },
];

for (const { section, row, required, schema, form } of cases) {
  describe(section, () => {
    it('accepts a completed row', () => {
      const payload = Object.assign({}, form(), { [section]: [row] });
      expect(schema.safeParse(payload).success).toBe(true);
    });
    it.each(required)('reports an empty %s on its row', (field) => {
      const payload = Object.assign({}, form(), { [section]: [{ ...row, [field]: '' }] });
      expect(schema.safeParse(payload)).toMatchObject({
        success: false,
        error: {
          issues: expect.arrayContaining([expect.objectContaining({ path: [section, 0, field] })]),
        },
      });
    });
  });
}
