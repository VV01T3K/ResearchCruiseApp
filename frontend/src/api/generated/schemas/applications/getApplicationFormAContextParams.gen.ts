import * as zod from 'zod';

export const getApplicationFormAContextParamsApplicationIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');

export const GetApplicationFormAContextParams = zod.object({
  "applicationId": zod.string().regex(getApplicationFormAContextParamsApplicationIdRegExp).optional()
})

export type GetApplicationFormAContextParams = zod.input<typeof GetApplicationFormAContextParams>;
export type GetApplicationFormAContextParamsOutput = zod.output<typeof GetApplicationFormAContextParams>;
