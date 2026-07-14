import { z as zod } from 'zod';
import { FileContent } from './fileContent.gen.ts';

export const permissionFieldsDescriptionMin = 0;
export const permissionFieldsDescriptionMax = 1024;

export const permissionFieldsExecutiveMin = 0;
export const permissionFieldsExecutiveMax = 1024;



export const PermissionFields = zod.object({
  "description": zod.string().min(permissionFieldsDescriptionMin).max(permissionFieldsDescriptionMax).nullable(),
  "executive": zod.string().min(permissionFieldsExecutiveMin).max(permissionFieldsExecutiveMax).nullable(),
  "scan": zod.union([zod.null(),FileContent])
});

export type PermissionFields = zod.input<typeof PermissionFields>;
export type PermissionFieldsOutput = zod.output<typeof PermissionFields>;
