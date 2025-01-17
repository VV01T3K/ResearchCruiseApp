import { AppBadge } from '@core/components/AppBadge';
import { AppInitialsAvatar } from '@core/components/AppInitialsAvatar';
import { UserContext } from '@core/contexts/UserContext';
import { guardAgainstUnauthenticated } from '@core/guards';
import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import { ChangePasswordForm } from 'src/features/accountsettings/components/ChangePasswordForm';

export const Route = createFileRoute('/accountsettings')({
  component: RouteComponent,
  beforeLoad: guardAgainstUnauthenticated,
});

function RouteComponent() {
  const userContext = useContext(UserContext)!;

  function getEmailConfirmationBadge() {
    if (userContext.currentUser?.emailConfirmed) {
      return <AppBadge variant="green">Potwierdzony adres e-mail</AppBadge>;
    }

    return <AppBadge variant="red">Niepotwierdzony adres e-mail</AppBadge>;
  }

  return (
    <div className="p-4 w-full min-h-screen backdrop-blur-md relative">
      <div className="max-w-screen-2xl mx-auto px-4 py-16 bg-gray-50 rounded-xl mt-[25vh]">
        <header>
          <h1 className="text-3xl font-bold text-center mb-2">
            Ustawienia konta
          </h1>
        </header>
        <div className="space-y-8">
          <header className="flex items-center gap-4">
            <AppInitialsAvatar />
            <div>
              <p className="title text-xl font-semibold">
                {userContext.currentUser?.firstName}{' '}
                {userContext.currentUser?.lastName}
              </p>
              <p>
                {userContext.currentUser?.email} {getEmailConfirmationBadge()}
              </p>
            </div>
          </header>
          <hr />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
