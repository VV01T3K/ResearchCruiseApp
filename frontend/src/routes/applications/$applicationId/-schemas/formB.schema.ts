import { z } from 'zod';

import { FormBFields, FormBWriteRequest } from '@/api/generated/schemas';
import { groupBy } from '@/lib/utils';
import {
  CrewMemberValuesInputSchema,
  CrewMemberValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/CrewMemberValues';
import {
  CruiseDayValuesInputSchema,
  CruiseDayValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/CruiseDayValues';
import {
  GuestTeamValuesInputSchema,
  GuestTeamValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/GuestTeamValues';
import {
  LongResearchEquipmentValuesInputSchema,
  LongResearchEquipmentValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/LongResearchEquipmentValues';
import {
  PermissionValuesInputSchema,
  PermissionValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';
import {
  PortCallValuesInputSchema,
  PortCallValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/PortCallValues';
import {
  ResearchEquipmentValuesInputSchema,
  ResearchEquipmentValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/ResearchEquipmentValues';
import {
  ShortResearchEquipmentValuesInputSchema,
  ShortResearchEquipmentValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/ShortResearchEquipmentValues';
import {
  UgTeamValuesInputSchema,
  UgTeamValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/UgTeamValues';

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
  isCruiseManagerPresent: z.boolean(),
  permissions: PermissionValuesInputSchema.array(),
  ugTeams: UgTeamValuesInputSchema.array(),
  guestTeams: GuestTeamValuesInputSchema.array(),
  crewMembers: CrewMemberValuesInputSchema.array(),
  shortResearchEquipments: ShortResearchEquipmentValuesInputSchema.array(),
  longResearchEquipments: LongResearchEquipmentValuesInputSchema.array(),
  ports: PortCallValuesInputSchema.array(),
  cruiseDaysDetails: CruiseDayValuesInputSchema.array(),
  researchEquipments: ResearchEquipmentValuesInputSchema.array(),
  shipEquipmentsIds: z.array(z.string()),
});

export type FormBValues = z.input<typeof FormBInputSchema>;

export const formBDefaultValues: FormBValues = {
  isCruiseManagerPresent: true,
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
  return FormBInputSchema.extend({
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
  });
}

export function getFormBWriteSchema() {
  return buildFormBWriteSchema(getFormBValidationSchema(), false);
}

export function getFormBDraftWriteSchema() {
  return buildFormBWriteSchema(FormBInputSchema, true);
}

function buildFormBWriteSchema(inputSchema: z.ZodType<FormBValues, FormBValues>, draft: boolean) {
  return inputSchema
    .transform(
      (form): z.input<typeof FormBWriteRequest> => ({
        form: {
          ...form,
          isCruiseManagerPresent: String(form.isCruiseManagerPresent),
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
          researchEquipments: form.researchEquipments.map((equipment) => ({
            ...equipment,
            permission: String(equipment.permission),
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
    isCruiseManagerPresent: form.isCruiseManagerPresent === 'true',
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
      permission: equipment.permission === 'true',
    })),
  };
}

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
