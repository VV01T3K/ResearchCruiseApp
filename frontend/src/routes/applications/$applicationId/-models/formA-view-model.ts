import type { BlockadeResponse } from '@/api/generated/schemas';
import type { FormAOptions } from '@/api/generated/schemas';

export type FormAViewModel = {
  initValues: FormAOptions;
  isReadonly: boolean;
  blockades?: BlockadeResponse[];
};
