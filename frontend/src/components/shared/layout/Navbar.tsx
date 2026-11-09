import anchorLogoUrl from '@/assets/anchor.svg';
import ugLogoUrl from '@/assets/uglogo.svg';
import { BroadcastIcon, EnvelopeSimpleIcon, SignOutIcon } from '@phosphor-icons/react';

import { Button } from '@/components/shared/Button';
import { Anchor, Link } from '@/components/shared/Link';
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
    <header
      id="header"
      className="z-50 flex h-[var(--header-height)] items-center justify-between gap-4 bg-primary px-2 py-4 sm:px-4 md:px-6 lg:px-8 phone:flex-wrap phone:content-center phone:gap-y-1 phone:px-4 phone:py-2"
    >
      <div className="@container min-w-0 flex-1 phone:basis-full">
        <div className="w-fit max-w-full origin-left flex-col items-end transition-transform duration-200 ease-out sm:flex sm:flex-row sm:gap-1 sm:font-thin @min-[39rem]:hover:scale-103 @min-[39rem]:has-focus-visible:scale-103 phone:flex phone:flex-row phone:gap-1">
          <Link
            to="/"
            title="Portal rejsów badawczych R/V Oceanograf – strona główna"
            variant="white"
            className="pr-4 text-inverse-foreground transition-opacity hover:no-underline hover:opacity-80 focus-visible:opacity-80 sm:truncate sm:text-2xl phone:truncate"
          >
            <img src={anchorLogoUrl} alt="" aria-hidden className="mr-2 inline h-[1.2em] align-[-0.25em]" />
            Portal rejsów badawczych R/V Oceanograf
          </Link>
          <Anchor href={`${config.repositoryUrl}/releases/latest`} variant="white" className="shrink-0 text-xs">
            {config.version}
          </Anchor>
        </div>
      </div>
      <div className="flex shrink-0 gap-6 phone:ml-auto">
        <div className="w-4 transition-opacity hover:opacity-75">
          <Anchor
            href="https://ug.edu.pl"
            target="_blank"
            title="Uniwersytet Gdański"
            variant="white"
            className="text-inverse-foreground"
          >
            <img src={ugLogoUrl} alt="" className="h-full w-full object-contain" />
          </Anchor>
        </div>
        <div className="inline-grid w-6 place-items-center transition-opacity hover:opacity-75">
          <Button
            onClick={() => openUGRadio()}
            title="Radio MORS"
            variant="plain"
            className="p-0 text-inverse-foreground"
          >
            <BroadcastIcon />
          </Button>
        </div>
        <div className="inline-grid w-6 place-items-center transition-opacity hover:opacity-75">
          <Anchor
            href="https://outlook.com/ug.edu.pl"
            target="_blank"
            title="Poczta Uniwersytecka"
            variant="white"
            className="text-inverse-foreground"
          >
            <EnvelopeSimpleIcon />
          </Anchor>
        </div>
        {currentUser && (
          <div className="flex items-center gap-4 transition-opacity duration-200 ease-out starting:opacity-0">
            {authDetails?.refreshTokenExpirationDate && (
              <SessionStatusBadge
                refreshTokenExpirationDate={new Date(authDetails.refreshTokenExpirationDate)}
                onRefresh={refresh}
              />
            )}
            <div className="inline-grid w-6 place-items-center transition-opacity hover:opacity-75">
              <Button
                onClick={() => void onSignOutButtonClicked()}
                title="Wyloguj"
                variant="plain"
                className="p-0 text-inverse-foreground"
              >
                <SignOutIcon />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
