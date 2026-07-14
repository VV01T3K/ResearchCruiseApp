import { z as zod } from 'zod';

export const ugTeamDtoUgUnitIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const ugTeamDtoNoOfEmployeesMin = 0;
export const ugTeamDtoNoOfEmployeesMax = 1024;

export const ugTeamDtoNoOfStudentsMin = 0;
export const ugTeamDtoNoOfStudentsMax = 1024;



export const UgTeamDto = zod.object({
  "ugUnitId": zod.string().regex(ugTeamDtoUgUnitIdRegExp).optional(),
  "noOfEmployees": zod.string().min(ugTeamDtoNoOfEmployeesMin).max(ugTeamDtoNoOfEmployeesMax).optional(),
  "noOfStudents": zod.string().min(ugTeamDtoNoOfStudentsMin).max(ugTeamDtoNoOfStudentsMax).optional()
});

export type UgTeamDto = zod.input<typeof UgTeamDto>;
export type UgTeamDtoOutput = zod.output<typeof UgTeamDto>;
