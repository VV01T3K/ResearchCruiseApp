import { FloppyDiskIcon, PaperPlaneTiltIcon, PrinterIcon } from '@phosphor-icons/react';

import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppButton } from '@/components/shared/AppButton';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';

type Props = {
  onSaveDraft?: () => void;
  onPrint?: () => void;
  disabled?: boolean;
  context: FormAViewModel;
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
          <FloppyDiskIcon weight="fill" className="h-4 w-4" />
          Zapisz wersję roboczą
        </AppButton>
      )}
      {!isReadonly && (
        <AppButton
          type="submit"
          className="w-64 !justify-center gap-4"
          disabled={disabled}
          data-testid="form-submit-btn"
        >
          <PaperPlaneTiltIcon weight="fill" className="h-4 w-4" />
          Wyślij
        </AppButton>
      )}
      {isReadonly && (
        <AppButton className="w-64 !justify-center gap-4" onClick={onPrint} disabled={disabled}>
          <PrinterIcon weight="fill" className="h-4 w-4" />
          Wydrukuj
        </AppButton>
      )}
    </AppActionsSection>
  );
}
