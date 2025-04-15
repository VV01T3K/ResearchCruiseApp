import { useRouter } from '@tanstack/react-router';
import EmojiNeutralIcon from 'bootstrap-icons/icons/emoji-neutral.svg?react';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';

export function AppPageNotFoundHandler() {
  const router = useRouter();
  return (
    <AppLayout title={'Strona nie znaleziona'} variant="narrow">
      <div className="space-y-8">
        <div className="h-60">
          <EmojiNeutralIcon />
        </div>
        <div className="text-center">
          Strona o adresie <span className="font-semibold">{router.state.location.pathname}</span> nie została
          znaleziona.
        </div>
        <AppButton type="link" href="/" className="w-full">
          Przejdź do strony głównej
        </AppButton>
      </div>
    </AppLayout>
  );
}
