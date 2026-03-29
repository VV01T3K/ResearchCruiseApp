import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { allowOnly } from '@/lib/guards';
import { FormAPage } from '@/routes/applications/$applicationId/-formA/FormAPage';

export const Route = createFileRoute('/applications/$applicationId/formA')({
  component: FormAPage,
  beforeLoad: allowOnly.authenticated(),
  validateSearch: z.object({
    mode: z.optional(z.enum(['edit', 'view'])),
  }),
});
