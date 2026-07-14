import { z } from 'zod';

export const CrewMemberValuesSchema = z.object({
  title: z.string().nonempty('Tytuł jest wymagany'),
  firstName: z.string().nonempty('Imię jest wymagane'),
  lastName: z.string().nonempty('Nazwisko jest wymagane'),
  birthPlace: z.string().nonempty('Miejsce urodzenia jest wymagane'),
  birthDate: z.string().nonempty('Data urodzenia jest wymagana'),
  documentNumber: z.string().nonempty('Numer dokumentu jest wymagany'),
  documentExpiryDate: z.string().nonempty('Data ważności dokumentu jest wymagana'),
  institution: z.string().nonempty('Instytucja jest wymagana'),
});

export type CrewMemberValues = z.infer<typeof CrewMemberValuesSchema>;
