import { UserContext } from '@core/contexts/UserContext';
import { useRouter } from '@tanstack/react-router';
import { useContext } from 'react';
import UGLogoIcon from '@assets/uglogo.svg?react';
import BroadcastIcon from 'bootstrap-icons/icons/broadcast.svg?react';
import EnvelopeIcon from 'bootstrap-icons/icons/envelope.svg?react';
import HouseIcon from 'bootstrap-icons/icons/house.svg?react';
import LogoutIcon from 'bootstrap-icons/icons/box-arrow-right.svg?react';
import { AppLink } from './AppLink';

export function AppHeader() {
  const userContext = useContext(UserContext);
  const router = useRouter();

  function openRadio() {
    window.open(
      'https://player.mors.ug.edu.pl/sites/all/modules/jplayer/mors_popup.html',
      'newWin',
      'width=280,height=220'
    );
  }

  async function signOut() {
    await userContext?.signOut();
    await router.navigate({ to: '/login' });
  }

  return (
    <header className="bg-primary px-8 py-4 flex justify-between items-center z-50">
      <div>
        <AppLink to="https://ug.edu.pl/" title="Strona Główna" rel="home" className="block w-24 text-white">
          <UGLogoIcon />
        </AppLink>
      </div>
      <div className="flex items-center space-x-4">
        <a href="#" onClick={openRadio} title="Radio MORS" className="block w-6 text-white">
          <BroadcastIcon />
        </a>
        <AppLink to="https://outlook.com/ug.edu.pl" title="Poczta Uniwersytecka" className="block w-6 text-white">
          <EnvelopeIcon />
        </AppLink>
        <AppLink to="/" title="Strona Domowa" className="block w-6 text-white">
          <HouseIcon />
        </AppLink>
        {userContext?.currentUser ? (
          <a href="#" onClick={signOut} title="Wyloguj" className="block w-6 text-white">
            <LogoutIcon />
          </a>
        ) : null}
      </div>
    </header>
  );
}
