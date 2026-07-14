import { z } from 'zod';

export const UGTeamDtoValidationSchema = z.object({
  ugUnitId: z.guid(),
  noOfEmployees: z.string().refine((val) => {
    const parsed = parseInt(val, 10);
    return !isNaN(parsed) && parsed >= 0;
  }, 'Liczba pracowników musi być liczbą nieujemną'),
  noOfStudents: z.string().refine((val) => {
    const parsed = parseInt(val, 10);
    return !isNaN(parsed) && parsed >= 0;
  }, 'Liczba studentów musi być liczbą nieujemną'),
});

export type UGTeamDto = z.infer<typeof UGTeamDtoValidationSchema>;
