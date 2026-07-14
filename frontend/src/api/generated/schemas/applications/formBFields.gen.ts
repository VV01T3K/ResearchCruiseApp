import { z as zod } from 'zod';
import { CrewMemberFields } from './crewMemberFields.gen.ts';
import { CruiseDayFields } from './cruiseDayFields.gen.ts';
import { GuestTeamFields } from './guestTeamFields.gen.ts';
import { LongTermResearchEquipmentFields } from './longTermResearchEquipmentFields.gen.ts';
import { PermissionFields } from './permissionFields.gen.ts';
import { PortCallFields } from './portCallFields.gen.ts';
import { ResearchEquipmentFields } from './researchEquipmentFields.gen.ts';
import { ShortTermResearchEquipmentFields } from './shortTermResearchEquipmentFields.gen.ts';
import { UgTeamFields } from './ugTeamFields.gen.ts';

export const formBFieldsIsCruiseManagerPresentMin = 0;
export const formBFieldsIsCruiseManagerPresentMax = 1024;

export const formBFieldsShipEquipmentsIdsItemRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const FormBFields = zod.object({
  "isCruiseManagerPresent": zod.string().min(formBFieldsIsCruiseManagerPresentMin).max(formBFieldsIsCruiseManagerPresentMax).optional(),
  "permissions": zod.array(PermissionFields).optional(),
  "ugTeams": zod.array(UgTeamFields).optional(),
  "guestTeams": zod.array(GuestTeamFields).optional(),
  "crewMembers": zod.array(CrewMemberFields).optional(),
  "shortResearchEquipments": zod.array(ShortTermResearchEquipmentFields).optional(),
  "longResearchEquipments": zod.array(LongTermResearchEquipmentFields).optional(),
  "ports": zod.array(PortCallFields).optional(),
  "cruiseDaysDetails": zod.array(CruiseDayFields).optional(),
  "researchEquipments": zod.array(ResearchEquipmentFields).optional(),
  "shipEquipmentsIds": zod.array(zod.string().regex(formBFieldsShipEquipmentsIdsItemRegExp)).optional()
});

export type FormBFields = zod.input<typeof FormBFields>;
export type FormBFieldsOutput = zod.output<typeof FormBFields>;
