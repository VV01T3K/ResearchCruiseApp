import { z } from 'zod';

import { groupBy } from '@/lib/utils';
import { CrewMemberDtoValidationSchema } from '@/api/dto/applications/CrewMemberDto';
import { CruiseDayDetailsDtoValidationSchema } from '@/api/dto/applications/CruiseDayDetailsDto';
import { GuestTeamDtoValidationSchema } from '@/api/dto/applications/GuestTeamDto';
import { LongResearchEquipmentDtoValidationSchema } from '@/api/dto/applications/LongResearchEquipmentDto';
import { PermissionDtoWithFileValidationSchema } from '@/api/dto/applications/PermissionDto';
import { PortDtoValidationSchema } from '@/api/dto/applications/PortDto';
import { ResearchEquipmentDtoValidationSchema } from '@/api/dto/applications/ResearchEquipmentDto';
import { ShortResearchEquipmentDtoValidationSchema } from '@/api/dto/applications/ShortResearchEquipmentDto';
import { UGTeamDtoValidationSchema } from '@/api/dto/applications/UGTeamDto';

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
    permissions: PermissionDtoWithFileValidationSchema.array(),
    ugTeams: UGTeamDtoValidationSchema.array()
      .min(1, 'Co najmniej jeden zespół UG jest wymagany')
      .refine(
        (val) => val.every((x) => parseInt(x.noOfEmployees, 10) + parseInt(x.noOfStudents, 10) > 0),
        'Zespół UG musi składać się z co najmniej jednej osoby'
      )
      .refine(
        (val) => groupBy(val, (x) => x.ugUnitId).filter((x) => x[1].length > 1).length === 0,
        'Nie można dodać dwóch zespołów UG z tego samego wydziału'
      ),
    guestTeams: GuestTeamDtoValidationSchema.array(),
    crewMembers: CrewMemberDtoValidationSchema.array(),
    shortResearchEquipments: ShortResearchEquipmentDtoValidationSchema.array(),
    longResearchEquipments: LongResearchEquipmentDtoValidationSchema.array(),
    ports: PortDtoValidationSchema.array(),
    cruiseDaysDetails: CruiseDayDetailsDtoValidationSchema.array(),
    researchEquipments: ResearchEquipmentDtoValidationSchema.array(),
    shipEquipmentsIds: z.array(z.string()),
  });
}
