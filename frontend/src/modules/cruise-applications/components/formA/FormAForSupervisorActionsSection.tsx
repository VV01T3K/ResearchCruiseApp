import CheckIcon from 'bootstrap-icons/icons/check-square-fill.svg?react';
import TrashFillIcon from 'bootstrap-icons/icons/trash-fill.svg?react';

import { AppActionsSection } from '@/core/components/AppActionsSection';
import { AppButton } from '@/core/components/AppButton';

type Props = {
  onAccept?: () => void;
  onDeny?: () => void;
};
export function FormAForSupervisorActionsSection({ onAccept, onDeny }: Props) {
  return (
    <AppActionsSection>
      <AppButton className="gap-4 !justify-center w-36 lg:w-48" variant="danger" onClick={onDeny}>
        <TrashFillIcon className="h-4 w-4" />
        Odrzuć
      </AppButton>
      <AppButton className="gap-4 !justify-center w-36 lg:w-48" onClick={onAccept}>
        <CheckIcon className="h-4 w-4" />
        Zaakceptuj
      </AppButton>
    </AppActionsSection>
  );
}
