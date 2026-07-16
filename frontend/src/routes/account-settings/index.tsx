import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { AppAvatar } from '@/components/shared/AppAvatar';
import { AppLayout } from '@/components/shared/AppLayout';
import { ChangePasswordForm } from './-components/ChangePasswordForm';
import { EmailConfirmationBadge } from './-components/EmailConfirmationBadge';
import { useCurrentUser } from '@/integrations/tanstack/query/auth';

export const Route = createFileRoute('/account-settings/')({
  component: AccountSettingsPage,
  beforeLoad: allowOnly.authenticated(),
});

function AccountSettingsPage() {
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <AppLayout title="Ustawienia konta">
      <div className="space-y-8">
        <header className="flex items-center gap-4">
          <AppAvatar fullName={`${currentUser.firstName} ${currentUser.lastName}`} />
          <div>
            <p className="title text-xl font-semibold">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p>
              {currentUser.email}{' '}
              <EmailConfirmationBadge email={currentUser.email} emailConfirmed={currentUser.emailConfirmed} />
            </p>
          </div>
        </header>
        <hr />
        <ChangePasswordForm />
      </div>
    </AppLayout>
  );
}
