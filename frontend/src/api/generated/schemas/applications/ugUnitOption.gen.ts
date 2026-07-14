import { z as zod } from 'zod';

export const ugUnitOptionIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const UgUnitOption = zod.object({
  "id": zod.string().regex(ugUnitOptionIdRegExp).optional(),
  "name": zod.string().optional()
});

export type UgUnitOption = zod.input<typeof UgUnitOption>;
export type UgUnitOptionOutput = zod.output<typeof UgUnitOption>;
