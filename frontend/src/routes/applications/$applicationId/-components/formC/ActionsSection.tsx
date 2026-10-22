import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import PrinterFillIcon from 'bootstrap-icons/icons/printer-fill.svg?react';
import SendFillIcon from 'bootstrap-icons/icons/send-fill.svg?react';

import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppButton } from '@/components/shared/AppButton';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';

type Props = {
  onSaveDraft: () => void;
  onPrint?: () => void;
  disabled?: boolean;
  context: FormCViewModel;
};
export function ActionsSection({ onSaveDraft, onPrint, disabled, context }: Props) {
  const { isReadonly } = context;

  return (
    <AppActionsSection>
      {!isReadonly && (
        <AppButton
          className="w-64 !justify-center gap-4"
          variant="primaryOutline"
          onClick={onSaveDraft}
          disabled={disabled}
        >
          <FloppyFillIcon className="h-4 w-4" />
          Zapisz wersję roboczą
        </AppButton>
      )}
      {!isReadonly && (
        <AppButton type="submit" className="w-64 !justify-center gap-4" disabled={disabled}>
          <SendFillIcon className="h-4 w-4" />
          Wyślij
        </AppButton>
      )}
      {isReadonly && (
        <AppButton className="w-64 !justify-center gap-4" onClick={onPrint} disabled={disabled}>
          <PrinterFillIcon className="h-4 w-4" />
          Wydrukuj
        </AppButton>
      )}
    </AppActionsSection>
  );
}
