import { Save } from 'lucide-react';
import { Printer } from 'lucide-react';
import { Send } from 'lucide-react';

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
          className="w-36 !justify-center gap-4 lg:w-48"
          variant="primaryOutline"
          onClick={onSaveDraft}
          disabled={disabled}
        >
          <Save className="h-4 w-4" />
          Zapisz wersję roboczą
        </AppButton>
      )}
      {!isReadonly && (
        <AppButton type="submit" className="w-36 !justify-center gap-4 lg:w-48" disabled={disabled}>
          <Send className="h-4 w-4" />
          Wyślij
        </AppButton>
      )}
      {isReadonly && (
        <AppButton className="w-36 !justify-center gap-4 lg:w-48" onClick={onPrint} disabled={disabled}>
          <Printer className="h-4 w-4" />
          Wydrukuj
        </AppButton>
      )}
    </AppActionsSection>
  );
}
