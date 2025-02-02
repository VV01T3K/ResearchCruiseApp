import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { RegisterPage } from '@/user/pages/RegisterPage';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
  beforeLoad: allowOnly.unauthenticated(),
});
