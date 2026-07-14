import { z as zod } from 'zod';
import { EncodedFile } from './encodedFile.gen.ts';

export const permissionFieldsDescriptionMin = 0;
export const permissionFieldsDescriptionMax = 1024;

export const permissionFieldsExecutiveMin = 0;
export const permissionFieldsExecutiveMax = 1024;



export const PermissionFields = zod.object({
  "description": zod.string().min(permissionFieldsDescriptionMin).max(permissionFieldsDescriptionMax).nullish(),
  "executive": zod.string().min(permissionFieldsExecutiveMin).max(permissionFieldsExecutiveMax).nullish(),
  "scan": zod.union([zod.null(),EncodedFile]).optional()
});

export type PermissionFields = zod.input<typeof PermissionFields>;
export type PermissionFieldsOutput = zod.output<typeof PermissionFields>;
