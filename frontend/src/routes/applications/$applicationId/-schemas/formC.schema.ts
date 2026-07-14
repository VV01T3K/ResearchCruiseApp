import { z } from 'zod';

import { groupBy } from '@/lib/utils';
import { CollectedSampleDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/CollectedSampleDto';
import { ContractDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/ContractDto';
import { CruiseDayDetailsDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/CruiseDayDetailsDto';
import { FileDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/FileDto';
import { GuestTeamDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamDto';
import { LongResearchEquipmentDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/LongResearchEquipmentDto';
import { PermissionDtoWithFileValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/PermissionDto';
import { PortDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/PortDto';
import { ResearchEquipmentDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/ResearchEquipmentDto';
import { ResearchTaskEffectDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskEffectDto';
import { ShortResearchEquipmentDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/ShortResearchEquipmentDto';
import { SpubTaskDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/SpubTaskDto';
import { UGTeamDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/UGTeamDto';
import { FormAInitValuesDto } from '@/routes/applications/$applicationId/-schemas/types/FormAInitValuesDto';
import { getResearchAreaDescriptionDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/ResearchAreaDescriptionDto';

export const FORM_C_FIELD_TO_SECTION: Record<string, number> = {
  shipUsage: 3,
  differentUsage: 3,
  permissions: 4,
  researchAreaDescriptions: 5,
  researchTasksEffects: 7,
  contracts: 8,
  ugTeams: 9,
  guestTeams: 9,
  spubTasks: 11,
  shortResearchEquipments: 12,
  longResearchEquipments: 12,
  ports: 12,
  cruiseDaysDetails: 13,
  researchEquipments: 14,
  shipEquipmentsIds: 15,
  collectedSamples: 16,
  spubReportData: 17,
  photos: 18,
  additionalDescription: 18,
};

const ShipUsageValidationSchema = z
  .object({
    shipUsage: z.enum(['0', '1', '2', '3', '4'], {
      error: 'Wymagane jest wskazanie sposobu korzystania z statku',
    }),
    differentUsage: z.string(),
  })
  .superRefine(({ shipUsage, differentUsage }, ctx) => {
    if (shipUsage === '4' && !differentUsage) {
      ctx.addIssue({
        code: 'custom',
        message: 'w przypadku wyboru "inne" należy podać informacje o sposobie korzystania z statku',
        path: ['differentUsage'],
      });
    }
  });

const OtherValidationSchema = (formAInitValues: FormAInitValuesDto) =>
  z.object({
    permissions: PermissionDtoWithFileValidationSchema.array(),
    researchAreaDescriptions: getResearchAreaDescriptionDtoValidationSchema(formAInitValues)
      .array()
      .min(1, 'Co najmniej jeden rejon badań jest wymagany'),
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
    researchTasksEffects: ResearchTaskEffectDtoValidationSchema.array()
      .min(1, 'Co najmniej jedno zadanie badawcze jest wymagane')
      .refine(
        (val) =>
          val.every((x) =>
            x.done === 'false' ? x.deputyConditionMet === 'false' && x.managerConditionMet === 'false' : true
          ),
        'Jeżeli zadanie badawcze nie zostało skończone, nie można naliczyć punktów'
      ),
    contracts: ContractDtoValidationSchema.array(),
    spubTasks: SpubTaskDtoValidationSchema.array(),
    shortResearchEquipments: ShortResearchEquipmentDtoValidationSchema.array(),
    longResearchEquipments: LongResearchEquipmentDtoValidationSchema.array(),
    ports: PortDtoValidationSchema.array(),
    cruiseDaysDetails: CruiseDayDetailsDtoValidationSchema.array(),
    researchEquipments: ResearchEquipmentDtoValidationSchema.array(),
    shipEquipmentsIds: z.array(z.string()),
    collectedSamples: CollectedSampleDtoValidationSchema.array(),
    spubReportData: z.string().max(10240, 'Maksymalna długość to 10240 znaków'),
    additionalDescription: z.string().max(10240, 'Maksymalna długość to 10240 znaków'),
    photos: FileDtoValidationSchema.array(),
  });

export function getFormCValidationSchema(formAInitValues: FormAInitValuesDto) {
  return ShipUsageValidationSchema.and(OtherValidationSchema(formAInitValues));
}
