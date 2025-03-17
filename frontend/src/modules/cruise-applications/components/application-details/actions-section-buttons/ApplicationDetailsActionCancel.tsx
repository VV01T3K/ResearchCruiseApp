import TrashFillIcon from 'bootstrap-icons/icons/trash-fill.svg?react';

import { AppButton } from '@/core/components/AppButton';

type Props = {
  setConfirmationMode: (value: boolean) => void;
};
export function ApplicationDetailsActionCancel({ setConfirmationMode }: Props) {
  return (
    <>
      <AppButton
        className="gap-4 !justify-center w-36 lg:w-48"
        variant="danger"
        onClick={() => setConfirmationMode(true)}
      >
        <TrashFillIcon className="h-4 w-4" />
        Odrzuć zgłoszenie
      </AppButton>
    </>
  );
}
