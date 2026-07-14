import type { CruiseApplicationSummary } from '@/api/generated/schemas';

import type { DeepRequired } from '@/types/utils';

export type CruiseApplicationCandidate = DeepRequired<CruiseApplicationSummary>;
