import { CheckSquareIcon, XSquareIcon } from '@phosphor-icons/react';

import { FloatingActionsSection } from '@/components/shared/FloatingActionsSection';
import { Button } from '@/components/shared/Button';

type Props = {
  onAccept?: () => void;
  onDeny?: () => void;
};
export function SupervisorActionsSection({ onAccept, onDeny }: Props) {
  return (
    <FloatingActionsSection>
      <Button className="w-36 !justify-center lg:w-48" variant="danger" onClick={onDeny}>
        <XSquareIcon className="h-4 w-4" />
        Odrzuć
      </Button>
      <Button className="w-36 !justify-center lg:w-48" onClick={onAccept}>
        <CheckSquareIcon className="h-4 w-4" />
        Zaakceptuj
      </Button>
    </FloatingActionsSection>
  );
}
