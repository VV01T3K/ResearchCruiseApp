import { XSquareIcon } from '@phosphor-icons/react';

import { Button } from '@/components/shared/Button';

type Props = {
  onReject: () => void;
  setConfirmationMode: (value: boolean) => void;
  disabled: boolean;
};
export function RejectConfirmation({ onReject, setConfirmationMode, disabled }: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 text-center text-sm font-semibold">
          Po odrzuceniu wymagane będzie ponowne złożenie wniosku
        </div>
        <Button
          type="submit"
          className="w-36 !justify-center lg:w-48"
          variant="primary"
          onClick={() => setConfirmationMode(false)}
        >
          Anuluj
        </Button>
        <Button
          className="w-36 !justify-center lg:w-48"
          variant="danger"
          disabled={disabled}
          onClick={() => {
            onReject();
            setConfirmationMode(false);
          }}
        >
          <XSquareIcon className="h-4 w-4" />
          Potwierdź odrzucenie
        </Button>
      </div>
    </>
  );
}
