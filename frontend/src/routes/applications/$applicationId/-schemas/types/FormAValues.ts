import { z } from 'zod';

/**
 * Represents a Fortnight (first half of January for 0, second half of January for 1, etc.)
 */
export type FortnightType = z.input<typeof FortnightValidationSchema>;
export const FortnightValidationSchema = z.enum([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
]);

/**
 * Represents a Cruise Period
 * @example ['0', '1'] // represents the period from first half of January to second half of January
 */
export type CruisePeriodType = z.input<typeof CruisePeriodValidationSchema>;
export const CruisePeriodValidationSchema = z
  .tuple([FortnightValidationSchema, FortnightValidationSchema])
  .or(z.literal(''));

export enum CruiseGoal {
  Research = '0',
  Commercial = '1',
  Educational = '2',
}
