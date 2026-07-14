import { z as zod } from 'zod';

export const fileDtoNameMin = 0;
export const fileDtoNameMax = 1024;



export const FileDto = zod.object({
  "name": zod.string().min(fileDtoNameMin).max(fileDtoNameMax).optional(),
  "content": zod.string().optional()
});

export type FileDto = zod.input<typeof FileDto>;
export type FileDtoOutput = zod.output<typeof FileDto>;
