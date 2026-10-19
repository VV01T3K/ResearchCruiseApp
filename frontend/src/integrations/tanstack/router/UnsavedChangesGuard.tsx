import { type AnyFormApi, evaluate } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { useBlocker, useLocation } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

import { AppButton } from '@/components/shared/AppButton';
import { AppModal } from '@/components/shared/AppModal';
import { toast } from '@/components/shared/layout/toast';

type Props = {
  form: Pick<AnyFormApi, 'state' | 'setFieldValue'>;
  disabled?: boolean;
};

export function UnsavedChangesGuard({ form, disabled = false }: Props) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const queryClient = useQueryClient();
  const hasUnsavedChanges = () => !disabled && form.state.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: ({ current, next }) =>
      hasUnsavedChanges() &&
      (current.pathname !== next.pathname || JSON.stringify(current.search) !== JSON.stringify(next.search)),
    enableBeforeUnload: hasUnsavedChanges,
    disabled,
    withResolver: true,
  });

  useLayoutEffect(() => {
    if (disabled) return;
    // Kept in the query cache so that ending the session clears them with the account's data.
    const queryKey = ['unsaved-form', pathname];
    const changed = Object.entries(queryClient.getQueryData<Record<string, unknown>>(queryKey) ?? {}).filter(
      ([name, value]) => !evaluate(value, form.state.values[name])
    );
    changed.forEach(([name, value]) => form.setFieldValue(name, value, { dontValidate: true }));
    if (changed.length > 0) toast.success('Przywrócono niezapisane zmiany');
    return () => {
      if (form.state.isDirty) queryClient.setQueryData(queryKey, form.state.values);
      else queryClient.removeQueries({ queryKey, exact: true });
    };
  }, [form, disabled, pathname, queryClient]);

  return (
    <AppModal title="Niezapisane zmiany" isOpen={blocker.status === 'blocked'} onClose={() => blocker.reset?.()}>
      <div className="space-y-4">
        <p>Formularz zawiera niezapisane zmiany. Jeśli opuścisz stronę, mogą zostać utracone.</p>
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
