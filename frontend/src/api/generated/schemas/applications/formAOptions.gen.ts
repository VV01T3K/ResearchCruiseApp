import { z as zod } from 'zod';
import { ContractFields } from './contractFields.gen.ts';
import { PublicationFields } from './publicationFields.gen.ts';
import { ResearchAreaOption } from './researchAreaOption.gen.ts';
import { ResearchTaskFields } from './researchTaskFields.gen.ts';
import { SpubTaskFields } from './spubTaskFields.gen.ts';
import { UgUnitOption } from './ugUnitOption.gen.ts';
import { UserOption } from './userOption.gen.ts';

export const FormAOptions = zod.object({
  "cruiseManagers": zod.array(UserOption).optional(),
  "deputyManagers": zod.array(UserOption).optional(),
  "years": zod.array(zod.string()).optional(),
  "shipUsages": zod.array(zod.string()).optional(),
  "standardSpubTasks": zod.array(zod.string()).optional(),
  "researchAreas": zod.array(ResearchAreaOption).optional(),
  "cruiseGoals": zod.array(zod.string()).optional(),
  "historicalResearchTasks": zod.array(ResearchTaskFields).optional(),
  "historicalContracts": zod.array(ContractFields).optional(),
  "ugUnits": zod.array(UgUnitOption).optional(),
  "historicalGuestInstitutions": zod.array(zod.string()).optional(),
  "historicalSpubTasks": zod.array(SpubTaskFields).optional(),
  "historicalPublications": zod.array(PublicationFields).optional()
});

export type FormAOptions = zod.input<typeof FormAOptions>;
export type FormAOptionsOutput = zod.output<typeof FormAOptions>;
