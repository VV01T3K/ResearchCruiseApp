import { z } from 'zod';

export const PortCallValuesInputSchema = z.object({
  name: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const PortCallValuesSchema = PortCallValuesInputSchema.extend({
  name: z.string().nonempty('Nazwa jest wymagana'),
  startTime: z.string().nonempty('Czas rozpoczęcia jest wymagany'),
  endTime: z.string().nonempty('Czas zakończenia jest wymagany'),
});

export type PortCallValues = z.input<typeof PortCallValuesInputSchema>;
