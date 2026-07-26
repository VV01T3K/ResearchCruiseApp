import { Save } from 'lucide-react';
import { Printer } from 'lucide-react';
import { Send } from 'lucide-react';

import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppButton } from '@/components/shared/AppButton';
import { AppGuard } from '@/components/shared/AppGuard';
import { Role } from '@/api/client/user';
import type { FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';

type Props = {
  onSaveDraft: () => void;
  onRevertToEdit?: () => void;
  onPrint?: () => void;
  disabled?: boolean;
  context: FormBViewModel;
};
export function ActionsSection({ onSaveDraft, onRevertToEdit, onPrint, disabled, context }: Props) {
  const { isReadonly } = context;

  return (
    <AppActionsSection>
      <AppGuard allowedRoles={[Role.Administrator, Role.ShipOwner]}>
        {isReadonly && !!onRevertToEdit && (
          <AppButton
            className="w-36 !justify-center gap-4 lg:w-48"
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
