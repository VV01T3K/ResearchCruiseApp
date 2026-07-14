import { z as zod } from 'zod';
import { CollectedSampleFields } from './collectedSampleFields.gen.ts';
import { ContractFields } from './contractFields.gen.ts';
import { CruiseDayFields } from './cruiseDayFields.gen.ts';
import { FileContent } from './fileContent.gen.ts';
import { GuestTeamFields } from './guestTeamFields.gen.ts';
import { LongTermResearchEquipmentFields } from './longTermResearchEquipmentFields.gen.ts';
import { PermissionFields } from './permissionFields.gen.ts';
import { PortCallFields } from './portCallFields.gen.ts';
import { ResearchAreaSelection } from './researchAreaSelection.gen.ts';
import { ResearchEquipmentFields } from './researchEquipmentFields.gen.ts';
import { ResearchTaskEffectFields } from './researchTaskEffectFields.gen.ts';
import { ShortTermResearchEquipmentFields } from './shortTermResearchEquipmentFields.gen.ts';
import { SpubTaskFields } from './spubTaskFields.gen.ts';
import { UgTeamFields } from './ugTeamFields.gen.ts';

export const formCFieldsShipUsageMin = 0;
export const formCFieldsShipUsageMax = 1;

export const formCFieldsDifferentUsageMin = 0;
export const formCFieldsDifferentUsageMax = 1024;

export const formCFieldsShipEquipmentsIdsItemRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const formCFieldsSpubReportDataMin = 0;
export const formCFieldsSpubReportDataMax = 10240;

export const formCFieldsAdditionalDescriptionMin = 0;
export const formCFieldsAdditionalDescriptionMax = 10240;



export const FormCFields = zod.object({
  "shipUsage": zod.string().min(formCFieldsShipUsageMin).max(formCFieldsShipUsageMax).optional(),
  "differentUsage": zod.string().min(formCFieldsDifferentUsageMin).max(formCFieldsDifferentUsageMax).optional(),
  "permissions": zod.array(PermissionFields).optional(),
  "researchAreaDescriptions": zod.array(ResearchAreaSelection).optional(),
  "ugTeams": zod.array(UgTeamFields).optional(),
  "guestTeams": zod.array(GuestTeamFields).optional(),
  "researchTasksEffects": zod.array(ResearchTaskEffectFields).optional(),
  "contracts": zod.array(ContractFields).optional(),
  "spubTasks": zod.array(SpubTaskFields).optional(),
  "shortResearchEquipments": zod.array(ShortTermResearchEquipmentFields).optional(),
  "longResearchEquipments": zod.array(LongTermResearchEquipmentFields).optional(),
  "ports": zod.array(PortCallFields).optional(),
  "cruiseDaysDetails": zod.array(CruiseDayFields).optional(),
  "researchEquipments": zod.array(ResearchEquipmentFields).optional(),
  "shipEquipmentsIds": zod.array(zod.string().regex(formCFieldsShipEquipmentsIdsItemRegExp)).optional(),
  "collectedSamples": zod.array(CollectedSampleFields).optional(),
  "spubReportData": zod.string().min(formCFieldsSpubReportDataMin).max(formCFieldsSpubReportDataMax).nullish(),
  "additionalDescription": zod.string().min(formCFieldsAdditionalDescriptionMin).max(formCFieldsAdditionalDescriptionMax).nullish(),
  "photos": zod.array(FileContent).optional()
});

export type FormCFields = zod.input<typeof FormCFields>;
export type FormCFieldsOutput = zod.output<typeof FormCFields>;
