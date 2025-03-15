import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import SendFillIcon from 'bootstrap-icons/icons/send-fill.svg?react';

import { AppActionsSection } from '@/core/components/AppActionsSection';
import { AppButton } from '@/core/components/AppButton';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';

type Props = {
  onSaveDraft?: () => void;
};
export function FormAActionsSection({ onSaveDraft }: Props) {
  const { isReadonly } = useFormA();

  if (isReadonly) {
    return null;
  }

  return (
    <AppActionsSection>
      <AppButton className="gap-4 !justify-center w-36 lg:w-48" variant="primaryOutline" onClick={onSaveDraft}>
        <FloppyFillIcon className="h-4 w-4" />
        Zapisz
      </AppButton>
      <AppButton type="submit" className="gap-4 !justify-center w-36 lg:w-48">
        <SendFillIcon className="h-4 w-4" />
        Wyślij
      </AppButton>
    </AppActionsSection>
  );
}
