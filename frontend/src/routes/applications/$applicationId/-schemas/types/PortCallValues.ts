import { z } from 'zod';

export const PortCallValuesSchema = z.object({
  name: z.string().nonempty('Nazwa jest wymagana'),
  startTime: z.string().nonempty('Czas rozpoczęcia jest wymagany'),
  endTime: z.string().nonempty('Czas zakończenia jest wymagany'),
});

export type PortCallValues = z.infer<typeof PortCallValuesSchema>;
