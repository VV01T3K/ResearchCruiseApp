import { createFileRoute } from '@tanstack/react-router';

import { allowOnly } from '@/core/lib/guards';
import { ForgotPasswordPage } from '@/user/pages/ForgotPasswordPage';

export const Route = createFileRoute('/forgotpassword')({
  component: ForgotPasswordPage,
  beforeLoad: allowOnly.unauthenticated(),
});
