import { z as zod } from 'zod';

export const ugUnitDtoIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const UgUnitDto = zod.object({
  "id": zod.string().regex(ugUnitDtoIdRegExp).optional(),
  "name": zod.string().optional()
});

export type UgUnitDto = zod.input<typeof UgUnitDto>;
export type UgUnitDtoOutput = zod.output<typeof UgUnitDto>;
