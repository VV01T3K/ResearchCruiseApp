import { z as zod } from 'zod';
import { CollectedSampleDto } from './collectedSampleDto.gen.ts';
import { ContractDto } from './contractDto.gen.ts';
import { CruiseDayDetailsDto } from './cruiseDayDetailsDto.gen.ts';
import { FileDto } from './fileDto.gen.ts';
import { GuestTeamDto } from './guestTeamDto.gen.ts';
import { LongResearchEquipmentDto } from './longResearchEquipmentDto.gen.ts';
import { PermissionDto } from './permissionDto.gen.ts';
import { PortDto } from './portDto.gen.ts';
import { ResearchAreaDescriptionDto } from './researchAreaDescriptionDto.gen.ts';
import { ResearchEquipmentDto } from './researchEquipmentDto.gen.ts';
import { ResearchTaskEffectDto } from './researchTaskEffectDto.gen.ts';
import { ShortResearchEquipmentDto } from './shortResearchEquipmentDto.gen.ts';
import { SpubTaskDto } from './spubTaskDto.gen.ts';
import { UgTeamDto } from './ugTeamDto.gen.ts';

export const formCDtoShipUsageMin = 0;
export const formCDtoShipUsageMax = 1;

export const formCDtoDifferentUsageMin = 0;
export const formCDtoDifferentUsageMax = 1024;

export const formCDtoShipEquipmentsIdsItemRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const formCDtoSpubReportDataMin = 0;
export const formCDtoSpubReportDataMax = 10240;

export const formCDtoAdditionalDescriptionMin = 0;
export const formCDtoAdditionalDescriptionMax = 10240;



export const FormCDto = zod.object({
  "shipUsage": zod.string().min(formCDtoShipUsageMin).max(formCDtoShipUsageMax).optional(),
  "differentUsage": zod.string().min(formCDtoDifferentUsageMin).max(formCDtoDifferentUsageMax).optional(),
  "permissions": zod.array(PermissionDto).optional(),
  "researchAreaDescriptions": zod.array(ResearchAreaDescriptionDto).optional(),
  "ugTeams": zod.array(UgTeamDto).optional(),
  "guestTeams": zod.array(GuestTeamDto).optional(),
  "researchTasksEffects": zod.array(ResearchTaskEffectDto).optional(),
  "contracts": zod.array(ContractDto).optional(),
  "spubTasks": zod.array(SpubTaskDto).optional(),
  "shortResearchEquipments": zod.array(ShortResearchEquipmentDto).optional(),
  "longResearchEquipments": zod.array(LongResearchEquipmentDto).optional(),
  "ports": zod.array(PortDto).optional(),
  "cruiseDaysDetails": zod.array(CruiseDayDetailsDto).optional(),
  "researchEquipments": zod.array(ResearchEquipmentDto).optional(),
  "shipEquipmentsIds": zod.array(zod.string().regex(formCDtoShipEquipmentsIdsItemRegExp)).optional(),
  "collectedSamples": zod.array(CollectedSampleDto).optional(),
  "spubReportData": zod.string().min(formCDtoSpubReportDataMin).max(formCDtoSpubReportDataMax).nullish(),
  "additionalDescription": zod.string().min(formCDtoAdditionalDescriptionMin).max(formCDtoAdditionalDescriptionMax).nullish(),
  "photos": zod.array(FileDto).optional()
});

export type FormCDto = zod.input<typeof FormCDto>;
export type FormCDtoOutput = zod.output<typeof FormCDto>;
