import { FloppyDiskIcon, PaperPlaneTiltIcon, PrinterIcon } from '@phosphor-icons/react';

import { FloatingActionsSection } from '@/components/shared/FloatingActionsSection';
import { Button } from '@/components/shared/Button';
import { Guard } from '@/components/shared/Guard';
import { Role } from '@/integrations/auth/types';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';

type Props = {
  onSaveDraft: () => void;
  onRevertToEdit?: () => void;
  onPrint?: () => void;
  disabled?: boolean;
  context: Pick<FormBViewModel, 'isReadonly'>;
};
export function ActionsSection({ onSaveDraft, onRevertToEdit, onPrint, disabled, context }: Props) {
  const { isReadonly } = context;

  return (
    <FloatingActionsSection>
      <Guard allowedRoles={[Role.Administrator, Role.ShipOwner]}>
        {isReadonly && !!onRevertToEdit && (
          <Button
            className="w-64 !justify-center"
            variant="primaryOutline"
            onClick={onRevertToEdit}
            disabled={disabled}
          >
            Cofnij do edycji
          </Button>
        )}
      </Guard>
      {!isReadonly && (
        <Button className="w-64 !justify-center" variant="primaryOutline" onClick={onSaveDraft} disabled={disabled}>
          <FloppyDiskIcon className="h-4 w-4" />
          Zapisz wersję roboczą
        </Button>
      )}
      {!isReadonly && (
        <Button type="submit" className="w-64 !justify-center" disabled={disabled}>
          <PaperPlaneTiltIcon className="h-4 w-4" />
          Wyślij
        </Button>
      )}
      {isReadonly && (
        <Button className="w-64 !justify-center" onClick={onPrint} disabled={disabled}>
          <PrinterIcon className="h-4 w-4" />
          Wydrukuj
        </Button>
      )}
    </FloatingActionsSection>
  );
}
