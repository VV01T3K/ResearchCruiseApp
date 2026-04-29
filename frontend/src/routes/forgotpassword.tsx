import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/lib/guards';
import { ForgotPasswordPage } from '@/routes/-forgotpassword/ForgotPasswordPage';

export const Route = createFileRoute('/forgotpassword')({
  component: ForgotPasswordPage,
  beforeLoad: allowOnly.unauthenticated(),
});
