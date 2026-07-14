import { z } from 'zod';

import { FormBWriteRequest } from '@/api/generated/schemas';
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

export function getFormBValidationSchema() {
  return z.object({
    isCruiseManagerPresent: z.enum(['true', 'false']),
    permissions: PermissionWithFileValuesSchema.array(),
    ugTeams: UgTeamValuesSchema.array()
      .min(1, 'Co najmniej jeden zespół UG jest wymagany')
      .refine(
        (val) => val.every((x) => parseInt(x.noOfEmployees, 10) + parseInt(x.noOfStudents, 10) > 0),
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
  return getFormBValidationSchema()
    .transform((form): z.input<typeof FormBWriteRequest> => ({ form, draft }))
    .pipe(FormBWriteRequest);
}
