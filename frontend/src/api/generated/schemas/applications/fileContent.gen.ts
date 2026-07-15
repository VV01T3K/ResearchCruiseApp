import { z as zod } from 'zod';

export const fileContentNameMin = 0;
export const fileContentNameMax = 1024;



export const FileContent = zod.object({
  "name": zod.string().min(fileContentNameMin).max(fileContentNameMax).optional(),
  "content": zod.string().optional()
});

export type FileContent = zod.input<typeof FileContent>;
export type FileContentOutput = zod.output<typeof FileContent>;
