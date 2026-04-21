import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { allowOnly } from '@/lib/guards';
import { LoginPage } from '@/routes/-login/LoginPage';

export const Route = createFileRoute('/login')({
  component: LoginPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({ redirect: z.string().optional() }),
});
