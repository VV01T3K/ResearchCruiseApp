import { z as zod } from 'zod';

export const namedUgTeamUgUnitNameMin = 0;
export const namedUgTeamUgUnitNameMax = 1024;

export const namedUgTeamNoOfEmployeesMin = 0;
export const namedUgTeamNoOfEmployeesMax = 1024;

export const namedUgTeamNoOfStudentsMin = 0;
export const namedUgTeamNoOfStudentsMax = 1024;



export const NamedUgTeam = zod.object({
  "ugUnitName": zod.string().min(namedUgTeamUgUnitNameMin).max(namedUgTeamUgUnitNameMax).optional(),
  "noOfEmployees": zod.string().min(namedUgTeamNoOfEmployeesMin).max(namedUgTeamNoOfEmployeesMax).optional(),
  "noOfStudents": zod.string().min(namedUgTeamNoOfStudentsMin).max(namedUgTeamNoOfStudentsMax).optional()
});

export type NamedUgTeam = zod.input<typeof NamedUgTeam>;
export type NamedUgTeamOutput = zod.output<typeof NamedUgTeam>;
