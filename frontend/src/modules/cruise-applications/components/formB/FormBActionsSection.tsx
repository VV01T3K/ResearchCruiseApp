import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import PrinterFillIcon from 'bootstrap-icons/icons/printer-fill.svg?react';
import SendFillIcon from 'bootstrap-icons/icons/send-fill.svg?react';

import { AppActionsSection } from '@/core/components/AppActionsSection';
import { AppButton } from '@/core/components/AppButton';
import { AppGuard } from '@/core/components/AppGuard';
import { Role } from '@/core/models/Role';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';

type Props = {
  onSaveDraft: () => void;
  onRevertToEdit?: () => void;
  onPrint?: () => void;
  disabled?: boolean;
};
export function FormBActionsSection({ onSaveDraft, onRevertToEdit, onPrint, disabled }: Props) {
  const { isReadonly } = useFormB();

  return (
    <AppActionsSection>
      <AppGuard allowedRoles={[Role.Administrator, Role.ShipOwner]}>
        {isReadonly && !!onRevertToEdit && (
          <AppButton
            className="gap-4 !justify-center w-36 lg:w-48"
            variant="primaryOutline"
            onClick={onRevertToEdit}
            disabled={disabled}
          >
            Cofnij do edycji
          </AppButton>
        )}
      </AppGuard>
      {!isReadonly && (
        <AppButton
          className="gap-4 !justify-center w-36 lg:w-48"
          variant="primaryOutline"
          onClick={onSaveDraft}
          disabled={disabled}
        >
          <FloppyFillIcon className="h-4 w-4" />
          Zapisz
        </AppButton>
      )}
      {!isReadonly && (
        <AppButton type="submit" className="gap-4 !justify-center w-36 lg:w-48" disabled={disabled}>
          <SendFillIcon className="h-4 w-4" />
          Wyślij
        </AppButton>
      )}
      {isReadonly && (
        <AppButton className="gap-4 !justify-center w-36 lg:w-48" onClick={onPrint} disabled={disabled}>
          <PrinterFillIcon className="h-4 w-4" />
          Wydrukuj
        </AppButton>
      )}
    </AppActionsSection>
  );
}
