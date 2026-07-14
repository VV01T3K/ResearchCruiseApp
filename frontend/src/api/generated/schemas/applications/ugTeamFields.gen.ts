import { z as zod } from 'zod';

export const ugTeamFieldsUgUnitIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const ugTeamFieldsNoOfEmployeesMin = 0;
export const ugTeamFieldsNoOfEmployeesMax = 1024;

export const ugTeamFieldsNoOfStudentsMin = 0;
export const ugTeamFieldsNoOfStudentsMax = 1024;



export const UgTeamFields = zod.object({
  "ugUnitId": zod.string().regex(ugTeamFieldsUgUnitIdRegExp),
  "noOfEmployees": zod.string().min(ugTeamFieldsNoOfEmployeesMin).max(ugTeamFieldsNoOfEmployeesMax),
  "noOfStudents": zod.string().min(ugTeamFieldsNoOfStudentsMin).max(ugTeamFieldsNoOfStudentsMax)
});

export type UgTeamFields = zod.input<typeof UgTeamFields>;
export type UgTeamFieldsOutput = zod.output<typeof UgTeamFields>;
