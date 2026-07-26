import type { BlockadeResponse } from '@/api/generated/schemas';
import type { FormAOptions } from '@/api/client/applications/types/FormAOptions';

export type FormAViewModel = {
  initValues: FormAOptions;
  isReadonly: boolean;
  blockades?: BlockadeResponse[];
};
