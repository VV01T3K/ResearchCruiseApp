import * as zod from 'zod';
import { AssignedApplicationResponse } from './assignedApplicationResponse.gen.ts';
import { AssignedCruiseResponse } from './assignedCruiseResponse.gen.ts';

export const UserAssignmentsResponse = zod.object({
  "applications": zod.array(AssignedApplicationResponse),
  "cruises": zod.array(AssignedCruiseResponse),
  "closedCount": zod.int()
});

export type UserAssignmentsResponse = zod.input<typeof UserAssignmentsResponse>;
export type UserAssignmentsResponseOutput = zod.output<typeof UserAssignmentsResponse>;
