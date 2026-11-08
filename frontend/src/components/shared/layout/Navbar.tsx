import ugLogoUrl from '@/assets/uglogo.svg';
import { BroadcastIcon, EnvelopeSimpleIcon, SignOutIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';

import { Button } from '@/components/shared/Button';
import { Link } from '@/components/shared/Link';
import { SessionStatusBadge } from '@/components/shared/SessionStatusBadge';
import config from '@/config';
import { useAuthDetails, useCurrentUser, useSessionActions } from '@/integrations/tanstack/query/auth';

export function Navbar() {
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
      className="z-50 flex h-[var(--header-height)] items-center justify-between gap-4 bg-primary px-2 py-4 sm:px-4 md:px-6 lg:px-8 phone:flex-wrap phone:content-center phone:gap-y-1 phone:px-4 phone:py-2"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-w-0 phone:basis-full">
        <div className="flex-col items-end transition-transform duration-300 sm:flex sm:flex-row sm:gap-1 sm:font-thin lg:hover:translate-x-[5%] lg:hover:scale-110 phone:flex phone:flex-row phone:gap-1">
          <Link
            href="/"
            title="Portal rejsów badawczych R/V Oceanograf – strona główna"
            className="pr-4 text-inverse-foreground hover:no-underline sm:truncate sm:text-2xl phone:truncate"
          >
            Portal rejsów badawczych R/V Oceanograf
          </Link>
          <Link href={`${config.repositoryUrl}/releases/latest`} variant="white" className="shrink-0 text-xs">
            {config.version}
          </Link>
        </div>
      </div>
      <div className="flex shrink-0 gap-6 phone:ml-auto">
        <motion.div className="w-4" whileHover={{ scale: 1.3 }}>
          <Link
            href="https://ug.edu.pl"
            target="_blank"
            title="Uniwersytet Gdański"
            className="text-inverse-foreground"
          >
            <img src={ugLogoUrl} alt="" className="h-full w-full object-contain" />
          </Link>
        </motion.div>
        <motion.div className="inline-grid w-6 place-items-center" whileHover={{ scale: 1.3 }}>
          <Button
            onClick={() => openUGRadio()}
            title="Radio MORS"
            variant="plain"
            className="p-0 text-inverse-foreground"
          >
            <BroadcastIcon />
          </Button>
        </motion.div>
        <motion.div className="inline-grid w-6 place-items-center" whileHover={{ scale: 1.3 }}>
          <Link
            href="https://outlook.com/ug.edu.pl"
            target="_blank"
            title="Poczta Uniwersytecka"
            className="text-inverse-foreground"
          >
            <EnvelopeSimpleIcon />
          </Link>
        </motion.div>
        <AnimatePresence>
          {currentUser && (
            <motion.div
              className="flex items-center gap-4"
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
              <motion.div className="inline-grid w-6 place-items-center" whileHover={{ scale: 1.3 }}>
                <Button
                  onClick={() => void onSignOutButtonClicked()}
                  title="Wyloguj"
                  variant="plain"
                  className="p-0 text-inverse-foreground"
                >
                  <SignOutIcon />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
