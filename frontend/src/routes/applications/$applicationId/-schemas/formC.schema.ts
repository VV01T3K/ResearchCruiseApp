import { z } from 'zod';

import { FormCFields, FormCWriteRequest } from '@/api/generated/schemas';
import { groupBy } from '@/lib/utils';
import { CollectedSampleValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/CollectedSampleValues';
import { ContractValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/ContractValues';
import { CruiseDayValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/CruiseDayValues';
import { FormFileValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/FormFileValues';
import { GuestTeamValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamValues';
import { LongResearchEquipmentValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/LongResearchEquipmentValues';
import { PermissionWithFileValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';
import { PortCallValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/PortCallValues';
import { ResearchEquipmentValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/ResearchEquipmentValues';
import { ResearchTaskEffectValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskEffectValues';
import { ShortResearchEquipmentValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/ShortResearchEquipmentValues';
import { SpubTaskValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/SpubTaskValues';
import { UgTeamValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/UgTeamValues';
import { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import { getResearchAreaValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/ResearchAreaValues';
import type { FormCValues } from '@/routes/applications/$applicationId/-schemas/types/FormCValues';
import { mapResearchTaskToValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';

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

const OtherValidationSchema = (formAInitValues: FormAOptions) =>
  z.object({
    permissions: PermissionWithFileValuesSchema.array(),
    researchAreaDescriptions: getResearchAreaValuesSchema(formAInitValues)
      .array()
      .min(1, 'Co najmniej jeden rejon badań jest wymagany'),
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
    researchTasksEffects: ResearchTaskEffectValuesSchema.array()
      .min(1, 'Co najmniej jedno zadanie badawcze jest wymagane')
      .refine(
        (val) =>
          val.every((x) =>
            x.done === 'false' ? x.deputyConditionMet === 'false' && x.managerConditionMet === 'false' : true
          ),
        'Jeżeli zadanie badawcze nie zostało skończone, nie można naliczyć punktów'
      ),
    contracts: ContractValuesSchema.array(),
    spubTasks: SpubTaskValuesSchema.array(),
    shortResearchEquipments: ShortResearchEquipmentValuesSchema.array(),
    longResearchEquipments: LongResearchEquipmentValuesSchema.array(),
    ports: PortCallValuesSchema.array(),
    cruiseDaysDetails: CruiseDayValuesSchema.array(),
    researchEquipments: ResearchEquipmentValuesSchema.array(),
    shipEquipmentsIds: z.array(z.string()),
    collectedSamples: CollectedSampleValuesSchema.array(),
    spubReportData: z.string().max(10240, 'Maksymalna długość to 10240 znaków'),
    additionalDescription: z.string().max(10240, 'Maksymalna długość to 10240 znaków'),
    photos: FormFileValuesSchema.array(),
  });

export function getFormCValidationSchema(formAInitValues: FormAOptions) {
  return ShipUsageValidationSchema.and(OtherValidationSchema(formAInitValues));
}

export function getFormCWriteSchema(formAInitValues: FormAOptions, draft: boolean) {
  return getFormCValidationSchema(formAInitValues)
    .transform(
      (form): z.input<typeof FormCWriteRequest> => ({
        form: {
          ...form,
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
          collectedSamples: form.collectedSamples.map((sample) => ({ ...sample, amount: String(sample.amount) })),
          researchTasksEffects: form.researchTasksEffects.map((task) => ({
            type: task.type,
            title: 'title' in task ? task.title : null,
            magazine: 'magazine' in task ? task.magazine : null,
            author: 'author' in task ? task.author : null,
            institution: null,
            date: 'date' in task ? task.date : null,
            startDate: 'startDate' in task ? task.startDate : null,
            endDate: 'endDate' in task ? task.endDate : null,
            financingAmount:
              'financingAmount' in task && task.financingAmount !== null ? String(task.financingAmount) : null,
            financingApproved: 'financingApproved' in task ? task.financingApproved : null,
            description: 'description' in task ? task.description : null,
            securedAmount: 'securedAmount' in task && task.securedAmount !== null ? String(task.securedAmount) : null,
            ministerialPoints:
              'ministerialPoints' in task && task.ministerialPoints !== null ? String(task.ministerialPoints) : null,
            publicationMinisterialPoints: null,
            done: task.done,
            managerConditionMet: task.managerConditionMet,
            deputyConditionMet: task.deputyConditionMet,
          })),
          spubReportData: form.spubReportData || null,
          additionalDescription: form.additionalDescription || null,
        },
        draft,
      })
    )
    .pipe(FormCWriteRequest);
}

export function mapFormCToValues(form: FormCFields): FormCValues {
  return {
    ...form,
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
    contracts: form.contracts.map((contract) => ({
      ...contract,
      category: contract.category === 'international' ? 'international' : 'domestic',
      institutionName: contract.institutionName ?? '',
      institutionUnit: contract.institutionUnit ?? '',
      institutionLocalization: contract.institutionLocalization ?? '',
      description: contract.description ?? '',
    })),
    spubTasks: form.spubTasks.map((task) => ({
      name: task.name ?? '',
      yearFrom: task.yearFrom ?? '',
      yearTo: task.yearTo ?? '',
    })),
    longResearchEquipments: form.longResearchEquipments.map((equipment) => ({
      ...equipment,
      action: equipment.action === 'Collect' ? 'Collect' : 'Put',
    })),
    researchTasksEffects: form.researchTasksEffects.map((task) => ({
      ...mapResearchTaskToValues(task),
      done: task.done === 'true' ? 'true' : 'false',
      managerConditionMet: task.managerConditionMet === 'true' ? 'true' : 'false',
      deputyConditionMet: task.deputyConditionMet === 'true' ? 'true' : 'false',
    })),
    cruiseDaysDetails: form.cruiseDaysDetails.map((day) => ({
      ...day,
      number: toNumber(day.number),
      hours: toNumber(day.hours),
    })),
    collectedSamples: form.collectedSamples.map((sample) => ({ ...sample, amount: toNumber(sample.amount) })),
    researchEquipments: form.researchEquipments.map((equipment) => ({
      ...equipment,
      permission: equipment.permission === 'true' ? 'true' : 'false',
    })),
    spubReportData: form.spubReportData ?? '',
    additionalDescription: form.additionalDescription ?? '',
  };
}

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
