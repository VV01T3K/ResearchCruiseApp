import { z as zod } from 'zod';

export const getCruiseBlockadesParamsYearRegExpTwo = new RegExp('^-?(?:0|[1-9]\\d*)$');

export const GetCruiseBlockadesParams = zod.object({
  "year": zod.union([zod.number(),zod.stringFormat('int32', getCruiseBlockadesParamsYearRegExpTwo)])
})

export type GetCruiseBlockadesParams = zod.input<typeof GetCruiseBlockadesParams>;
export type GetCruiseBlockadesParamsOutput = zod.output<typeof GetCruiseBlockadesParams>;
