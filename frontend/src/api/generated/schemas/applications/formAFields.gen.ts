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
  "id": zod.string().regex(formAFieldsIdRegExp).nullable(),
  "cruiseManagerId": zod.string().regex(formAFieldsCruiseManagerIdRegExp),
  "deputyManagerId": zod.string().regex(formAFieldsDeputyManagerIdRegExp).nullable(),
  "year": zod.string().min(formAFieldsYearMin).max(formAFieldsYearMax),
  "acceptablePeriod": zod.array(zod.string()).nullable(),
  "optimalPeriod": zod.array(zod.string()).nullable(),
  "periodSelectionType": zod.string().min(formAFieldsPeriodSelectionTypeMin).max(formAFieldsPeriodSelectionTypeMax).nullable(),
  "precisePeriodStart": zod.iso.datetime({"offset":true}).nullable(),
  "precisePeriodEnd": zod.iso.datetime({"offset":true}).nullable(),
  "cruiseHours": zod.string().min(formAFieldsCruiseHoursMin).max(formAFieldsCruiseHoursMax),
  "periodNotes": zod.string().min(formAFieldsPeriodNotesMin).max(formAFieldsPeriodNotesMax),
  "shipUsage": zod.string().min(formAFieldsShipUsageMin).max(formAFieldsShipUsageMax).nullable(),
  "differentUsage": zod.string().min(formAFieldsDifferentUsageMin).max(formAFieldsDifferentUsageMax),
  "permissions": zod.array(PermissionFields),
  "researchAreaDescriptions": zod.array(ResearchAreaSelection),
  "cruiseGoal": zod.string().nullable(),
  "cruiseGoalDescription": zod.string().min(formAFieldsCruiseGoalDescriptionMin).max(formAFieldsCruiseGoalDescriptionMax),
  "researchTasks": zod.array(ResearchTaskFields),
  "contracts": zod.array(ContractFields),
  "ugTeams": zod.array(UgTeamFields),
  "guestTeams": zod.array(GuestTeamFields),
  "publications": zod.array(PublicationFields),
  "spubTasks": zod.array(SpubTaskFields),
  "supervisorEmail": zod.string().min(formAFieldsSupervisorEmailMin).max(formAFieldsSupervisorEmailMax),
  "note": zod.string().min(formAFieldsNoteMin).max(formAFieldsNoteMax).nullable()
});

export type FormAFields = zod.input<typeof FormAFields>;
export type FormAFieldsOutput = zod.output<typeof FormAFields>;
