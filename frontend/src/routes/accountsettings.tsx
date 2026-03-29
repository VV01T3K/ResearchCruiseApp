import { createFileRoute } from '@tanstack/react-router';

import { AppAvatar } from '@/components/AppAvatar';
import { AppLayout } from '@/components/AppLayout';
import { ChangePasswordForm } from '@/features/user/components/ChangePasswordForm';
import { EmailConfirmationBadge } from '@/features/user/components/EmailConfirmationBadge';
import { allowOnly } from '@/lib/guards';
import { useUserContext } from '@/providers/useUserContext';

export const Route = createFileRoute('/accountsettings')({
  component: AccountSettingsPage,
  beforeLoad: allowOnly.authenticated(),
});

function AccountSettingsPage() {
  const userContext = useUserContext();

  if (!userContext.currentUser) {
    return null;
  }

  return (
    <AppLayout title="Ustawienia konta">
      <div className="space-y-8">
        <header className="flex items-center gap-4">
          <AppAvatar fullName={`${userContext.currentUser.firstName} ${userContext.currentUser.lastName}`} />
          <div>
            <p className="title text-xl font-semibold">
              {userContext.currentUser.firstName} {userContext.currentUser.lastName}
            </p>
            <p>
              {userContext.currentUser?.email}{' '}
              <EmailConfirmationBadge emailConfirmed={userContext.currentUser.emailConfirmed} />
            </p>
          </div>
        </header>
        <hr />
        <ChangePasswordForm />
      </div>
    </AppLayout>
  );
}
