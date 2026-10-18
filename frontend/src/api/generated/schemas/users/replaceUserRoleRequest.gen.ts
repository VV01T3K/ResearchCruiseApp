import * as zod from 'zod';

export const ReplaceUserRoleRequest = zod.object({
  "roleName": zod.string()
});

export type ReplaceUserRoleRequest = zod.input<typeof ReplaceUserRoleRequest>;
export type ReplaceUserRoleRequestOutput = zod.output<typeof ReplaceUserRoleRequest>;
