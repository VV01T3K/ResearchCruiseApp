import { CheckIcon } from '@phosphor-icons/react';

import { Button } from '@/components/shared/Button';

type Props = {
  onAccept: () => void;
};
export function AcceptButton({ onAccept }: Props) {
  return (
    <>
      <Button className="w-36 !justify-center gap-4 lg:w-48" variant="primary" onClick={onAccept}>
        <CheckIcon className="h-4 w-4" />
        Zaakceptuj zgłoszenie
      </Button>
    </>
  );
}
