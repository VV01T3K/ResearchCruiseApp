import { z as zod } from 'zod';

export const getApplicationsForCruisePlanningParamsCruiseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');

export const GetApplicationsForCruisePlanningParams = zod.object({
  "cruiseId": zod.string().regex(getApplicationsForCruisePlanningParamsCruiseIdRegExp).optional()
})

export type GetApplicationsForCruisePlanningParams = zod.input<typeof GetApplicationsForCruisePlanningParams>;
export type GetApplicationsForCruisePlanningParamsOutput = zod.output<typeof GetApplicationsForCruisePlanningParams>;
