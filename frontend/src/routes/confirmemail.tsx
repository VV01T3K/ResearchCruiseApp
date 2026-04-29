import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { allowOnly } from '@/lib/guards';
import { ConfirmEmailPage } from '@/routes/-confirmemail/ConfirmEmailPage';

export const Route = createFileRoute('/confirmemail')({
  component: ConfirmEmailPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({
    userId: z.guid().optional(),
    code: z.string().optional(),
  }),
});
