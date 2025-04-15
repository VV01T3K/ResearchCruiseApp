import { ErrorComponentProps } from '@tanstack/react-router';
import EmojiSmileUpsideDownIcon from 'bootstrap-icons/icons/emoji-smile-upside-down.svg?react';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppLink } from '@/core/components/AppLink';
import AppBackground from '@/core/components/layout/AppBackground';
import { AppNavbar } from '@/core/components/layout/AppNavbar';
import { AppNetworkDisconnectAlert } from '@/core/components/layout/AppNetworkDisconnectAlert';

export function AppErrorHandler({ error }: ErrorComponentProps) {
  return (
    <>
      <div className="sticky top-0 z-100">
        <div className="relative z-100">
          <AppNavbar />
        </div>
        <div className="absolute z-90 w-full">
          <AppNetworkDisconnectAlert />
        </div>
      </div>
      <AppBackground />
      <AppLayout title={'Wystąpił nieoczekiwany błąd'} variant="narrow">
        <div className="space-y-8">
          <div className="h-60">
            <EmojiSmileUpsideDownIcon />
          </div>
          <div className="flex justify-center items-center gap-2 text-lg">
            <div>Opis błędu: </div>
            <div className="font-semibold">{error.message}</div>
          </div>
          <div className="text-center">
            Prosimy o maila na adres <AppLink href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</AppLink>.
          </div>
          <AppButton type="link" href="/" className="w-full">
            Przejdź do strony głównej
          </AppButton>
        </div>
      </AppLayout>
    </>
  );
}
