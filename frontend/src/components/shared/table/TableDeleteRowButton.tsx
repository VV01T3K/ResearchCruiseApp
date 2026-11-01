import { TrashIcon } from '@phosphor-icons/react';

import { Button } from '@/components/shared/Button';

type Props = {
  onClick: () => void;
  disabled?: boolean;
};
export function TableDeleteRowButton({ onClick, disabled }: Props) {
  return (
    <Button variant="dangerOutline" size="square" onClick={onClick} title="Usuń wiersz" disabled={disabled}>
      <TrashIcon className="h-5 w-5" />
    </Button>
  );
}
