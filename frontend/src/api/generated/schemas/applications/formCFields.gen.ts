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
  "shipUsage": zod.string().min(formCFieldsShipUsageMin).max(formCFieldsShipUsageMax),
  "differentUsage": zod.string().min(formCFieldsDifferentUsageMin).max(formCFieldsDifferentUsageMax),
  "permissions": zod.array(PermissionFields),
  "researchAreaDescriptions": zod.array(ResearchAreaSelection),
  "ugTeams": zod.array(UgTeamFields),
  "guestTeams": zod.array(GuestTeamFields),
  "researchTasksEffects": zod.array(ResearchTaskEffectFields),
  "contracts": zod.array(ContractFields),
  "spubTasks": zod.array(SpubTaskFields),
  "shortResearchEquipments": zod.array(ShortTermResearchEquipmentFields),
  "longResearchEquipments": zod.array(LongTermResearchEquipmentFields),
  "ports": zod.array(PortCallFields),
  "cruiseDaysDetails": zod.array(CruiseDayFields),
  "researchEquipments": zod.array(ResearchEquipmentFields),
  "shipEquipmentsIds": zod.array(zod.string().regex(formCFieldsShipEquipmentsIdsItemRegExp)),
  "collectedSamples": zod.array(CollectedSampleFields),
  "spubReportData": zod.string().min(formCFieldsSpubReportDataMin).max(formCFieldsSpubReportDataMax).nullable(),
  "additionalDescription": zod.string().min(formCFieldsAdditionalDescriptionMin).max(formCFieldsAdditionalDescriptionMax).nullable(),
  "photos": zod.array(FileContent)
});

export type FormCFields = zod.input<typeof FormCFields>;
export type FormCFieldsOutput = zod.output<typeof FormCFields>;
