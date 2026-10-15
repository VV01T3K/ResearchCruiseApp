import type { AnyFormApi } from '@tanstack/react-form';
import { useBlocker } from '@tanstack/react-router';

import { AppButton } from '@/components/shared/AppButton';
import { AppModal } from '@/components/shared/AppModal';

type Props = {
  form: Pick<AnyFormApi, 'state'>;
  disabled?: boolean;
};

export function UnsavedChangesGuard({ form, disabled = false }: Props) {
  const hasUnsavedChanges = () => !disabled && form.state.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: ({ current, next }) =>
      hasUnsavedChanges() &&
      (current.pathname !== next.pathname || JSON.stringify(current.search) !== JSON.stringify(next.search)),
    enableBeforeUnload: hasUnsavedChanges,
    disabled,
    withResolver: true,
  });

  return (
    <AppModal title="Niezapisane zmiany" isOpen={blocker.status === 'blocked'} onClose={() => blocker.reset?.()}>
      <div className="space-y-4">
        <p>Formularz zawiera niezapisane zmiany. Jeśli opuścisz stronę, zostaną utracone.</p>
        <div className="flex flex-wrap justify-end gap-4">
          <AppButton variant="primaryOutline" onClick={() => blocker.reset?.()}>
            Zostań na stronie
          </AppButton>
          <AppButton variant="danger" onClick={() => blocker.proceed?.()}>
            Opuść bez zapisywania
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
}
