import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { RegisterPage } from '@/routes/-register/RegisterPage';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
  beforeLoad: allowOnly.unauthenticated(),
});
