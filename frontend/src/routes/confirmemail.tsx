import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { allowOnly } from '@/core/lib/guards';
import { ConfirmEmailPage } from '@/user/pages/ConfirmEmailPage';

export const Route = createFileRoute('/confirmemail')({
  component: ConfirmEmailPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({
    userId: z.string().uuid().optional(),
    code: z.string().optional(),
  }),
});
