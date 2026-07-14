import { z } from 'zod';

import { FormBFields, FormBWriteRequest } from '@/api/generated/schemas';
import { groupBy } from '@/lib/utils';
import { CrewMemberValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/CrewMemberValues';
import { CruiseDayValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/CruiseDayValues';
import { FormFileValuesInputSchema } from '@/routes/applications/$applicationId/-schemas/types/FormFileValues';
import { GuestTeamValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamValues';
import { LongResearchEquipmentValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/LongResearchEquipmentValues';
import { PermissionValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';
import { PortCallValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/PortCallValues';
import { ResearchEquipmentValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/ResearchEquipmentValues';
import { ShortResearchEquipmentValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/ShortResearchEquipmentValues';
import { UgTeamValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/UgTeamValues';

export const FORM_B_FIELD_TO_SECTION: Record<string, number> = {
  isCruiseManagerPresent: 2,
  permissions: 4,
  ugTeams: 9,
  guestTeams: 9,
  crewMembers: 9,
  shortResearchEquipments: 12,
  longResearchEquipments: 12,
  ports: 12,
  cruiseDaysDetails: 13,
  researchEquipments: 14,
  shipEquipmentsIds: 15,
};

const FormBInputSchema = z.object({
  isCruiseManagerPresent: z.enum(['true', 'false']),
  permissions: z
    .object({ description: z.string(), executive: z.string(), scan: FormFileValuesInputSchema.optional() })
    .array(),
  ugTeams: z.object({ ugUnitId: z.string(), noOfEmployees: z.number(), noOfStudents: z.number() }).array(),
  guestTeams: z.object({ name: z.string(), noOfPersons: z.number() }).array(),
  crewMembers: z
    .object({
      title: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      birthPlace: z.string(),
      birthDate: z.string(),
      documentNumber: z.string(),
      documentExpiryDate: z.string(),
      institution: z.string(),
    })
    .array(),
  shortResearchEquipments: z.object({ name: z.string(), startDate: z.string(), endDate: z.string() }).array(),
  longResearchEquipments: z
    .object({ name: z.string(), action: z.enum(['Put', 'Collect']), duration: z.string() })
    .array(),
  ports: z.object({ name: z.string(), startTime: z.string(), endTime: z.string() }).array(),
  cruiseDaysDetails: z
    .object({
      number: z.number(),
      hours: z.number(),
      taskName: z.string(),
      region: z.string(),
      position: z.string(),
      comment: z.string(),
    })
    .array(),
  researchEquipments: z
    .object({
      name: z.string(),
      insuranceStartDate: z.string().nullable(),
      insuranceEndDate: z.string().nullable(),
      permission: z.enum(['true', 'false']),
    })
    .array(),
  shipEquipmentsIds: z.array(z.string()),
});

export type FormBValues = z.input<typeof FormBInputSchema>;

export const formBDefaultValues: FormBValues = {
  isCruiseManagerPresent: 'true',
  permissions: [],
  ugTeams: [],
  guestTeams: [],
  crewMembers: [],
  shortResearchEquipments: [],
  longResearchEquipments: [],
  ports: [],
  cruiseDaysDetails: [],
  researchEquipments: [],
  shipEquipmentsIds: [],
} satisfies FormBValues;

export function getFormBValidationSchema() {
  return z.object({
    isCruiseManagerPresent: z.enum(['true', 'false']),
    permissions: PermissionValuesSchema.array().superRefine((permissions, ctx) => {
      permissions.forEach((permission, index) => {
        if (!permission.scan || !permission.scan.name.endsWith('.pdf')) {
          ctx.addIssue({ code: 'custom', path: [index, 'scan'], message: 'Plik musi być w formacie PDF' });
        }
      });
    }),
    ugTeams: UgTeamValuesSchema.array()
      .min(1, 'Co najmniej jeden zespół UG jest wymagany')
      .refine(
        (val) => val.every((x) => x.noOfEmployees + x.noOfStudents > 0),
        'Zespół UG musi składać się z co najmniej jednej osoby'
      )
      .refine(
        (val) => groupBy(val, (x) => x.ugUnitId).filter((x) => x[1].length > 1).length === 0,
        'Nie można dodać dwóch zespołów UG z tego samego wydziału'
      ),
    guestTeams: GuestTeamValuesSchema.array(),
    crewMembers: CrewMemberValuesSchema.array(),
    shortResearchEquipments: ShortResearchEquipmentValuesSchema.array(),
    longResearchEquipments: LongResearchEquipmentValuesSchema.array(),
    ports: PortCallValuesSchema.array(),
    cruiseDaysDetails: CruiseDayValuesSchema.array(),
    researchEquipments: ResearchEquipmentValuesSchema.array(),
    shipEquipmentsIds: z.array(z.string()),
  });
}

export function getFormBWriteSchema(draft: boolean) {
  const inputSchema = draft ? FormBInputSchema : getFormBValidationSchema();
  return inputSchema
    .transform(
      (form): z.input<typeof FormBWriteRequest> => ({
        form: {
          ...form,
          permissions: form.permissions.map((permission) => ({
            description: permission.description || null,
            executive: permission.executive || null,
            scan: permission.scan ?? null,
          })),
          ugTeams: form.ugTeams.map((team) => ({
            ...team,
            noOfEmployees: String(team.noOfEmployees),
            noOfStudents: String(team.noOfStudents),
          })),
          guestTeams: form.guestTeams.map((team) => ({ ...team, noOfPersons: String(team.noOfPersons) })),
          cruiseDaysDetails: form.cruiseDaysDetails.map((day) => ({
            ...day,
            number: String(day.number),
            hours: String(day.hours),
          })),
        },
        draft,
      })
    )
    .pipe(FormBWriteRequest);
}

export function mapFormBToValues(form: FormBFields): FormBValues {
  return {
    ...form,
    isCruiseManagerPresent: form.isCruiseManagerPresent === 'false' ? 'false' : 'true',
    permissions: form.permissions.map((permission) => ({
      description: permission.description ?? '',
      executive: permission.executive ?? '',
      scan: permission.scan ?? undefined,
    })),
    ugTeams: form.ugTeams.map((team) => ({
      ...team,
      noOfEmployees: toNumber(team.noOfEmployees),
      noOfStudents: toNumber(team.noOfStudents),
    })),
    guestTeams: form.guestTeams.map((team) => ({
      name: team.name ?? '',
      noOfPersons: toNumber(team.noOfPersons),
    })),
    longResearchEquipments: form.longResearchEquipments.map((equipment) => ({
      ...equipment,
      action: equipment.action === 'Collect' ? 'Collect' : 'Put',
    })),
    cruiseDaysDetails: form.cruiseDaysDetails.map((day) => ({
      ...day,
      number: toNumber(day.number),
      hours: toNumber(day.hours),
    })),
    researchEquipments: form.researchEquipments.map((equipment) => ({
      ...equipment,
      permission: equipment.permission === 'true' ? 'true' : 'false',
    })),
  };
}

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
