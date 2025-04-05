import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { allowOnly } from '@/core/lib/guards';
import { FormCPage } from '@/cruise-applications/pages/FormCPage';

export const Route = createFileRoute('/applications/$applicationId/formC')({
  component: FormCPage,
  beforeLoad: allowOnly.authenticated(),
  validateSearch: z.object({
    mode: z.optional(z.enum(['edit', 'view'])),
  }),
});
