import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { allowOnly } from '@/lib/guards';
import { NewCruisePage } from '@/routes/cruises/-new/NewCruisePage';

const searchSchema = z.object({
  blockade: z.boolean().optional(),
});

export const Route = createFileRoute('/cruises/new')({
  component: NewCruisePage,
  beforeLoad: allowOnly.authenticated(),
  validateSearch: searchSchema,
});
