import type { BlockadeResponse } from '@/api/generated/schemas';
import type { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';

export type FormAViewModel = {
  initValues: FormAOptions;
  submissionAttempts: number;
  isReadonly: boolean;
  blockades?: BlockadeResponse[];
};
