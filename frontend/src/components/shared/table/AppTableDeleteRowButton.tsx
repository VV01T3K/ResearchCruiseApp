import { Trash2 } from 'lucide-react';

import { AppButton } from '@/components/shared/AppButton';

type Props = {
  onClick: () => void;
  disabled?: boolean;
};
export function AppTableDeleteRowButton({ onClick, disabled }: Props) {
  return (
    <AppButton variant="dangerOutline" size="square" onClick={onClick} title="Usuń wiersz" disabled={disabled}>
      <Trash2 className="h-5 w-5" />
    </AppButton>
  );
}
