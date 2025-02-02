import { AppAvatar } from '@/core/components/AppAvatar';
import { AppLayout } from '@/core/components/AppLayout';
import { ChangePasswordForm } from '@/user/components/ChangePasswordForm';
import { EmailConfirmationBadge } from '@/user/components/EmailConfirmationBadge';
import { useUserContext } from '@/user/hooks/UserContextHook';

export function AccountSettingsPage() {
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
