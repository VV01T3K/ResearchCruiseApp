import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { allowOnly } from '@/core/lib/guards';
import { LoginPage } from '@/user/pages/LoginPage';

export const Route = createFileRoute('/login')({
  component: LoginPage,
  beforeLoad: allowOnly.unauthenticated(),
  validateSearch: z.object({ redirect: z.string().optional() }),
});
