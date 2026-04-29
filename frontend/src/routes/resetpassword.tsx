import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { allowOnly } from '@/lib/guards';
import { ResetPasswordPage } from '@/routes/-resetpassword/ResetPasswordPage';

export const Route = createFileRoute('/resetpassword')({
  component: ResetPasswordPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({
    emailBase64: z.string().optional(),
    resetCode: z.string().optional(),
  }),
});
