import UGLogoIcon from '@assets/uglogo.svg?react';
import { useNavigate } from '@tanstack/react-router';
import BoxArrowRightIcon from 'bootstrap-icons/icons/box-arrow-right.svg?react';
import BroadcastIcon from 'bootstrap-icons/icons/broadcast.svg?react';
import EnvelopeIcon from 'bootstrap-icons/icons/envelope.svg?react';
import HouseIcon from 'bootstrap-icons/icons/house.svg?react';

import { AppLink } from '@/core/components/AppLink';
import { useUserContext } from '@/user/hooks/UserContextHook';

export function AppNavbar() {
  const userContext = useUserContext();
  const navigate = useNavigate();

  function openUGRadio() {
    window.open(
      'https://player.mors.ug.edu.pl/sites/all/modules/jplayer/mors_popup.html',
      'newWin',
      'width=280,height=220'
    );
  }

  async function onSignOutButtonClicked() {
    await userContext.signOut();
    await navigate({ to: '/login' });
  }

  return (
    <header className="bg-primary px-8 py-4 flex justify-between items-center z-50 h-[var(--header-height)]">
      <div>
        <AppLink href="https://ug.edu.pl/" title="Strona Główna" rel="home" className="block w-24 text-white">
          <UGLogoIcon />
        </AppLink>
      </div>
      <div className="flex items-center space-x-4">
        <a href="#" onClick={() => openUGRadio()} title="Radio MORS" className="block w-6 text-white">
          <BroadcastIcon />
        </a>
        <AppLink href="https://outlook.com/ug.edu.pl" title="Poczta Uniwersytecka" className="block w-6 text-white">
          <EnvelopeIcon />
        </AppLink>
        <AppLink href="/" title="Strona Domowa" className="block w-6 text-white">
          <HouseIcon />
        </AppLink>
        {userContext.currentUser && (
          <a href="#" onClick={() => onSignOutButtonClicked()} title="Wyloguj" className="block w-6 text-white">
            <BoxArrowRightIcon />
          </a>
        )}
      </div>
    </header>
  );
}
