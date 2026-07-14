import { z as zod } from 'zod';
import { EffectResponse } from './effectResponse.gen.ts';

export const cruiseEffectResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const cruiseEffectResponseUserIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const CruiseEffectResponse = zod.object({
  "id": zod.string().regex(cruiseEffectResponseIdRegExp),
  "userId": zod.string().regex(cruiseEffectResponseUserIdRegExp),
  "effect": EffectResponse,
  "points": zod.string(),
  "cruiseApplicationId": zod.string()
});

export type CruiseEffectResponse = zod.input<typeof CruiseEffectResponse>;
export type CruiseEffectResponseOutput = zod.output<typeof CruiseEffectResponse>;
