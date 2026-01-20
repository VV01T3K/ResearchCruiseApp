import CheckLgIcon from 'bootstrap-icons/icons/check-lg.svg?react';

import { AppButton } from '@/core/components/AppButton';

type Props = {
  onAccept: () => void;
};
export function ApplicationDetailsActionAccept({ onAccept }: Props) {
  return (
    <>
      <AppButton className="w-36 !justify-center gap-4 lg:w-48" variant="primary" onClick={onAccept}>
        <CheckLgIcon className="h-4 w-4" />
        Zaakceptuj zgłoszenie
      </AppButton>
    </>
  );
}
