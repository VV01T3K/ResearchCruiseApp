import TrashFillIcon from 'bootstrap-icons/icons/trash-fill.svg?react';

import { AppButton } from '@/core/components/AppButton';

type Props = {
  onReject: () => void;
  setConfirmationMode: (value: boolean) => void;
};
export function ApplicationDetailsActionCancelConfirmation({ onReject, setConfirmationMode }: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 text-center text-sm font-semibold">
          Po odrzuceniu wymagane będzie ponowne złożenie wniosku
        </div>
        <AppButton
          type="submit"
          className="gap-4 !justify-center w-36 lg:w-48"
          variant="primary"
          onClick={() => setConfirmationMode(false)}
        >
          Anuluj
        </AppButton>
        <AppButton className="gap-4 !justify-center w-36 lg:w-48" variant="danger" onClick={onReject}>
          <TrashFillIcon className="h-4 w-4" />
          Potwierdź odrzucenie
        </AppButton>
      </div>
    </>
  );
}
