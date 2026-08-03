import { z as zod } from 'zod';

export const cruiseApplicationCandidateResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const cruiseApplicationCandidateResponseCruiseManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const cruiseApplicationCandidateResponseDeputyManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const CruiseApplicationCandidateResponse = zod.object({
  "id": zod.string().regex(cruiseApplicationCandidateResponseIdRegExp).optional(),
  "number": zod.string().optional(),
  "year": zod.number().optional(),
  "cruiseManagerId": zod.string().regex(cruiseApplicationCandidateResponseCruiseManagerIdRegExp).optional(),
  "cruiseManagerFirstName": zod.string().optional(),
  "cruiseManagerLastName": zod.string().optional(),
  "deputyManagerId": zod.string().regex(cruiseApplicationCandidateResponseDeputyManagerIdRegExp).optional(),
  "hasFormA": zod.boolean().optional(),
  "hasFormB": zod.boolean().optional(),
  "hasFormC": zod.boolean().optional(),
  "points": zod.number().optional()
});

export type CruiseApplicationCandidateResponse = zod.input<typeof CruiseApplicationCandidateResponse>;
export type CruiseApplicationCandidateResponseOutput = zod.output<typeof CruiseApplicationCandidateResponse>;
