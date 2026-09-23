import { LoginRequest } from '@/api/generated/schemas';
import { formContract } from '@/integrations/tanstack/form/schema';
import { z } from 'zod';

export const loginValidationSchema = z
  .object({
    email: z.email('Nieprawidłowy adres email'),
    password: z.string().nonempty('Hasło nie może być puste'),
  })
  .pipe(formContract(LoginRequest));
