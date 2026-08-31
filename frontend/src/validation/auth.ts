import { z } from 'zod';

export const loginValidationSchema = z.object({
  email: z.email('Nieprawidłowy adres email'),
  password: z.string().nonempty('Hasło nie może być puste'),
});
