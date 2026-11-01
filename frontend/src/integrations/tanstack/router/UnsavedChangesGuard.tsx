import { type AnyFormApi, evaluate } from '@tanstack/react-form';
import { useBlocker } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { clearFormRecovery, getFormRecovery, registerRecoverableForm } from '@/integrations/tanstack/form/recovery';

type Props = {
  form: Pick<AnyFormApi, 'state' | 'setFieldValue'>;
  disabled?: boolean;
  recoveryKey?: string;
  saving?: { readonly current?: SavingValues };
};

export type SavingValues = { values: unknown; accepted?: boolean };

export function UnsavedChangesGuard({ form, disabled = false, recoveryKey, saving }: Props) {
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

  // An accepted save only waits for its refetch, so leaving loses nothing unless the user edited since.
  const isSaved = () => !!saving?.current?.accepted && evaluate(form.state.values, saving.current.values);
  const hasUnsavedChanges = () => !disabled && form.state.isDirty && !isSaved();

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
      <Modal title="Odzyskane zmiany" isOpen={!!recovered} onClose={() => {}} dismissible={false}>
        <div className="space-y-4">
          <p>
            Sesja zakończyła się, zanim formularz został zapisany. Możesz przywrócić niezapisane zmiany i zapisać je
            ponownie albo je odrzucić.
          </p>
          <div className="flex flex-wrap justify-end gap-4">
            <Button variant="dangerOutline" onClick={() => closeRecovery(false)}>
              Odrzuć zmiany
            </Button>
            <Button onClick={() => closeRecovery(true)}>Przywróć zmiany</Button>
          </div>
        </div>
      </Modal>
      <Modal title="Niezapisane zmiany" isOpen={blocker.status === 'blocked'} onClose={() => blocker.reset?.()}>
        <div className="space-y-4">
          <p>Formularz zawiera niezapisane zmiany. Jeśli opuścisz stronę, zostaną utracone.</p>
          <div className="flex flex-wrap justify-end gap-4">
            <Button variant="primaryOutline" onClick={() => blocker.reset?.()}>
              Zostań na stronie
            </Button>
            <Button variant="danger" onClick={() => blocker.proceed?.()}>
              Opuść bez zapisywania
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
