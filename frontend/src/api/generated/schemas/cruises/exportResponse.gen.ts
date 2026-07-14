import { z as zod } from 'zod';

export const ExportResponse = zod.object({
  "name": zod.string(),
  "content": zod.string()
});

export type ExportResponse = zod.input<typeof ExportResponse>;
export type ExportResponseOutput = zod.output<typeof ExportResponse>;
