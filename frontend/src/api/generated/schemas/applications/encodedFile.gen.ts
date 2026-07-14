import { z as zod } from 'zod';

export const encodedFileNameMin = 0;
export const encodedFileNameMax = 1024;



export const EncodedFile = zod.object({
  "name": zod.string().min(encodedFileNameMin).max(encodedFileNameMax).optional(),
  "content": zod.string().optional()
});

export type EncodedFile = zod.input<typeof EncodedFile>;
export type EncodedFileOutput = zod.output<typeof EncodedFile>;
