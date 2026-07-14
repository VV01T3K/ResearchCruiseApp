import { z } from 'zod';

export const UgTeamValuesSchema = z.object({
  ugUnitId: z.guid(),
  noOfEmployees: z.number().nonnegative('Liczba pracowników musi być liczbą nieujemną'),
  noOfStudents: z.number().nonnegative('Liczba studentów musi być liczbą nieujemną'),
});

export type UgTeamValues = z.infer<typeof UgTeamValuesSchema>;
