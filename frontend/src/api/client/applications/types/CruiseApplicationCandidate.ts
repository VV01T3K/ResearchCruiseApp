import type { CruiseApplicationCandidateResponse } from '@/api/generated/schemas';

export type CruiseApplicationCandidate = {
  [Key in keyof CruiseApplicationCandidateResponse]-?: Exclude<
    CruiseApplicationCandidateResponse[Key],
    null | undefined
  >;
};
