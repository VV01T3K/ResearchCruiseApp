import { z as zod } from 'zod';
import { ContractFields } from './contractFields.gen.ts';
import { GuestTeamFields } from './guestTeamFields.gen.ts';
import { PermissionFields } from './permissionFields.gen.ts';
import { PublicationFields } from './publicationFields.gen.ts';
import { ResearchAreaSelection } from './researchAreaSelection.gen.ts';
import { ResearchTaskFields } from './researchTaskFields.gen.ts';
import { SpubTaskFields } from './spubTaskFields.gen.ts';
import { UgTeamFields } from './ugTeamFields.gen.ts';

export const formAFieldsIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const formAFieldsCruiseManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const formAFieldsDeputyManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const formAFieldsYearMin = 0;
export const formAFieldsYearMax = 4;

export const formAFieldsPeriodSelectionTypeMin = 0;
export const formAFieldsPeriodSelectionTypeMax = 16;

export const formAFieldsCruiseHoursMin = 0;
export const formAFieldsCruiseHoursMax = 8;

export const formAFieldsPeriodNotesMin = 0;
export const formAFieldsPeriodNotesMax = 1024;

export const formAFieldsShipUsageMin = 0;
export const formAFieldsShipUsageMax = 1;

export const formAFieldsDifferentUsageMin = 0;
export const formAFieldsDifferentUsageMax = 1024;

export const formAFieldsCruiseGoalDescriptionMin = 0;
export const formAFieldsCruiseGoalDescriptionMax = 10240;

export const formAFieldsSupervisorEmailMin = 0;
export const formAFieldsSupervisorEmailMax = 1024;

export const formAFieldsNoteMin = 0;
export const formAFieldsNoteMax = 1024;



export const FormAFields = zod.object({
  "id": zod.string().regex(formAFieldsIdRegExp).nullish(),
  "cruiseManagerId": zod.string().regex(formAFieldsCruiseManagerIdRegExp).optional(),
  "deputyManagerId": zod.string().regex(formAFieldsDeputyManagerIdRegExp).nullish(),
  "year": zod.string().min(formAFieldsYearMin).max(formAFieldsYearMax).optional(),
  "acceptablePeriod": zod.array(zod.string()).nullish(),
  "optimalPeriod": zod.array(zod.string()).nullish(),
  "periodSelectionType": zod.string().min(formAFieldsPeriodSelectionTypeMin).max(formAFieldsPeriodSelectionTypeMax).nullish(),
  "precisePeriodStart": zod.iso.datetime({"offset":true}).nullish(),
  "precisePeriodEnd": zod.iso.datetime({"offset":true}).nullish(),
  "cruiseHours": zod.string().min(formAFieldsCruiseHoursMin).max(formAFieldsCruiseHoursMax).optional(),
  "periodNotes": zod.string().min(formAFieldsPeriodNotesMin).max(formAFieldsPeriodNotesMax).optional(),
  "shipUsage": zod.string().min(formAFieldsShipUsageMin).max(formAFieldsShipUsageMax).nullish(),
  "differentUsage": zod.string().min(formAFieldsDifferentUsageMin).max(formAFieldsDifferentUsageMax).optional(),
  "permissions": zod.array(PermissionFields).optional(),
  "researchAreaDescriptions": zod.array(ResearchAreaSelection).optional(),
  "cruiseGoal": zod.string().nullish(),
  "cruiseGoalDescription": zod.string().min(formAFieldsCruiseGoalDescriptionMin).max(formAFieldsCruiseGoalDescriptionMax).optional(),
  "researchTasks": zod.array(ResearchTaskFields).optional(),
  "contracts": zod.array(ContractFields).optional(),
  "ugTeams": zod.array(UgTeamFields).optional(),
  "guestTeams": zod.array(GuestTeamFields).optional(),
  "publications": zod.array(PublicationFields).optional(),
  "spubTasks": zod.array(SpubTaskFields).optional(),
  "supervisorEmail": zod.string().min(formAFieldsSupervisorEmailMin).max(formAFieldsSupervisorEmailMax).optional(),
  "note": zod.string().min(formAFieldsNoteMin).max(formAFieldsNoteMax).nullish()
});

export type FormAFields = zod.input<typeof FormAFields>;
export type FormAFieldsOutput = zod.output<typeof FormAFields>;
