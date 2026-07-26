import { SquareCheck } from 'lucide-react';
import { Trash2 } from 'lucide-react';

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
        <Trash2 className="h-4 w-4" />
        Odrzuć
      </AppButton>
      <AppButton className="w-36 !justify-center gap-4 lg:w-48" onClick={onAccept}>
        <SquareCheck className="h-4 w-4" />
        Zaakceptuj
      </AppButton>
    </AppActionsSection>
  );
}
