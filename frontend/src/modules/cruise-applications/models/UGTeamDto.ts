import { z } from 'zod';

export type UGTeamDto = {
  ugUnitId: string;
  noOfEmployees: string;
  noOfStudents: string;
};

export const UGTeamDtoValidationSchema = z.object({
  ugUnitId: z.string().uuid(),
  noOfEmployees: z.string().refine((val) => {
    const parsed = parseInt(val, 10);
    return !isNaN(parsed) && parsed >= 0;
  }, 'Liczba pracowników musi być liczbą nieujemną'),
  noOfStudents: z.string().refine((val) => {
    const parsed = parseInt(val, 10);
    return !isNaN(parsed) && parsed >= 0;
  }, 'Liczba studentów musi być liczbą nieujemną'),
});
