import { FloppyDiskIcon, PaperPlaneTiltIcon, PrinterIcon } from '@phosphor-icons/react';

import { FloatingActionsSection } from '@/components/shared/FloatingActionsSection';
import { Button } from '@/components/shared/Button';
import type { FormCViewModel } from '@/features/applications/models/formC-view-model';

type Props = {
  onSaveDraft: () => void;
  onPrint?: () => void;
  disabled?: boolean;
  context: FormCViewModel;
};
export function ActionsSection({ onSaveDraft, onPrint, disabled, context }: Props) {
  const { isReadonly } = context;

  return (
    <FloatingActionsSection>
      {!isReadonly && (
        <Button className="w-64 !justify-center" variant="primaryOutline" onClick={onSaveDraft} disabled={disabled}>
          <FloppyDiskIcon weight="fill" className="h-4 w-4" />
          Zapisz wersję roboczą
        </Button>
      )}
      {!isReadonly && (
        <Button type="submit" className="w-64 !justify-center" disabled={disabled}>
          <PaperPlaneTiltIcon weight="fill" className="h-4 w-4" />
          Wyślij
        </Button>
      )}
      {isReadonly && (
        <Button className="w-64 !justify-center" onClick={onPrint} disabled={disabled}>
          <PrinterIcon weight="fill" className="h-4 w-4" />
          Wydrukuj
        </Button>
      )}
    </FloatingActionsSection>
  );
}
