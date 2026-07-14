import { z as zod } from 'zod';
import { ContractDto } from './contractDto.gen.ts';
import { GuestTeamDto } from './guestTeamDto.gen.ts';
import { PermissionDto } from './permissionDto.gen.ts';
import { PublicationDto } from './publicationDto.gen.ts';
import { ResearchAreaDescriptionDto } from './researchAreaDescriptionDto.gen.ts';
import { ResearchTaskDto } from './researchTaskDto.gen.ts';
import { SpubTaskDto } from './spubTaskDto.gen.ts';
import { UgTeamDto } from './ugTeamDto.gen.ts';

export const formADtoIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const formADtoCruiseManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const formADtoDeputyManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const formADtoYearMin = 0;
export const formADtoYearMax = 4;

export const formADtoPeriodSelectionTypeMin = 0;
export const formADtoPeriodSelectionTypeMax = 16;

export const formADtoCruiseHoursMin = 0;
export const formADtoCruiseHoursMax = 8;

export const formADtoPeriodNotesMin = 0;
export const formADtoPeriodNotesMax = 1024;

export const formADtoShipUsageMin = 0;
export const formADtoShipUsageMax = 1;

export const formADtoDifferentUsageMin = 0;
export const formADtoDifferentUsageMax = 1024;

export const formADtoCruiseGoalDescriptionMin = 0;
export const formADtoCruiseGoalDescriptionMax = 10240;

export const formADtoSupervisorEmailMin = 0;
export const formADtoSupervisorEmailMax = 1024;

export const formADtoNoteMin = 0;
export const formADtoNoteMax = 1024;



export const FormADto = zod.object({
  "id": zod.string().regex(formADtoIdRegExp).nullish(),
  "cruiseManagerId": zod.string().regex(formADtoCruiseManagerIdRegExp).optional(),
  "deputyManagerId": zod.string().regex(formADtoDeputyManagerIdRegExp).nullish(),
  "year": zod.string().min(formADtoYearMin).max(formADtoYearMax).optional(),
  "acceptablePeriod": zod.array(zod.string()).nullish(),
  "optimalPeriod": zod.array(zod.string()).nullish(),
  "periodSelectionType": zod.string().min(formADtoPeriodSelectionTypeMin).max(formADtoPeriodSelectionTypeMax).nullish(),
  "precisePeriodStart": zod.iso.datetime({"offset":true}).nullish(),
  "precisePeriodEnd": zod.iso.datetime({"offset":true}).nullish(),
  "cruiseHours": zod.string().min(formADtoCruiseHoursMin).max(formADtoCruiseHoursMax).optional(),
  "periodNotes": zod.string().min(formADtoPeriodNotesMin).max(formADtoPeriodNotesMax).optional(),
  "shipUsage": zod.string().min(formADtoShipUsageMin).max(formADtoShipUsageMax).nullish(),
  "differentUsage": zod.string().min(formADtoDifferentUsageMin).max(formADtoDifferentUsageMax).optional(),
  "permissions": zod.array(PermissionDto).optional(),
  "researchAreaDescriptions": zod.array(ResearchAreaDescriptionDto).optional(),
  "cruiseGoal": zod.string().nullish(),
  "cruiseGoalDescription": zod.string().min(formADtoCruiseGoalDescriptionMin).max(formADtoCruiseGoalDescriptionMax).optional(),
  "researchTasks": zod.array(ResearchTaskDto).optional(),
  "contracts": zod.array(ContractDto).optional(),
  "ugTeams": zod.array(UgTeamDto).optional(),
  "guestTeams": zod.array(GuestTeamDto).optional(),
  "publications": zod.array(PublicationDto).optional(),
  "spubTasks": zod.array(SpubTaskDto).optional(),
  "supervisorEmail": zod.string().min(formADtoSupervisorEmailMin).max(formADtoSupervisorEmailMax).optional(),
  "note": zod.string().min(formADtoNoteMin).max(formADtoNoteMax).nullish()
});

export type FormADto = zod.input<typeof FormADto>;
export type FormADtoOutput = zod.output<typeof FormADto>;
