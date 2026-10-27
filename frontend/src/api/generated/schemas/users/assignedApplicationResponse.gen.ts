import * as zod from 'zod';
import { CruiseApplicationStatus } from '../cruiseApplicationStatus.gen.ts';

export const assignedApplicationResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const AssignedApplicationResponse = zod.object({
  "id": zod.string().regex(assignedApplicationResponseIdRegExp),
  "number": zod.string(),
  "isDeputy": zod.boolean(),
  "status": CruiseApplicationStatus
});

export type AssignedApplicationResponse = zod.input<typeof AssignedApplicationResponse>;
export type AssignedApplicationResponseOutput = zod.output<typeof AssignedApplicationResponse>;
