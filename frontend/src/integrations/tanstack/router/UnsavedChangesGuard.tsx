import { type AnyFormApi, evaluate } from '@tanstack/react-form';
import { useBlocker } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { AppButton } from '@/components/shared/AppButton';
import { AppModal } from '@/components/shared/AppModal';
import { clearFormRecovery, getFormRecovery, registerRecoverableForm } from '@/integrations/tanstack/form/recovery';

type Props = {
  form: Pick<AnyFormApi, 'state' | 'setFieldValue'>;
  disabled?: boolean;
  recoveryKey?: string;
};

export function UnsavedChangesGuard({ form, disabled = false, recoveryKey }: Props) {
  const [recovered, setRecovered] = useState(() =>
    recoveryKey && !disabled ? getFormRecovery(recoveryKey) : undefined
  );

  useEffect(() => {
    return recoveryKey && !disabled ? registerRecoverableForm(recoveryKey, form) : undefined;
  }, [recoveryKey, disabled, form]);

  function closeRecovery(restore: boolean) {
    if (restore && recovered) {
      for (const [name, value] of Object.entries(recovered)) {
        if (!evaluate(value, form.state.values[name])) form.setFieldValue(name, value);
      }
    }
    if (recoveryKey) clearFormRecovery(recoveryKey);
    setRecovered(undefined);
  }

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
    <>
      <AppModal title="Odzyskane zmiany" isOpen={!!recovered} onClose={() => {}} dismissible={false}>
        <div className="space-y-4">
          <p>
            Sesja zakończyła się, zanim formularz został zapisany. Możesz przywrócić niezapisane zmiany i zapisać je
            ponownie albo je odrzucić.
          </p>
          <div className="flex flex-wrap justify-end gap-4">
            <AppButton variant="dangerOutline" onClick={() => closeRecovery(false)}>
              Odrzuć zmiany
            </AppButton>
            <AppButton onClick={() => closeRecovery(true)}>Przywróć zmiany</AppButton>
          </div>
        </div>
      </AppModal>
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
    </>
  );
}
