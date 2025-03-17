import UGLogoIcon from '@assets/uglogo.svg?react';
import { useNavigate } from '@tanstack/react-router';
import BoxArrowRightIcon from 'bootstrap-icons/icons/box-arrow-right.svg?react';
import BroadcastIcon from 'bootstrap-icons/icons/broadcast.svg?react';
import EnvelopeIcon from 'bootstrap-icons/icons/envelope.svg?react';
import { AnimatePresence, motion } from 'motion/react';

import { AppButton } from '@/core/components/AppButton';
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
    <motion.header
      id="header"
      className="bg-primary px-2 sm:px-4 md:px-6 lg:px-8 py-4 flex justify-between items-center z-50 h-[var(--header-height)]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <motion.div whileHover={{ scale: 1.1, translateX: '5%' }}>
          <AppLink
            href="/"
            title="Strona Główna"
            className="text-white pr-4 sm:text-2xl sm:font-thin hover:no-underline"
          >
            Portal rejsów badawczych R/V Oceanograf
          </AppLink>
        </motion.div>
      </div>
      <div className="flex gap-6">
        <motion.div className="w-4" whileHover={{ scale: 1.3 }}>
          <AppLink href="https://ug.edu.pl" target="_blank" title="Uniwersytet Gdański" className="text-white">
            <UGLogoIcon />
          </AppLink>
        </motion.div>
        <motion.div className="w-6 inline-grid place-items-center" whileHover={{ scale: 1.3 }}>
          <AppButton onClick={() => openUGRadio()} title="Radio MORS" variant="plain" className="text-white p-0">
            <BroadcastIcon />
          </AppButton>
        </motion.div>
        <motion.div className="w-6 inline-grid place-items-center" whileHover={{ scale: 1.3 }}>
          <AppLink
            href="https://outlook.com/ug.edu.pl"
            target="_blank"
            title="Poczta Uniwersytecka"
            className="text-white"
          >
            <EnvelopeIcon />
          </AppLink>
        </motion.div>
        <AnimatePresence>
          {userContext.currentUser && (
            <motion.div
              className="w-6 inline-grid place-items-center"
              whileHover={{ scale: 1.3 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <AppButton
                onClick={() => onSignOutButtonClicked()}
                title="Wyloguj"
                variant="plain"
                className="text-white p-0"
              >
                <BoxArrowRightIcon />
              </AppButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
