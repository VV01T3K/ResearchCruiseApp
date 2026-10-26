import { TrashIcon } from '@phosphor-icons/react';

import { AppButton } from '@/components/shared/AppButton';

type Props = {
  setConfirmationMode: (value: boolean) => void;
};
export function RejectButton({ setConfirmationMode }: Props) {
  return (
    <>
      <AppButton
        className="w-36 !justify-center gap-4 lg:w-48"
        variant="danger"
        onClick={() => setConfirmationMode(true)}
      >
        <TrashIcon weight="fill" className="h-4 w-4" />
        Odrzuć zgłoszenie
      </AppButton>
    </>
  );
}
