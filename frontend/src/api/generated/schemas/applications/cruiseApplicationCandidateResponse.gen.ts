import { z as zod } from 'zod';

export const cruiseApplicationCandidateResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const cruiseApplicationCandidateResponseCruiseManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const cruiseApplicationCandidateResponseDeputyManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const CruiseApplicationCandidateResponse = zod.object({
  "id": zod.string().regex(cruiseApplicationCandidateResponseIdRegExp),
  "number": zod.string(),
  "year": zod.number(),
  "cruiseManagerId": zod.string().regex(cruiseApplicationCandidateResponseCruiseManagerIdRegExp),
  "cruiseManagerFirstName": zod.string(),
  "cruiseManagerLastName": zod.string(),
  "deputyManagerId": zod.string().regex(cruiseApplicationCandidateResponseDeputyManagerIdRegExp),
  "hasFormA": zod.boolean(),
  "hasFormB": zod.boolean(),
  "hasFormC": zod.boolean(),
  "points": zod.number()
});

export type CruiseApplicationCandidateResponse = zod.input<typeof CruiseApplicationCandidateResponse>;
export type CruiseApplicationCandidateResponseOutput = zod.output<typeof CruiseApplicationCandidateResponse>;
