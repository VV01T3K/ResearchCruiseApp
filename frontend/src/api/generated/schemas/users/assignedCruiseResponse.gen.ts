import * as zod from 'zod';
import { CruiseStatus } from '../cruiseStatus.gen.ts';

export const assignedCruiseResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const AssignedCruiseResponse = zod.object({
  "id": zod.string().regex(assignedCruiseResponseIdRegExp),
  "number": zod.string(),
  "isDeputy": zod.boolean(),
  "status": CruiseStatus
});

export type AssignedCruiseResponse = zod.input<typeof AssignedCruiseResponse>;
export type AssignedCruiseResponseOutput = zod.output<typeof AssignedCruiseResponse>;
