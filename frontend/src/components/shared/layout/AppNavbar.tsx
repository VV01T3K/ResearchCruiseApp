import UGLogoIcon from '@/assets/uglogo.svg?react';
import BoxArrowRightIcon from 'bootstrap-icons/icons/box-arrow-right.svg?react';
import BroadcastIcon from 'bootstrap-icons/icons/broadcast.svg?react';
import EnvelopeIcon from 'bootstrap-icons/icons/envelope.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import packageJson from '../../../../package.json';

import { AppButton } from '@/components/shared/AppButton';
import { AppLink } from '@/components/shared/AppLink';
import { SessionStatusBadge } from '@/components/shared/SessionStatusBadge';
import { useAuthDetails, useCurrentUser, useSessionActions } from '@/integrations/tanstack/query/auth';

export function AppNavbar() {
  const currentUser = useCurrentUser();
  const authDetails = useAuthDetails();
  const { refresh, signOut } = useSessionActions();

  function openUGRadio() {
    window.open(
      'https://player.mors.ug.edu.pl/sites/all/modules/jplayer/mors_popup.html',
      'newWin',
      'width=280,height=220'
    );
  }

  async function onSignOutButtonClicked() {
    await signOut();
  }

  return (
    <motion.header
      id="header"
      className="z-50 flex h-[var(--header-height)] items-center justify-between gap-2 bg-primary px-2 py-4 [--focus-ring-color:var(--color-white)] sm:px-4 md:px-6 lg:px-8"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-w-0">
        <motion.div
          whileHover={{ scale: 1.1, translateX: '5%' }}
          className="flex-col items-end sm:flex sm:flex-row sm:font-thin"
        >
          <AppLink
            href="/"
            title="Strona Główna"
            className="block text-sm leading-tight text-white hover:no-underline sm:inline sm:pr-4 sm:text-xl lg:text-2xl"
          >
            <span className="lg:hidden">R/V Oceanograf</span>
            <span className="hidden lg:inline">Portal rejsów badawczych R/V Oceanograf</span>
          </AppLink>
          <AppLink
            href={`${packageJson.repository}/releases/latest`}
            variant="white"
            className="text-[0.625rem] sm:text-xs"
          >
            {packageJson.version}
          </AppLink>
        </motion.div>
      </div>
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-4 md:gap-6">
        <motion.div className="inline-grid size-7 place-items-center sm:size-8" whileHover={{ scale: 1.3 }}>
          <AppLink
            href="https://ug.edu.pl"
            target="_blank"
            title="Uniwersytet Gdański"
            className="grid size-7 place-items-center text-white sm:size-8"
          >
            <UGLogoIcon className="h-6 w-4" />
          </AppLink>
        </motion.div>
        <motion.div className="inline-grid size-7 place-items-center sm:size-8" whileHover={{ scale: 1.3 }}>
          <AppButton
            onClick={() => openUGRadio()}
            title="Radio MORS"
            variant="plain"
            className="size-7 p-0 text-white sm:size-8"
          >
            <BroadcastIcon className="size-5" />
          </AppButton>
        </motion.div>
        <motion.div className="inline-grid size-7 place-items-center sm:size-8" whileHover={{ scale: 1.3 }}>
          <AppLink
            href="https://outlook.com/ug.edu.pl"
            target="_blank"
            title="Poczta Uniwersytecka"
            className="grid size-7 place-items-center text-white sm:size-8"
          >
            <EnvelopeIcon className="size-5" />
          </AppLink>
        </motion.div>
        <AnimatePresence>
          {currentUser && (
            <motion.div
              className="flex items-center gap-1 sm:gap-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              {authDetails?.refreshTokenExpirationDate && (
                <SessionStatusBadge
                  refreshTokenExpirationDate={new Date(authDetails.refreshTokenExpirationDate)}
                  onRefresh={refresh}
                />
              )}
              <motion.div className="inline-grid size-7 place-items-center sm:size-8" whileHover={{ scale: 1.3 }}>
                <AppButton
                  onClick={() => onSignOutButtonClicked()}
                  title="Wyloguj"
                  data-testid="sign-out-btn"
                  variant="plain"
                  className="size-7 p-0 text-white sm:size-8"
                >
                  <BoxArrowRightIcon className="size-5" />
                </AppButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
