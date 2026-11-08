import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { Avatar } from '@/components/shared/Avatar';
import { Layout } from '@/components/shared/Layout';
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
    <Layout title="Ustawienia konta">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="flex items-center gap-4">
          <Avatar fullName={`${currentUser.firstName} ${currentUser.lastName}`} />
          <div>
            <p className="text-xl font-semibold">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p>
              {currentUser.email}{' '}
              <EmailConfirmationBadge email={currentUser.email} emailConfirmed={currentUser.emailConfirmed} />
            </p>
          </div>
        </header>
        <hr className="border-border" />
        <ChangePasswordForm />
      </div>
    </Layout>
  );
}
