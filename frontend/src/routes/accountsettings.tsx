import { AppBadge } from '@core/components/AppBadge';
import { AppInitialsAvatar } from '@core/components/AppInitialsAvatar';
import { AppPage } from '@core/components/AppPage';
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
    <AppPage title="Ustawienia konta">
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
    </AppPage>
  );
}
