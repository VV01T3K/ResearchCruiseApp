import { z } from 'zod';

export type CrewMemberDto = {
  title: string;
  firstName: string;
  lastName: string;
  birthPlace: string;
  birthDate: string;
  documentNumber: string;
  documentExpiryDate: string;
  institution: string;
};

export const CrewMemberDtoValidationSchema = z.object({
  title: z.string().nonempty('Tytuł jest wymagany'),
  firstName: z.string().nonempty('Imię jest wymagane'),
  lastName: z.string().nonempty('Nazwisko jest wymagane'),
  birthPlace: z.string().nonempty('Miejsce urodzenia jest wymagane'),
  birthDate: z.string().nonempty('Data urodzenia jest wymagana'),
  documentNumber: z.string().nonempty('Numer dokumentu jest wymagany'),
  documentExpiryDate: z.string().nonempty('Data ważności dokumentu jest wymagana'),
  institution: z.string().nonempty('Instytucja jest wymagana'),
});
