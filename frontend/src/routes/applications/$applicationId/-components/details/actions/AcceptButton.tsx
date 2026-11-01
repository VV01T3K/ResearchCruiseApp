import { CheckIcon } from '@phosphor-icons/react';

import { Button } from '@/components/shared/Button';

type Props = {
  onAccept: () => void;
  disabled: boolean;
};
export function AcceptButton({ onAccept, disabled }: Props) {
  return (
    <>
      <Button className="w-36 !justify-center gap-4 lg:w-48" variant="primary" onClick={onAccept} disabled={disabled}>
        <CheckIcon className="h-4 w-4" />
        Zaakceptuj zgłoszenie
      </Button>
    </>
  );
}
