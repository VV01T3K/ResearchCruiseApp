import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { allowOnly } from '@/core/lib/guards';
import { FormBPage } from '@/cruise-applications/pages/FormBPage';

export const Route = createFileRoute('/applications/$applicationId/formB')({
  component: FormBPage,
  beforeLoad: allowOnly.authenticated(),
  validateSearch: z.object({
    mode: z.optional(z.enum(['edit', 'view', 'preview'])),
  }),
});
