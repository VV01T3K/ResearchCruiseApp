import { CheckSquareIcon, TrashIcon } from '@phosphor-icons/react';

import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppButton } from '@/components/shared/AppButton';

type Props = {
  onAccept?: () => void;
  onDeny?: () => void;
};
export function SupervisorActionsSection({ onAccept, onDeny }: Props) {
  return (
    <AppActionsSection>
      <AppButton className="w-36 !justify-center gap-4 lg:w-48" variant="danger" onClick={onDeny}>
        <TrashIcon weight="fill" className="h-4 w-4" />
        Odrzuć
      </AppButton>
      <AppButton className="w-36 !justify-center gap-4 lg:w-48" onClick={onAccept}>
        <CheckSquareIcon className="h-4 w-4" />
        Zaakceptuj
      </AppButton>
    </AppActionsSection>
  );
}
