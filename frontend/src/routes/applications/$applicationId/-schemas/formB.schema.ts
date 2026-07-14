import { z } from 'zod';

import { FormBFields, FormBWriteRequest } from '@/api/generated/schemas';
import type { FormBValues } from '@/routes/applications/$applicationId/-schemas/types/FormBValues';
import { groupBy } from '@/lib/utils';
import { CrewMemberValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/CrewMemberValues';
import { CruiseDayValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/CruiseDayValues';
import { GuestTeamValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamValues';
import { LongResearchEquipmentValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/LongResearchEquipmentValues';
import { PermissionWithFileValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';
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
    permissions: PermissionWithFileValuesSchema.array(),
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
  const inputSchema = draft ? z.custom<FormBValues>() : getFormBValidationSchema();
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
