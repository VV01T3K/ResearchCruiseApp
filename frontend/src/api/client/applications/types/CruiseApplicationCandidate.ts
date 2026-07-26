import type { CruiseApplicationSummary } from '@/api/generated/schemas';

export type CruiseApplicationCandidate = {
  [Key in keyof CruiseApplicationSummary]-?: Exclude<CruiseApplicationSummary[Key], null | undefined>;
};
