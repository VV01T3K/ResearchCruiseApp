import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';

import { AppButton } from '@/components/AppButton';

type Props = {
  onClick: () => void;
  disabled?: boolean;
};
export function AppTableDeleteRowButton({ onClick, disabled }: Props) {
  return (
    <AppButton variant="dangerOutline" size="square" onClick={onClick} title="Usuń wiersz" disabled={disabled}>
      <TrashIcon className="h-5 w-5" />
    </AppButton>
  );
}
