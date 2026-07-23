import { Save as FloppyFillIcon } from 'lucide-react';
import { Printer as PrinterFillIcon } from 'lucide-react';
import { Send as SendFillIcon } from 'lucide-react';

import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppButton } from '@/components/shared/AppButton';
import { useFormC } from '@/contexts/applications/FormCContext';

type Props = {
  onSaveDraft: () => void;
  onPrint?: () => void;
  disabled?: boolean;
};
export function ActionsSection({ onSaveDraft, onPrint, disabled }: Props) {
  const { isReadonly } = useFormC();

  return (
    <AppActionsSection>
      {!isReadonly && (
        <AppButton
          className="w-36 !justify-center gap-4 lg:w-48"
          variant="primaryOutline"
          onClick={onSaveDraft}
          disabled={disabled}
        >
          <FloppyFillIcon className="h-4 w-4" />
          Zapisz wersję roboczą
        </AppButton>
      )}
      {!isReadonly && (
        <AppButton type="submit" className="w-36 !justify-center gap-4 lg:w-48" disabled={disabled}>
          <SendFillIcon className="h-4 w-4" />
          Wyślij
        </AppButton>
      )}
      {isReadonly && (
        <AppButton className="w-36 !justify-center gap-4 lg:w-48" onClick={onPrint} disabled={disabled}>
          <PrinterFillIcon className="h-4 w-4" />
          Wydrukuj
        </AppButton>
      )}
    </AppActionsSection>
  );
}
