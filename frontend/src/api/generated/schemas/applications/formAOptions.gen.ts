import { z as zod } from 'zod';
import { ContractFields } from './contractFields.gen.ts';
import { PublicationFields } from './publicationFields.gen.ts';
import { ResearchAreaOption } from './researchAreaOption.gen.ts';
import { ResearchTaskFields } from './researchTaskFields.gen.ts';
import { SpubTaskFields } from './spubTaskFields.gen.ts';
import { UgUnitOption } from './ugUnitOption.gen.ts';
import { UserOption } from './userOption.gen.ts';

export const FormAOptions = zod.object({
  "cruiseManagers": zod.array(UserOption),
  "deputyManagers": zod.array(UserOption),
  "years": zod.array(zod.string()),
  "shipUsages": zod.array(zod.string()),
  "standardSpubTasks": zod.array(zod.string()),
  "researchAreas": zod.array(ResearchAreaOption),
  "cruiseGoals": zod.array(zod.string()),
  "historicalResearchTasks": zod.array(ResearchTaskFields),
  "historicalContracts": zod.array(ContractFields),
  "ugUnits": zod.array(UgUnitOption),
  "historicalGuestInstitutions": zod.array(zod.string()),
  "historicalSpubTasks": zod.array(SpubTaskFields),
  "historicalPublications": zod.array(PublicationFields)
});

export type FormAOptions = zod.input<typeof FormAOptions>;
export type FormAOptionsOutput = zod.output<typeof FormAOptions>;
