import { z } from 'zod';

import { groupBy } from '@/core/lib/utils';
import { CrewMemberDtoValidationSchema } from '@/cruise-applications/models/CrewMemberDto';
import { CruiseDayDetailsDtoValidationSchema } from '@/cruise-applications/models/CruiseDayDetailsDto';
import { GuestTeamDtoValidationSchema } from '@/cruise-applications/models/GuestTeamDto';
import { LongResearchEquipmentDtoValidationSchema } from '@/cruise-applications/models/LongResearchEquipmentDto';
import { PermissionDtoWithFileValidationSchema } from '@/cruise-applications/models/PermissionDto';
import { PortDtoValidationSchema } from '@/cruise-applications/models/PortDto';
import { ResearchEquipmentDtoValidationSchema } from '@/cruise-applications/models/ResearchEquipmentDto';
import { ShortResearchEquipmentDtoValidationSchema } from '@/cruise-applications/models/ShortResearchEquipmentDto';
import { UGTeamDtoValidationSchema } from '@/cruise-applications/models/UGTeamDto';

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
