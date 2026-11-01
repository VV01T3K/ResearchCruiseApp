import { CheckIcon } from '@phosphor-icons/react';

import { AppButton } from '@/components/shared/AppButton';

type Props = {
  onAccept: () => void;
  disabled: boolean;
};
export function AcceptButton({ onAccept, disabled }: Props) {
  return (
    <>
      <AppButton
        className="w-36 !justify-center gap-4 lg:w-48"
        variant="primary"
        onClick={onAccept}
        disabled={disabled}
      >
        <CheckIcon className="h-4 w-4" />
        Zaakceptuj zgłoszenie
      </AppButton>
    </>
  );
}
