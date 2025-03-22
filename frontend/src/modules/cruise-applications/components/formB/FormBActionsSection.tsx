import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import SendFillIcon from 'bootstrap-icons/icons/send-fill.svg?react';

import { AppActionsSection } from '@/core/components/AppActionsSection';
import { AppButton } from '@/core/components/AppButton';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';

type Props = {
  onSaveDraft: () => void;
  onRevertToEdit?: () => void;
};
export function FormBActionsSection({ onSaveDraft, onRevertToEdit }: Props) {
  const { isReadonly } = useFormB();

  if (isReadonly && !onRevertToEdit) {
    return null;
  }

  return (
    <AppActionsSection>
      {isReadonly && !!onRevertToEdit && (
        <AppButton className="gap-4 !justify-center w-36 lg:w-48" variant="primaryOutline" onClick={onRevertToEdit}>
          Cofnij do edycji
        </AppButton>
      )}
      {!isReadonly && (
        <AppButton className="gap-4 !justify-center w-36 lg:w-48" variant="primaryOutline" onClick={onSaveDraft}>
          <FloppyFillIcon className="h-4 w-4" />
          Zapisz
        </AppButton>
      )}
      {!isReadonly && (
        <AppButton type="submit" className="gap-4 !justify-center w-36 lg:w-48">
          <SendFillIcon className="h-4 w-4" />
          Wyślij
        </AppButton>
      )}
    </AppActionsSection>
  );
}
