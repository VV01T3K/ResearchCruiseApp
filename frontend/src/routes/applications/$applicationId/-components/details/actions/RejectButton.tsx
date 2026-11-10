import { XSquareIcon } from '@phosphor-icons/react';

import { Button } from '@/components/shared/Button';

type Props = {
  setConfirmationMode: (value: boolean) => void;
};
export function RejectButton({ setConfirmationMode }: Props) {
  return (
    <>
      <Button className="w-36 !justify-center lg:w-48" variant="danger" onClick={() => setConfirmationMode(true)}>
        <XSquareIcon className="h-4 w-4" />
        Odrzuć zgłoszenie
      </Button>
    </>
  );
}
