import { submissionSchema } from '@/integrations/tanstack/form/schema';
import { z } from 'zod';

import { FormCFields } from '@/api/generated/schemas';
import { groupBy } from '@/lib/utils';
import { storedBoolean, storedNumber } from '@/features/applications/schemas/storedValues';
import {
  CollectedSampleValuesInputSchema,
  CollectedSampleValuesSchema,
} from '@/features/applications/schemas/types/CollectedSampleValues';
import { ContractValuesInputSchema, ContractValuesSchema } from '@/features/applications/schemas/types/ContractValues';
import {
  CruiseDayValuesInputSchema,
  CruiseDayValuesSchema,
} from '@/features/applications/schemas/types/CruiseDayValues';
import { FormFileValuesInputSchema, FormFileValuesSchema } from '@/features/applications/schemas/types/FormFileValues';
import {
  GuestTeamValuesInputSchema,
  GuestTeamValuesSchema,
} from '@/features/applications/schemas/types/GuestTeamValues';
import {
  LongResearchEquipmentValuesInputSchema,
  LongResearchEquipmentValuesSchema,
} from '@/features/applications/schemas/types/LongResearchEquipmentValues';
import {
  PermissionValuesInputSchema,
  PermissionWithFileValuesSchema,
} from '@/features/applications/schemas/types/PermissionValues';
import { PortCallValuesInputSchema, PortCallValuesSchema } from '@/features/applications/schemas/types/PortCallValues';
import {
  ResearchEquipmentValuesInputSchema,
  ResearchEquipmentValuesSchema,
} from '@/features/applications/schemas/types/ResearchEquipmentValues';
import {
  ResearchTaskEffectValuesInputSchema,
  ResearchTaskEffectValuesSchema,
} from '@/features/applications/schemas/types/ResearchTaskEffectValues';
import {
  ShortResearchEquipmentValuesInputSchema,
  ShortResearchEquipmentValuesSchema,
} from '@/features/applications/schemas/types/ShortResearchEquipmentValues';
import { SpubTaskValuesInputSchema, SpubTaskValuesSchema } from '@/features/applications/schemas/types/SpubTaskValues';
import { UgTeamValuesInputSchema, UgTeamValuesSchema } from '@/features/applications/schemas/types/UgTeamValues';
import { FormAOptions } from '@/api/generated/schemas';
import {
  getResearchAreaValuesSchema,
  ResearchAreaValuesInputSchema,
} from '@/features/applications/schemas/types/ResearchAreaValues';
import {
  mapContractToValues,
  mapResearchTaskToValues,
  mapSpubTaskToValues,
} from '@/features/applications/schemas/formA.schema';

const FormCInputSchema = z.object({
  draft: z.boolean().optional(),
  revision: z.string().optional(),
  shipUsage: z.string(),
  differentUsage: z.string(),
  permissions: PermissionValuesInputSchema.array(),
  researchAreaDescriptions: ResearchAreaValuesInputSchema.array(),
  ugTeams: UgTeamValuesInputSchema.array(),
  guestTeams: GuestTeamValuesInputSchema.array(),
  researchTasksEffects: ResearchTaskEffectValuesInputSchema.array(),
  contracts: ContractValuesInputSchema.array(),
  spubTasks: SpubTaskValuesInputSchema.array(),
  shortResearchEquipments: ShortResearchEquipmentValuesInputSchema.array(),
  longResearchEquipments: LongResearchEquipmentValuesInputSchema.array(),
  ports: PortCallValuesInputSchema.array(),
  cruiseDaysDetails: CruiseDayValuesInputSchema.array(),
  researchEquipments: ResearchEquipmentValuesInputSchema.array(),
  shipEquipmentsIds: z.array(z.string()),
  collectedSamples: CollectedSampleValuesInputSchema.array(),
  spubReportData: z.string(),
  additionalDescription: z.string(),
  photos: FormFileValuesInputSchema.array(),
});

export type FormCValues = z.input<typeof FormCInputSchema>;

export const formCDefaultValues: FormCValues = {
  draft: false,
  shipUsage: '',
  differentUsage: '',
  permissions: [],
  researchAreaDescriptions: [],
  ugTeams: [],
  guestTeams: [],
  researchTasksEffects: [],
  contracts: [],
  spubTasks: [],
  shortResearchEquipments: [],
  longResearchEquipments: [],
  ports: [],
  cruiseDaysDetails: [],
  researchEquipments: [],
  shipEquipmentsIds: [],
  collectedSamples: [],
  spubReportData: '',
  additionalDescription: '',
  photos: [],
} satisfies FormCValues;

export function getFormCValidationSchema(formAInitValues: FormAOptions) {
  return FormCInputSchema.extend({
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
        (val) => val.every((x) => (x.done ? true : !x.deputyConditionMet && !x.managerConditionMet)),
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
    shipUsage: z.enum(['0', '1', '2', '3', '4'], {
      error: 'Wymagane jest wskazanie sposobu korzystania z statku',
    }),
  }).superRefine(({ shipUsage, differentUsage }, ctx) => {
    if (shipUsage === '4' && !differentUsage) {
      ctx.addIssue({
        code: 'custom',
        message: 'w przypadku wyboru "inne" należy podać informacje o sposobie korzystania z statku',
        path: ['differentUsage'],
      });
    }
  });
}

export function getFormCFieldsSchema(formAInitValues: FormAOptions) {
  return buildFormCFieldsSchema(getFormCValidationSchema(formAInitValues));
}

export function getFormCDraftFieldsSchema() {
  return buildFormCFieldsSchema(FormCInputSchema);
}

function buildFormCFieldsSchema(inputSchema: z.ZodType<FormCValues, FormCValues>) {
  return inputSchema
    .transform(
      (form): z.input<typeof FormCFields> =>
        ({
          ...form,
          revision: form.revision ?? null,
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
          collectedSamples: form.collectedSamples.map((sample) => ({ ...sample, amount: String(sample.amount) })),
          researchEquipments: form.researchEquipments.map((equipment) => ({
            ...equipment,
            permission: String(equipment.permission),
          })),
          researchTasksEffects: form.researchTasksEffects.map((task) => ({
            type: task.type,
            title: 'title' in task ? task.title : null,
            magazine: 'magazine' in task ? task.magazine : null,
            author: 'author' in task ? task.author : null,
            institution: task.institution ?? null,
            date: 'date' in task ? task.date : null,
            startDate: 'startDate' in task ? task.startDate : null,
            endDate: 'endDate' in task ? task.endDate : null,
            financingAmount:
              'financingAmount' in task && task.financingAmount !== null ? String(task.financingAmount) : null,
            financingApproved: 'financingApproved' in task ? String(task.financingApproved) : null,
            description: 'description' in task ? task.description : null,
            securedAmount: 'securedAmount' in task && task.securedAmount !== null ? String(task.securedAmount) : null,
            ministerialPoints:
              'ministerialPoints' in task && task.ministerialPoints !== null ? String(task.ministerialPoints) : null,
            publicationMinisterialPoints: task.publicationMinisterialPoints ?? null,
            done: String(task.done),
            managerConditionMet: String(task.managerConditionMet),
            deputyConditionMet: String(task.deputyConditionMet),
          })),
          spubReportData: form.spubReportData || null,
          additionalDescription: form.additionalDescription || null,
        }) satisfies Required<z.input<typeof FormCFields>>
    )
    .pipe(FormCFields);
}

export function mapFormCToValues(form: FormCFields): FormCValues {
  return {
    revision: form.revision ?? undefined,
    shipUsage: form.shipUsage ?? '',
    differentUsage: form.differentUsage ?? '',
    permissions: (form.permissions ?? []).map((permission) => ({
      description: permission.description ?? '',
      executive: permission.executive ?? '',
      scan: permission.scan ? { name: permission.scan.name ?? '', content: permission.scan.content ?? '' } : undefined,
    })),
    researchAreaDescriptions: (form.researchAreaDescriptions ?? []).map((area) => ({
      areaId: area.areaId ?? null,
      differentName: area.differentName ?? null,
      info: area.info ?? '',
    })),
    ugTeams: (form.ugTeams ?? []).map((team) => ({
      ugUnitId: team.ugUnitId ?? '',
      noOfEmployees: storedNumber(team.noOfEmployees),
      noOfStudents: storedNumber(team.noOfStudents),
    })),
    guestTeams: (form.guestTeams ?? []).map((team) => ({
      name: team.name ?? '',
      noOfPersons: storedNumber(team.noOfPersons),
    })),
    contracts: (form.contracts ?? []).map(mapContractToValues),
    spubTasks: (form.spubTasks ?? []).map(mapSpubTaskToValues),
    shortResearchEquipments: (form.shortResearchEquipments ?? []).map((equipment) => ({
      name: equipment.name ?? '',
      startDate: equipment.startDate ?? '',
      endDate: equipment.endDate ?? '',
    })),
    longResearchEquipments: (form.longResearchEquipments ?? []).map((equipment) => ({
      name: equipment.name ?? '',
      action: equipment.action === 'Collect' ? 'Collect' : 'Put',
      duration: equipment.duration ?? '',
    })),
    researchTasksEffects: (form.researchTasksEffects ?? []).map((task) => ({
      ...mapResearchTaskToValues(task),
      done: storedBoolean(task.done),
      managerConditionMet: storedBoolean(task.managerConditionMet),
      deputyConditionMet: storedBoolean(task.deputyConditionMet),
      publicationMinisterialPoints: task.publicationMinisterialPoints ?? null,
    })),
    ports: (form.ports ?? []).map((port) => ({
      name: port.name ?? '',
      startTime: port.startTime ?? '',
      endTime: port.endTime ?? '',
    })),
    cruiseDaysDetails: (form.cruiseDaysDetails ?? []).map((day) => ({
      number: storedNumber(day.number),
      hours: storedNumber(day.hours),
      taskName: day.taskName ?? '',
      region: day.region ?? '',
      position: day.position ?? '',
      comment: day.comment ?? '',
    })),
    researchEquipments: (form.researchEquipments ?? []).map((equipment) => ({
      name: equipment.name ?? '',
      insuranceStartDate: equipment.insuranceStartDate ?? null,
      insuranceEndDate: equipment.insuranceEndDate ?? null,
      permission: storedBoolean(equipment.permission),
    })),
    shipEquipmentsIds: form.shipEquipmentsIds ?? [],
    collectedSamples: (form.collectedSamples ?? []).map((sample) => ({
      type: sample.type ?? '',
      amount: storedNumber(sample.amount),
      analysis: sample.analysis ?? '',
      publishing: sample.publishing ?? '',
    })),
    spubReportData: form.spubReportData ?? '',
    additionalDescription: form.additionalDescription ?? '',
    photos: (form.photos ?? []).map((photo) => ({ name: photo.name ?? '', content: photo.content ?? '' })),
  };
}

export function getFormCSubmissionSchema(formAInitValues: FormAOptions) {
  return submissionSchema(getFormCFieldsSchema(formAInitValues), getFormCDraftFieldsSchema());
}
